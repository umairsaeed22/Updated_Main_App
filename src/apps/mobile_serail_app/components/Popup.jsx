import React, { useState, useRef, useEffect } from 'react';
import { verifySerial, reportMissing } from '../services/api';
import { useGRNStore } from '../store/useGRNStore';

const Popup = ({
  product,
  onClose,
  isScanning,
  setIsScanning,
  currentScanIndex,
  setCurrentScanIndex,
}) => {
  const [scannedData, setScannedData] = useState('');
  const [scannedCount, setScannedCount] = useState(0);
  const [isVerified, setIsVerified] = useState(false);
  const [isReportingMissing, setIsReportingMissing] = useState(false);
  const [missingDescription, setMissingDescription] = useState('');
  const [reportStatus, setReportStatus] = useState('Submit Report');
  const [scanStatusMessage, setScanStatusMessage] = useState('Waiting for scan...');
  const [scannedSerials, setScannedSerials] = useState([]);
  const [productData, setProductData] = useState('');
  const inputRef = useRef(null);
  const grnData = useGRNStore();
  const [user, setUser] = useState(null);
  const [employee, setEmployee] = useState(null);
  useEffect(() => {
    const userString = localStorage.getItem('handHeldUser');
    const parsedUser = userString ? JSON.parse(userString) : null;
    setUser(parsedUser);

    const employeeString = localStorage.getItem('handHeldEmployee');
    const parsedEmployee = employeeString ? JSON.parse(employeeString) : null;
    setEmployee(parsedEmployee);
  }, [])

  useEffect(() => {
    setProductData(product);

  }, [product]);
  console.log({ productData })
  const focusInput = () => inputRef.current?.focus();

  useEffect(() => {
    focusInput();
    const interval = setInterval(focusInput, 500);
    return () => clearInterval(interval);
  }, []);

  const handleStartScanning = () => {
    setIsScanning(true);
    setIsReportingMissing(false);
    setScannedData('');
    setScannedCount(0);
    setCurrentScanIndex(0);
    setIsVerified(false);
    setScanStatusMessage('Waiting for scan...');
    focusInput();
  };

  const handleReportSubmits = async () => {
    if (!missingDescription.trim()) return;

    setReportStatus('Submitting...');

    try {
      const response = await reportMissing(
        product?.missingQty,
        product?.itemRef,
        missingDescription,
        user?.id
      );

      if (!response || response.code !== '1') {
        throw new Error(response?.message || 'No response from the server.');
      }

      console.log('Missing Item Reported:', response.message);
      setReportStatus('Submitted');
      setMissingDescription('');

      // Popup auto-close
      setTimeout(() => {
        setIsReportingMissing(false);
        setReportStatus('Submit Report');
        onClose();
      }, 1000);
    } catch (error) {
      setReportStatus(
        `Error: ${error?.message || 'An error occurred while reporting missing item.'}`
      );
      console.error('Report submit failed:', error);

      setTimeout(() => {
        setReportStatus('Submit Report');
      }, 2000);
    }

  };


  const handleDone = () => {
    onClose();
  };

  const handleSerialScan = async (serialNumber) => {
    if (!serialNumber.trim()) return;

    const itemRef = productData?.itemRef;
    const payload = {
      SerialNumber: serialNumber,
      itemRef: itemRef,
      User: user?.id,
      Site: employee?.location
    };

    try {
      const response = await verifySerial(payload.SerialNumber, payload.itemRef, payload.User, payload.Site);

      // Log the response to check its structure
      console.log('API Response:', response);

      // Check and display the message with appropriate class name
      const textClass = response?.status === true ? 'success' : 'failure';

      if (response?.message) {
        setScanStatusMessage({
          text: response.message,
          className: textClass,
        });
      } else {
        setScanStatusMessage({
          text: 'Error: No message received from the server.',
          className: 'failure',
        });
      }

      // If serial is registered and status is true, process further
      if (response?.status === true && response?.isRegistered) {
        if (scannedSerials.includes(serialNumber)) {
          setScannedData('');
          setTimeout(() => setScanStatusMessage({ text: 'Waiting for scan...', className: 'waiting' }), 1000);
          return;
        }

        const nextCount = scannedCount + 1;
        setScannedCount(nextCount);
        setScannedSerials([...scannedSerials, serialNumber]);
        setScannedData('');

        setTimeout(() => {
          if (nextCount >= product.deliveredQty) {
            setIsVerified(true);
          } else {
            setScanStatusMessage({ text: 'Waiting for scan...', className: 'waiting' });
          }
        }, 1000);
      } else {
        setScannedData('');
        setTimeout(() => setScanStatusMessage({ text: 'Waiting for scan...', className: 'waiting' }), 1500);
      }

    } catch (error) {
      setScanStatusMessage({
        text: 'Error registering serial.',
        className: 'failure',
      });
      setScannedData('');
      setTimeout(() => setScanStatusMessage({ text: 'Waiting for scan...', className: 'waiting' }), 1500);
    }
  };




  const HiddenScannerInput = () => (
    <input
      type="text"
      ref={inputRef}
      value={scannedData}
      onChange={(e) => {
        const value = e.target.value;

        if (value.length < 2) {
          setScanStatusMessage({
            text: 'Please scan a valid serial number',
            className: 'failure',
          });

          // Clear input after short delay to allow focus to reapply properly
          setTimeout(() => {
            setScannedData('');
            focusInput();
            setScanStatusMessage({ text: 'Waiting for scan...', className: 'waiting' });
          }, 1000);

          return;
        }

        setScannedData(value);
        handleSerialScan(value);
      }}

      onBlur={focusInput}
      className="opacity-0 absolute pointer-events-none w-0 h-0"
    />

  );

  const Header = ({ children }) => (
    <h2 className="text-lg font-bold mb-2 text-[#153d64]">{children}</h2>
  );

  const QuantityInfo = () => (
    <div className="flex gap-2 text-lg font-bold mb-2 text-[#153d64]">
      <span>QTY: {Number(product.deliveredQty).toFixed(1)}</span>
      <span>Scanned: {Number(scannedCount).toFixed(1)}</span>
    </div>
  );

  const QuantityInfoFinal = () => (
    <div className="flex gap-2 text-lg font-bold mb-2 text-[#153d64]">
      <span>QTY: {Number(product.deliveredQty).toFixed(1)}</span>
      <span>Scanned: {Number(product.scanQty).toFixed(1)}</span>
    </div>
  );

  const ScanningStatus = () => {
    console.log(scanStatusMessage); // Check if text and className are correct
    return (
      <div className={scanStatusMessage?.className || 'waiting'}>
        {scanStatusMessage?.text || 'Waiting for scan...'}
      </div>
    );
  };



  const SerialList = () => (
    <div className="flex flex-col">
      <p className="text-sm text-[#9095A1FF] text-center">List of IMEI Numbers:</p>
      {scannedSerials.length > 0 ? (
        scannedSerials.map((serial, index) => {
          const masked = serial.slice(0, -2).replace(/\d/g, '*') + serial.slice(-2);
          return (
            <span key={index} className="font-bold text-[#efb034]">
              {index + 1}. {masked}
            </span>
          );
        })
      ) : (
        <span className="text-sm text-[#9095A1FF] text-center">No IMEI numbers available.</span>
      )}
    </div>
  );

  return (
    <div className="fixed inset-0 z-50 bg-[#171A1F66] flex justify-center items-center">
      <div className="bg-white rounded-2xl p-4 w-[90%] max-w-sm shadow-lg relative flex flex-col items-center">
        {!isVerified && (
          <button className="absolute top-2 right-4 text-xl font-bold text-[#153d64]" onClick={onClose}>
            ×
          </button>
        )}

        {isVerified ? (
          <>
            <button className="absolute top-2 right-4 text-xl font-bold text-[#153d64]" onClick={onClose}>
              ×
            </button>
            <Header>Registered</Header>
            <QuantityInfo />
            <SerialList />
            <button
              onClick={handleDone}
              className="bg-[#153d64] text-white text-base font-medium px-16 py-2 rounded-full hover:bg-[#0f2e4a] transition mt-6"
            >
              Done
            </button>
          </>
        ) : isReportingMissing ? (
          <>
            <Header>Report a Missing Item</Header>
            <span className='text-[#efb034] font-bold mb-2'>You are reporting for Missing QTY:{product.missingQty}</span>
            <textarea
              value={missingDescription}
              onChange={(e) => setMissingDescription(e.target.value)}
              placeholder="Enter description"
              rows={4}
              className="w-full p-2 border rounded-lg text-sm text-[#153d64] focus:outline-none focus:ring-2 focus:ring-[#153d64] mb-4"
            />
            <button
              onClick={handleReportSubmits}
              className={`bg-[#153d64] text-white text-base font-medium px-8 py-2 rounded-full transition ${reportStatus === 'Submitting...' ? 'opacity-50 cursor-not-allowed' : ''
                }`}
              disabled={reportStatus === 'Submitting...'}
            >
              {reportStatus}
            </button>
          </>
        ) : !isScanning ? (
          <>
            <Header>Register Product</Header>
            {
              productData.reportedQty > 0 ? (
                <p className="text-sm text-[#9095A1FF] text-center">
                  This item has already been reported.
                </p>
              ) : productData.isCompleted ? (
                <p className="text-sm text-[#9095A1FF] text-center">
                  All items have been already approved.
                </p>
              ) : (
                <p className="text-sm text-[#9095A1FF] text-center">
                  Please scan the received items to register.
                </p>
              )
            }

            <QuantityInfoFinal />

            {
              !productData.isCompleted && productData.reportedQty === 0 && (
                <>
                  <button
                    onClick={handleStartScanning}
                    className="bg-[#153d64] text-white text-base font-medium px-16 py-2 rounded-full hover:bg-[#0f2e4a] transition"
                  >
                    Start Scanning
                  </button>
                  <button
                    className="text-[#9095a1] text-sm pt-1"
                    onClick={() => setIsReportingMissing(true)}
                  >
                    Item Missing?
                  </button>
                </>
              )
            }


          </>
        ) : (
          <>
            <Header>Register Product</Header>
            <QuantityInfo />
            <p className="text-sm text-[#9095A1FF] text-center">Please scan the IMEI number</p>
            <HiddenScannerInput />
            <ScanningStatus />
          </>
        )}
      </div>
    </div>
  );
};

export default Popup;

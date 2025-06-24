import React, { useState, useRef, useEffect } from 'react';
import StepHeader from '../../../components/Header';
import { useLocation, useNavigate } from 'react-router-dom';
import { scanInventory, completeShift } from '../../../services/api';

const Page = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const serialCount = location?.state?.serialCount || 0;
  const scannedSerialCount = location?.state?.scannedSerialCount || 0;
  const shiftId = location?.state?.shiftId || 'defaultShift';
  const shiftType = location?.state?.shiftType;
  const [user, setUser] = useState(null)
  const [totalCount, setTotalCount] = useState(0);
  const [scannedQty, setScannedQty] = useState(0);
  const [scannedSerials, setScannedSerials] = useState([]);
  const [statusMessage, setStatusMessage] = useState('Click Scan to start...');
  const [currentTime, setCurrentTime] = useState(new Date());
  const [shiftStarted, setShiftStarted] = useState(false);
  const [isScanning, setIsScanning] = useState(false);

  const inputRef = useRef(null);
  const scannedSerialsRef = useRef([]);

  const showStartShiftControls = serialCount === scannedQty;

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('handHeldUser'));
    setUser(user);
  }, []);

  // Auto-stop scanning if all items are scanned
  useEffect(() => {
    if (showStartShiftControls) {
      setIsScanning(false);
    }
  }, [showStartShiftControls]);

  // Always keep current time updated
  useEffect(() => {
    const interval = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(interval);
  }, []);

  // Always keep input focused when scanning
  useEffect(() => {
    if (inputRef.current && (isScanning || !showStartShiftControls)) {
      inputRef.current.focus();
    }
  }, [isScanning, showStartShiftControls]);

  const handleStartScan = () => {
    setIsScanning(true);
    setStatusMessage('Waiting for the scan...');
  };

  const handleScanInput = async (e) => {
    const value = e.target.value.trim().toUpperCase();
    if (!value) return;

    if (scannedSerialsRef.current.includes(value)) {
      setStatusMessage('Already Scanned');
      e.target.value = '';
      setTimeout(() => {
        setStatusMessage('Waiting for the scan...');
        inputRef.current?.focus();
      }, 1000);
      return;
    }

    setStatusMessage('Scanning...');
    const result = await scanInventory(value, user?.id, shiftId, shiftType);
    console.log(result);

    if (result.success && result.data?.status) {
      scannedSerialsRef.current.push(value);
      setScannedSerials([...scannedSerialsRef.current]);
      setScannedQty(result.data?.scanCount);
      setTotalCount(result.data?.totalCount);
      setStatusMessage(result.data?.message || 'Scanned');
    } else {
      setStatusMessage(result.data?.message || 'Error occurred');
    }

    e.target.value = '';
    setTimeout(() => {
      setStatusMessage('Waiting for the scan...');
      inputRef.current?.focus();
    }, 1000);
  };

  const getCurrentDateTime = () => {
    const now = new Date();
    const yyyy = now.getFullYear();
    const mm = String(now.getMonth() + 1).padStart(2, '0');
    const dd = String(now.getDate()).padStart(2, '0');
    const hh = String(now.getHours()).padStart(2, '0');
    const mi = String(now.getMinutes()).padStart(2, '0');
    const ss = String(now.getSeconds()).padStart(2, '0');
    return `${yyyy}/${mm}/${dd} ${hh}:${mi}:${ss}`;
  };

  const handleStartShift = async () => {
    const startTime = getCurrentDateTime();
    const User = user?.id;
    const result = await completeShift(shiftId, shiftType, startTime, User);
    if (result.success && result.data.code === "1") {
      setShiftStarted(true);
      navigate('/mobile-serial-app/login');
    } else {
      console.error(`Failed to complete shift: ${result.data?.message || result.error || 'Unknown error'}`);
    }
  };

  return (
    <div className="min-h-screen">
      <StepHeader title={`${shiftType} Shift`} statusLabel="" statusValue="" />
      <div className="border-2 border-dashed border-[#B9BCC2] flex justify-center px-4 pb-5 rounded-2xl m-3">
        <div className="border-dashed border-[#B9BCC2] rounded-lg w-full max-w-sm mt-2 pt-2 text-center">
          <div className="text-sm font-bold text-[#113256]">
            Total Scans Required <span className="text-[#FBBF24] font-bold">{Math.max(serialCount, totalCount)}</span>
          </div>

          <div className="shadow-lg p-4">
            <h3 className="font-semibold text-gray-700 mb-1">Start Scanning IMEI Numbers</h3>
            <p className="text-xs text-gray-500 mb-3">
              Please scan the {Math.max(scannedQty, scannedSerialCount)}/{Math.max(serialCount, totalCount)} item to verify
            </p>

            <div className="text-[#103B63] text-sm font-bold mb-2">
              Remaining QTY: {serialCount} &nbsp;&nbsp; Scanned: {Math.max(scannedQty, scannedSerialCount)}
            </div>

            {!isScanning && !showStartShiftControls && (
              <button
                onClick={handleStartScan}
                className="w-1/2 bg-[#8aa386] hover:bg-[#6c8b6c] text-white font-semibold py-2 rounded transition duration-200"
              >
                Scan
              </button>
            )}

            {isScanning && (
              <div
                className={`text-sm font-semibold mt-2 mb-2 ${statusMessage === 'Waiting for the scan...'
                    ? 'text-gray-600'
                    : statusMessage === 'Already Scanned' || statusMessage.toLowerCase().includes('error')
                      ? 'text-red-600'
                      : 'text-green-600'
                  }`}
              >
                {statusMessage}
              </div>
            )}

            {/* Always active hidden input for Honeywell scanner */}
            <input
              type="text"
              ref={inputRef}
              onChange={handleScanInput}
              className="absolute left-[-9999px]"
              autoComplete="off"
            />
          </div>

          {showStartShiftControls ? (
            <div>
              <p className="text-xs text-gray-500 my-4">
                Please press {shiftType} Shift
              </p>
              <button
                onClick={handleStartShift}
                disabled={shiftStarted}
                className={`w-full ${shiftStarted ? 'bg-gray-400' : 'bg-[#103B63] hover:bg-[#0b2d4d]'} text-white font-semibold py-3 rounded-md transition duration-200`}
              >
                {shiftStarted ? `Shift ${shiftType}` : `${shiftType} Shift `}
                {!shiftStarted && (
                  <span className="text-[#FBBF24] text-xs font-normal ml-2">
                    {currentTime.toLocaleString()}
                  </span>
                )}
              </button>
            </div>
          ) : (
            <div>
              <p className="text-xs text-gray-500 my-4">
                Please log on to dashboard to report the discrepancy first and then start the shift
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Page;

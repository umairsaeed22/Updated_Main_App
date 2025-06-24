import React, { useState, useEffect } from 'react';
import StepHeader from '../../../components/Header';
import { MdSearch, MdQrCodeScanner } from 'react-icons/md';
import { useNavigate } from 'react-router-dom';
import Popup from '../../../components/Popup';
import { useGRNStore } from '../../../store/useGRNStore'; // Import Zustand store
import { verifySerial, finishGrnRegistration } from '../../../services/api'; // Import the API function

const Page = () => {
    const navigate = useNavigate();
    const { grnData } = useGRNStore(); // Access GRN data from store
    const [popupVisible, setPopupVisible] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [approvedProducts, setApprovedProducts] = useState(Array(6).fill(false));
    const [isScanning, setIsScanning] = useState(false);
    const [currentScanIndex, setCurrentScanIndex] = useState(0);
    const [searchQuery, setSearchQuery] = useState('');
    const [filteredProducts, setFilteredProducts] = useState(grnData?.item || []);
    const [errorMessage, setErrorMessage] = useState(''); // State to store error message
    const [loading, setLoading] = useState(false);
    const [user, setUser] = useState(null);

    useEffect(() => {
        const user = JSON.parse(localStorage.getItem('handHeldUser'));
        setUser(user);
    }, []);

    useEffect(() => {
        const timer = setTimeout(() => {
            if (searchQuery === '') {
                setFilteredProducts(grnData?.item || []);
            } else {
                const lowercasedQuery = searchQuery.toLowerCase();
                const filtered = grnData?.item.filter((product) =>
                    product.article.toLowerCase().includes(lowercasedQuery) ||
                    (product.articleDesc && product.articleDesc.toLowerCase().includes(lowercasedQuery))
                );
                setFilteredProducts(filtered);
            }
        }, 300);

        return () => clearTimeout(timer);
    }, [searchQuery, grnData?.item]);

    const handleTileClick = (product) => {
        const productData = {
            delQty: product.delQty,
            refNo: product.refNo,
            reportedQty: product.reportedQty,
            scanQty: product.scanQty,
            missingQty: product.missingQty,
            ...product, // Spread other product data
        };

        setSelectedProduct(productData);  // Set the selected product with relevant data
        setPopupVisible(true);
        setIsScanning(false);
        setCurrentScanIndex(0);
    };

    const handleClosePopup = () => {
        if (selectedProduct) {
            const updated = [...approvedProducts];
            const index = grnData?.item.findIndex(p => p.refNo === selectedProduct.refNo);
            if (index !== -1) {
                updated[index] = true;
                setApprovedProducts(updated); // Mark as approved when the popup closes
            }
        }
        setPopupVisible(false);
        setSelectedProduct(null);
        setIsScanning(false);
        setCurrentScanIndex(0);
    };

    const handleButtonClick = async () => {
        setLoading(true);
        try {
            const requestedBy = user?.id;
            const grn = grnData?.grn;

            const result = await finishGrnRegistration(requestedBy, grn);

            if (result?.code === '1') {
                const { setGrnData } = useGRNStore.getState();

                setGrnData(
                    {
                        ...grnData,
                        status: 'COMPLETE',
                    },
                    grn
                );

                navigate('/mobile-serial-app/success');
            } else {
                setErrorMessage(result?.message || 'Registration failed. Please try again.');
            }
        } catch (error) {
            setErrorMessage(error?.message || 'An error occurred while finishing the registration.');
        } finally {
            setLoading(false); // ✅ Stop loading
        }
    };


    const handleSerialScan = async (serialNumber) => {
        if (selectedProduct) {
            try {
                const result = await verifySerial(serialNumber, selectedProduct.refNo);
                if (result?.success) {
                    setApprovedProducts(prev => {
                        const updated = [...prev];
                        const index = grnData?.item.findIndex(p => p.refNo === selectedProduct.refNo);
                        if (index !== -1) {
                            updated[index] = true;
                        }
                        return updated;
                    });
                    handleClosePopup(); // Close the popup after scanning and updating the product
                } else {
                    // Handle API response failure by setting the error message
                    setErrorMessage(result?.message || 'Failed to verify IMEI number.');
                }
            } catch (error) {
                // Catch any unexpected errors and display them
                setErrorMessage(error?.message || 'An error occurred while verifying the IMEI number.');
            }
        }
    };
    
    return (
        <div className="min-h-screen bg-[#fff] pb-12">
            <StepHeader title="Products List" statusLabel="Status" statusValue={grnData?.status} />

            <div className="w-[98%] mx-auto mt-2 border-2 border-dashed border-[#BDC1CAFF] rounded-2xl p-1 flex flex-col">
                <div className="w-full mb-3 relative">
                    <MdSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-[#153d64] text-2xl" />
                    <input
                        type="text"
                        placeholder="Search the Article number"
                        className="w-full pl-12 pr-12 py-2 rounded-md border border-neutral-200 shadow-sm outline-none"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                    <MdQrCodeScanner className="absolute right-4 top-1/2 transform -translate-y-1/2 text-[#153d64] text-2xl" />
                </div>

                {filteredProducts.map((product, index) => {
                    const isApproved = approvedProducts[index];
                    const isCompleted = product.isCompleted;
                    const hasReported = product.reportedQty > 0;
                    const articleDesc = product.articleDesc || 'No description available';
                    const article = product.article || 'N/A';
                    const receivedQty = product.deliveredQty || 0;
                    const scannedQty = product.scanQty || 0;
                    const missingQty = product.missingQty || 0;
                    const reportedQty = product.reportedQty || 0;

                    const bgColorClass = hasReported
                        ? 'bg-[#efb034]' // Yellow if reportedQty > 0
                        : isCompleted
                            ? 'bg-[#8aa386]' // Green if completed and not reported
                            : 'bg-white';    // Default


                    const textColorClass = isCompleted || hasReported ? 'text-white' : 'text-[#153d64]';
                    const subTextColorClass = isCompleted || hasReported ? 'text-white' : 'text-[#9095A1]';

                    return (
                        <div
                            key={index}
                            className={`w-full mb-1 shadow-sm border border-[#F3F4F6] p-2 rounded-lg relative cursor-pointer ${bgColorClass}`}
                            onClick={() => handleTileClick(product)}
                        >
                            <div className="flex items-center gap-2">
                                <div className="flex-grow w-[60%]">
                                    <div className={`font-bold text-sm ${textColorClass}`}>Article# {article}</div>
                                    <div className={`font-medium text-xs mt-1 ${subTextColorClass}`}>
                                        {articleDesc.slice(0, 40)}
                                    </div>
                                </div>
                                <div className="text-right">
                                    <div className="font-normal text-xs">
                                        <span className={`${subTextColorClass}`}>Received QTY&nbsp;:</span>
                                        <span className="text-[#113256] font-bold">
                                            &nbsp;{parseFloat(receivedQty).toFixed(1)}
                                        </span>
                                    </div>
                                    <div className="font-normal text-xs">
                                        <span className={`${subTextColorClass}`}>Scanned QTY&nbsp;:</span>
                                        <span className="text-[#113256] font-bold">
                                            &nbsp;{parseFloat(scannedQty).toFixed(1)}&nbsp;/&nbsp;
                                            {parseFloat(receivedQty).toFixed(1)}
                                        </span>
                                    </div>
                                    <div className="font-normal text-xs">
                                        <span className={`${subTextColorClass}`}>Missing QTY&nbsp;:</span>
                                        <span className="text-[#113256] font-bold">
                                            &nbsp;{parseFloat(missingQty).toFixed(1)}&nbsp;/&nbsp;
                                            {parseFloat(receivedQty).toFixed(1)}
                                        </span>
                                    </div>
                                    <div className="font-normal text-xs">
                                        <span className={`${subTextColorClass}`}>Reported QTY&nbsp;:</span>
                                        <span className="text-[#113256] font-bold">
                                            &nbsp;{parseFloat(reportedQty).toFixed(1)}&nbsp;/&nbsp;
                                            {parseFloat(receivedQty).toFixed(1)}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>

            {errorMessage && (
                <div className="text-center text-red-500 mt-4">{errorMessage}</div>
            )}

            <div className="flex justify-center mt-3">
                <button
                    className="bg-[#153d64] text-white px-12 py-3 rounded-full font-semibold text-base hover:bg-[#0f2e4a] transition disabled:opacity-50 disabled:cursor-not-allowed"
                    onClick={handleButtonClick}
                    disabled={loading}
                >
                    {loading ? 'Finishing...' : 'Finish Registration'}
                </button>
            </div>



            {popupVisible && selectedProduct && (
                <Popup
                    product={selectedProduct}
                    onClose={handleClosePopup}
                    isScanning={isScanning}
                    setIsScanning={setIsScanning}
                    currentScanIndex={currentScanIndex}
                    setCurrentScanIndex={setCurrentScanIndex}
                    onScan={handleSerialScan}
                />
            )}
        </div>
    );
};

export default Page;

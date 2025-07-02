import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import StepHeader from '../../../components/Header';
import { snapshotInventory, getActiveShift } from '../../../services/api';

const Page = () => {
    const navigate = useNavigate();
    const siteInputRef = useRef(null);
    const [errorMessage, setErrorMessage] = useState('');
    const [user, setUser] = useState(null);
    const [employee, setEmployee] = useState(null);
    const [activeShift, setActiveShift] = useState(null);
    const [showConfirmPopup, setShowConfirmPopup] = useState(false);
    const [showSnapshotChoicePopup, setShowSnapshotChoicePopup] = useState(false);

    useEffect(() => {
        const user = JSON.parse(localStorage.getItem('handHeldUser'));
        const employee = JSON.parse(localStorage.getItem('handHeldEmployee'));
        setUser(user);
        setEmployee(employee);

        if (user?.id) {
            getActiveShift(user.id).then((data) => {
                if (data) {
                    setActiveShift(data);
                }
            });
        }
    }, []);
    console.log(activeShift)
    const getCurrentDateTime = () => {
        const now = new Date();
        const year = now.getFullYear();
        const month = String(now.getMonth() + 1).padStart(2, '0');
        const day = String(now.getDate()).padStart(2, '0');
        const hours = String(now.getHours()).padStart(2, '0');
        const minutes = String(now.getMinutes()).padStart(2, '0');
        const seconds = String(now.getSeconds()).padStart(2, '0');
        return `${year}/${month}/${day} ${hours}:${minutes}:${seconds}`;
    };

    const handleButtonClick = async (regenerateFlag = false) => {
        setErrorMessage('');
        const userId = user?.id;
        const site = employee?.location;

        try {
            const result = await snapshotInventory({
                userId,
                site,
                startTime: getCurrentDateTime(),
                regenerate: regenerateFlag,
            });

            if (result.code === "0") {
                setErrorMessage(result.message || 'Cannot start shift.');
            } else {
                navigate('/mobile-serial-app/shift', {
                    state: {
                        shiftId: result.shiftId,
                        serialCount: result.serialCount,
                        shiftType: result.shiftType,
                        scannedSerialCount: result.scannedSerialCount
                    },
                });
            }
        } catch (error) {
            setErrorMessage('Snapshot inventory failed. Please try again.');
            console.error('Snapshot inventory failed:', error);
        }
    };

    const handleContinueClick = () => {
        if (activeShift?.snapshotAvailable) {
            setShowConfirmPopup(false);
            setShowSnapshotChoicePopup(true);
        } else {
            handleButtonClick(false);
        }
    };

    const details = [
        { label: 'File #', value: employee?.fileNo },
        {
            label: 'Site',
            value: (
                <input
                    ref={siteInputRef}
                    type="text"
                    defaultValue={employee?.location || ''}
                    className="bg-transparent border-none focus:outline-none text-right text-[#9095A1FF] font-bold"
                />
            )
        },
        {
            label: 'Date',
            value: new Date().toLocaleDateString('en-US', {
                month: 'short', day: 'numeric', year: 'numeric'
            })
        },
        {
            label: 'Time',
            value: new Date().toLocaleTimeString('en-US', {
                hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false
            })
        }
    ];
    return (
        <div className="min-h-screen">
            <StepHeader title="Shift Details" statusLabel="" statusValue="" />

            <div className="flex justify-center mt-1 flex-col items-center">
                {activeShift && (
                    <span className="font-bold text-md text-[#153d64] mb-2">
                        Current Shift: {activeShift.status?.trim() ? activeShift.status : 'None'}
                    </span>
                )}
                <div className="bg-white rounded-xl w-[98%] max-w-md space-y-4">
                    {details.map((item, index) => (
                        <div
                            key={index}
                            className="border-dashed border-[#B9BCC2] rounded-lg flex justify-between items-center px-4 py-3"
                            style={{ borderWidth: '2px', borderStyle: 'dashed', borderDasharray: '10 4' }}
                        >
                            <span className="text-[#153d64] font-[800] text-base">{item.label}</span>
                            <span className="text-[#9095A1FF] font-bold">{item.value}</span>
                        </div>
                    ))}



                    {activeShift && (
                        <div className="flex flex-col items-center text-center text-gray-400 font-[500] text-sm mb-2">
                            <span>Would you like to {activeShift.status} the shift?</span>
                        </div>
                    )}

                    <div className="flex justify-center mt-2 mb-6">
                        <button
                            className="bg-[#153d64] text-white px-12 py-3 rounded-full font-semibold text-base hover:bg-[#0f2e4a] transition"
                            onClick={() => setShowConfirmPopup(true)}
                        >
                            Continue
                        </button>
                    </div>
                </div>
            </div>

            {/* Confirm Action Popup */}
            {showConfirmPopup && (
                <div className="fixed inset-0 bg-[#171A1F66] flex items-center justify-center z-50">
                    <div className="bg-white p-6 rounded-xl shadow-lg w-80 text-center">
                        <h2 className="text-xl font-bold mb-4">Confirm Shift Action</h2>
                        <p className="text-gray-700 mb-1">
                            Are you sure you want to <strong>{activeShift?.status || 'START'}</strong> the shift?
                        </p>
                        {errorMessage && (
                            <div className="text-center text-sm text-red-600 font-semibold mb-4">
                                {errorMessage}
                            </div>
                        )}
                        <div className="flex justify-center gap-4">
                            <button
                                className={`px-6 py-2 rounded font-semibold text-white ${activeShift?.status === 'START'
                                    ? 'bg-green-600 hover:bg-green-700'
                                    : 'bg-red-600 hover:bg-red-700'
                                    }`}
                                onClick={handleContinueClick}
                            >
                                {activeShift?.status} Shift
                            </button>
                            <button
                                className="px-6 py-2 rounded border border-gray-400 text-gray-700 hover:bg-gray-100"
                                onClick={() => setShowConfirmPopup(false)}
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Snapshot Choice Popup */}
            {showSnapshotChoicePopup && (
                <div className="fixed inset-0 bg-[#171A1F66] flex items-center justify-center z-50">
                    <div className="bg-white p-3 rounded-xl shadow-lg w-96 text-center">
                        <h2 className="text-xl font-bold mb-4">Previous Snapshot Detected</h2>
                        <p className="text-gray-700 mb-6">
                            You have tried to {activeShift?.status} the shift before. Would you like to:
                        </p>
                        <div className="space-y-4">
                            <button
                                className="w-full bg-green-600 text-white px-6 py-3 rounded font-semibold "
                                onClick={() => {
                                    setShowSnapshotChoicePopup(false);
                                    handleButtonClick(true); // ✅ Regenerate = true
                                }}
                            >
                                Regenerate with Updated Records
                            </button>
                            <button
                                className="w-full bg-blue-600 text-white px-6 py-3 rounded font-semibold"
                                onClick={() => {
                                    setShowSnapshotChoicePopup(false);
                                    handleButtonClick(false); // ✅ Regenerate = false
                                }}
                            >
                                Proceed with Same Records
                            </button>
                            <button
                                className="text-gray-600 text-sm underline mt-2"
                                onClick={() => setShowSnapshotChoicePopup(false)}
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Page;

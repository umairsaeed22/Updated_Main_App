import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import StepHeader from '../../../components/Header';
import { snapshotInventory } from '../../../services/api'; // Update the import path as needed

const Page = () => {
    const navigate = useNavigate();
    const siteInputRef = useRef(null);
    const [errorMessage, setErrorMessage] = useState('');
    const [user, setUser] = useState(null);
    const [employee, setEmployee] = useState(null);

    // ✅ Get user and employee data from localStorage
    useEffect(() => {
        const user = JSON.parse(localStorage.getItem('handHeldUser'));
        setUser(user);
        const employee = JSON.parse(localStorage.getItem('handHeldEmployee'));
        setEmployee(employee);
    }, []);

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

    const handleButtonClick = async () => {
        setErrorMessage('');

        const userId = user?.id;
        const site = employee?.location;

        try {
            const result = await snapshotInventory({
                userId,
                site,
                startTime: getCurrentDateTime(),
                articles: []
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

    const details = [
        {
            label: 'File #',
            value: employee?.fileNo,
        },
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
                month: 'short',
                day: 'numeric',
                year: 'numeric'
            })
        },
        {
            label: 'Time',
            value: new Date().toLocaleTimeString('en-US', {
                hour: '2-digit',
                minute: '2-digit',
                second: '2-digit',
                hour12: false
            })
        }
    ];

    return (
        <div className="min-h-screen">
            <StepHeader title="Shift Details" statusLabel="" statusValue="" />

            <div className="flex justify-center mt-1 ">
                <div className="bg-white rounded-xl w-[98%] max-w-md space-y-4">
                    {/* Info Boxes */}
                    {details.length > 0 ? (
                        details.map((item, index) => (
                            <div
                                key={index}
                                className="border-dashed border-[#B9BCC2] rounded-lg flex justify-between items-center px-4 py-3"
                                style={{ borderWidth: '2px', borderStyle: 'dashed', borderDasharray: '10 4' }}
                            >
                                <span className="text-[#153d64] font-[800] text-base">{item.label}</span>
                                <span className="text-[#9095A1FF] font-bold">{item.value}</span>
                            </div>
                        ))
                    ) : (
                        <div className="text-center">No GRN data available</div>
                    )}

                    {/* Error Message above button */}
                    {errorMessage && (
                        <div className="text-center text-red-600 font-semibold px-4">
                            {errorMessage}
                        </div>
                    )}

                    {/* Continue Button */}
                    <div className="flex justify-center mt-2 mb-6">
                        <button
                            className="bg-[#153d64] text-white px-12 py-3 rounded-full font-semibold text-base hover:bg-[#0f2e4a] transition"
                            onClick={handleButtonClick}
                        >
                            Continue
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Page;

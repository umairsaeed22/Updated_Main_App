import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import SacoLogo from '../../../assets/saco.png';
import { fetchGrnData } from '../../../services/api';

const DeviceEntry = () => {
    const [grn, setGrn] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [selectedTile, setSelectedTile] = useState(null);
    const [user, setUser] = useState(null);
    const [availableModules, setAvailableModules] = useState([]);
    const [showShiftConfirm, setShowShiftConfirm] = useState(false);

    const navigate = useNavigate();

    useEffect(() => {
        const storedUser = JSON.parse(localStorage.getItem('handHeldUser'));
        const storedApps = JSON.parse(localStorage.getItem('handHeldapps')) || [];

        setUser(storedUser);

        const moduleNames = storedApps.flatMap(app =>
            app.module?.map(mod => mod.moduleName) || []
        );
        setAvailableModules(moduleNames);
    }, []);

    const handleContinue = async () => {
        setError('');
        if (!grn.trim()) {
            setError('Invalid GRN. Please enter a valid GRN.');
            return;
        }

        try {
            setLoading(true);
            const data = await fetchGrnData(user?.id, grn);
            if (!data) {
                setError('Invalid GRN. Please enter a valid GRN.');
                return;
            }

            navigate('/mobile-serial-app/shipment-details', {
                state: { grnData: data, grnNumber: grn }
            });
        } catch (error) {
            setError(error.message || 'Something went wrong while fetching GRN.');
        } finally {
            setLoading(false);
        }
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter') {
            handleContinue();
        }
    };

    const handleTileClick = (tile) => {
        if (tile === 'shift') {
            setShowShiftConfirm(true);
        } else {
            setSelectedTile(tile);
        }
    };

    const handleConfirmShift = () => {
        setShowShiftConfirm(false);
        navigate('/mobile-serial-app/shift-details');
    };

    const handleReturnToLogin = () => {
        localStorage.removeItem('handHeldUser');
        localStorage.removeItem('handHeldEmployee');
        localStorage.removeItem('handHeldapps');
        navigate('/mobile-serial-app/login');
    };

    const handleBackToMenu = () => {
        setSelectedTile(null);
        setGrn('');
        setError('');
        setLoading(false);
    };

    const noValidModules =
        !availableModules.includes('register-page') &&
        !availableModules.includes('shift');

    return (
        <div className="min-h-screen flex flex-col justify-start items-center px-6 bg-[#153d64] py-8 overflow-hidden">
            <div>
                <img src={SacoLogo} alt="SACO Logo" className="w-30 h-30 object-contain" />
            </div>

            {!noValidModules && (
                <div className="text-white mb-3 italic text-center text-sm">
                    <span>Please select the operation you want to perform:</span>
                </div>
            )}

            {!selectedTile && (
                <div className="grid gap-4 text-center">
                    {noValidModules ? (
                        <>
                            <p className="text-white font-semibold text-md">
                                You have no operations to perform.
                            </p>
                            <button
                                onClick={handleReturnToLogin}
                                className="text-white underline text-sm hover:text-gray-200"
                            >
                                Logout
                            </button>
                        </>
                    ) : (
                        <>
                            {availableModules.includes('register-page') && (
                                <button
                                    onClick={() => handleTileClick('imei')}
                                    className="border-1 border-[#fff] text-[#fff] font-bold py-4 px-6 rounded-xl shadow-lg text-md"
                                >
                                    Register IMEI Numbers
                                </button>
                            )}
                            {availableModules.includes('shift') && (
                                <button
                                    onClick={() => handleTileClick('shift')}
                                    className="border-1 border-[#fff] text-[#fff] font-bold py-3 px-5 rounded-xl shadow-lg text-md"
                                >
                                    Start Shift / End Shift
                                </button>
                            )}
                            <button
                                onClick={handleReturnToLogin}
                                className="text-white underline text-sm hover:text-gray-200"
                            >
                                Logout
                            </button>
                        </>
                    )}
                </div>
            )}

            {selectedTile === 'imei' && (
                <div className="w-full max-w-sm mt-8 text-left">
                    <label
                        htmlFor="grn"
                        className="font-nunito text-[20px] leading-[30px] font-[800] text-white"
                    >
                        Enter GRN Number <span className='text-red-500'>*</span>
                    </label>
                    <input
                        type="text"
                        id="grn"
                        value={grn}
                        onChange={(e) => setGrn(e.target.value)}
                        placeholder="Enter GRN Number"
                        onKeyPress={handleKeyPress}
                        className="mt-4 w-full bg-white border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:border-[#153d64] focus:ring-2 focus:ring-[#153d64]"
                    />

                    {error && (
                        <div className="mt-2 bg-red-100 border border-red-400 text-red-700 px-4 py-2 rounded text-sm">
                            {error}
                        </div>
                    )}

                    <div className="flex flex-col items-center gap-4 mt-4">
                        <button
                            onClick={handleContinue}
                            disabled={loading}
                            className={`w-fit border text-white py-2 rounded-4xl font-semibold transition-all px-16 flex items-center ${loading ? 'opacity-50 cursor-not-allowed' : 'border-white'}`}
                        >
                            {loading ? 'Loading...' : 'Continue'}
                        </button>

                        <button
                            onClick={handleBackToMenu}
                            className="text-white underline text-sm hover:text-gray-200"
                        >
                            Return to Main Menu
                        </button>
                    </div>
                </div>
            )}

            {showShiftConfirm && (
                <div className="fixed inset-0 bg-[#171A1F66] flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg p-6 shadow-xl w-80 text-center">
                        <h2 className="text-xl font-bold mb-2">Confirm Action</h2>
                        <p className="text-gray-700 mb-2">Are you sure you want to Start/End Shift?</p>
                        <div className="flex justify-center gap-4">
                            <button
                                onClick={handleConfirmShift}
                                className="bg-[#153d64] text-white px-4 py-2 rounded hover:bg-[#1e4d7a]"
                            >
                                Proceed
                            </button>
                            <button
                                onClick={() => setShowShiftConfirm(false)}
                                className="bg-gray-300 text-black px-4 py-2 rounded hover:bg-gray-400"
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

export default DeviceEntry;

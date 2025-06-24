import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { gsap } from 'gsap';
import Header from '../../../components/Headers';
import illustration from '../../../assets/Selections.png';
import { registerExceptionItem } from '../../../services/dashboardApi';
import { toast } from 'react-toastify';

const AddNew = () => {
    const navigate = useNavigate();

    const [articleNumber, setArticleNumber] = useState('');
    const [quantity, setQuantity] = useState('');
    const [serialInput, setSerialInput] = useState('');
    const [serialNumbersList, setSerialNumbersList] = useState([]);
    const [loading, setLoading] = useState(false);
    const [refNo, setRefNo] = useState(null);
    const [user, setUser] = useState(null);
    const [employee, setEmployee] = useState(null);

    useEffect(() => {
        gsap.fromTo(
            ".content",
            { y: 50, opacity: 0 },
            { y: 0, opacity: 1, duration: 1, ease: "power4.out" }
        );

        const userString = localStorage.getItem('user');
        const parsedUser = userString ? JSON.parse(userString) : null;
        setUser(parsedUser);

        const employeeString = localStorage.getItem('employee');
        const parsedEmployee = userString ? JSON.parse(employeeString) : null;
        setEmployee(parsedEmployee);
    }, []);

    const handleAddSerial = () => {
        const trimmed = serialInput.trim();
        const qty = parseInt(quantity, 10);

        if (!trimmed) return;
        if (serialNumbersList.includes(trimmed)) {
            toast.error("Duplicate serial number not allowed.");
            return;
        }

        if (serialNumbersList.length >= qty) {
            toast.error(`You can only enter ${qty} serial numbers.`);
            return;
        }

        setSerialNumbersList([...serialNumbersList, trimmed]);
        setSerialInput('');
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            handleAddSerial();
        }
    };

    const handleRemoveSerial = (index) => {
        const updatedList = [...serialNumbersList];
        updatedList.splice(index, 1);
        setSerialNumbersList(updatedList);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const parsedArticleNumber = Number(articleNumber);
            const parsedQuantity = Number(quantity);

            if (isNaN(parsedArticleNumber) || parsedArticleNumber === 0) {
                toast.error("Please enter a valid Article Number.");
                return;
            }

            if (isNaN(parsedQuantity) || parsedQuantity <= 0) {
                toast.error("Please enter a valid Quantity.");
                return;
            }

            if (serialNumbersList.length !== parsedQuantity) {
                toast.error("Serial numbers count must match the quantity.");
                return;
            }

            setLoading(true);

            const payload = {
                ArticleNo: parsedArticleNumber,
                Qty: parsedQuantity,
                User: user?.id,
                Serials: serialNumbersList.map(String),
                Site: employee?.location
            };

            const result = await registerExceptionItem(payload);
            const response = result?.data || result;


            if (response.success) {
                toast.success(response.message || "Article registered successfully.");
                setArticleNumber('');
                setQuantity('');
                setSerialNumbersList([]);

                setRefNo(response.refNo);
                console.log("refNo:", response.refNo);

                // ✅ Navigate to /add-grn after 3s with refNo
                setTimeout(() => {
                    navigate('/mobile-serial-app/', { state: { refNo: response.refNo } });
                }, 2000);
            } else {
                toast.error(response.message || "An error occurred during registration.");
            }
        } catch (error) {
            console.error("Submit error:", error);
            toast.error("Unexpected error occurred.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex flex-col animated-bg">
            <Header />
            <div className="flex justify-start mb-4">
                <button
                    type="button"
                    onClick={() => navigate(-1)}
                    className="cursor-pointer bg-white text-gray-800 px-6 py-2 rounded-md text-sm hover:bg-gray-300 m-5"
                >
                    ← Return
                </button>
            </div>
            <main
                className="flex-grow flex justify-center items-start px-4 sm:px-6"
            >
                <div className="bg-white flex flex-col lg:flex-row gap-6 w-full max-w-5xl mx-auto px-4 sm:px-6 md:px-8 py-6 rounded-xl md:shadowm-md shadow content overflow-hidden">
                    {/* Left Section */}
                    <div className="hidden bg-[#8aa386] w-full lg:w-1/3 p-6 md:flex flex-col items-center justify-center text-center rounded-lg">
                        <img src={illustration} alt="Illustration" className="w-40 mb-6" />
                        <p className="text-md font-bold text-[#efb034]">
                            Easily Track & Register Your Inventory
                        </p>
                        <p className="text-xs text-white mt-2 mb-4">
                            Stay organized and ensure every item is accounted for — quick, simple, efficient.
                        </p>
                        <button className="font-bold border border-white text-white text-xs px-4 py-2 rounded bg-transparent hover:bg-white hover:text-[#103b63] transition">
                            Start Logging Now
                        </button>
                    </div>

                    {/* Right Section / Form */}
                    <div className="w-full lg:w-2/3 py-4 px-2 sm:px-4 text-left">
                        <h2 className="text-2xl font-bold text-gray-800">Register New IMEI Numbers</h2>
                        <p className="text-sm text-gray-500 mb-4">
                            Please enter the details to register the new Article
                        </p>

                        <form
                            className="grid grid-cols-1 sm:grid-cols-2 gap-4"
                            onSubmit={handleSubmit}
                        >
                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-1 text-left">
                                    Article Number <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    placeholder="Enter Article Number"
                                    className="bg-gray-100 rounded-md px-3 py-2 text-sm w-full focus:outline-none focus:ring-0 focus:border-transparent"
                                    value={articleNumber}
                                    onChange={(e) => setArticleNumber(e.target.value)}
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-1 text-left">
                                    Quantity <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="number"
                                    min="0"
                                    placeholder="Enter Quantity"
                                    className="bg-gray-100 rounded-md px-3 py-2 text-sm w-full focus:outline-none focus:ring-0 focus:border-transparent"
                                    value={quantity}
                                    onChange={(e) => {
                                        setQuantity(e.target.value);
                                        setSerialNumbersList([]);
                                    }}
                                    required
                                />
                            </div>

                            <div className="sm:col-span-2">
                                <label className="block text-sm font-bold text-gray-700 mb-1 text-left">
                                    IMEI Number <span className="text-red-500">*</span>
                                </label>
                                <div className="flex flex-col sm:flex-row gap-2">
                                    <input
                                        type="text"
                                        placeholder="Enter serial number"
                                        className="bg-gray-100 rounded-md px-3 py-2 text-sm w-full focus:outline-none focus:ring-0 focus:border-transparent"
                                        value={serialInput}
                                        onChange={(e) => setSerialInput(e.target.value)}
                                        onKeyDown={handleKeyPress}
                                        disabled={
                                            serialNumbersList.length >= parseInt(quantity || 0, 10)
                                        }
                                    />
                                    <button
                                        type="button"
                                        onClick={handleAddSerial}
                                        disabled={
                                            serialNumbersList.length >= parseInt(quantity || 0, 10)
                                        }
                                        className={`cursor-pointer px-4 py-2 rounded transition ${serialNumbersList.length >= parseInt(quantity || 0, 10)
                                                ? 'bg-gray-400 cursor-not-allowed text-white'
                                                : 'bg-[#103b63] text-white hover:bg-[#0d2f52]'
                                            }`}
                                    >
                                        Add
                                    </button>
                                </div>

                                {serialNumbersList.length > 0 && (
                                    <div className="mt-3 flex flex-wrap gap-2">
                                        {serialNumbersList.map((num, index) => (
                                            <div
                                                key={index}
                                                className="cursor-pointer flex items-center bg-[#8aa386] text-white px-3 py-1 rounded-md text-sm font-semibold transition-transform duration-200 hover:scale-105"
                                            >
                                                <span>{num}</span>
                                                <button
                                                    type="button"
                                                    onClick={() => handleRemoveSerial(index)}
                                                    className="cursor-pointer ml-2 text-white font-bold hover:text-red-200 transition duration-200"
                                                    aria-label="Remove serial number"
                                                >
                                                    ×
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>

                            <div className="sm:col-span-2 flex flex-col items-center mt-4">
                               
                                <button
                                    type="submit"
                                    disabled={loading}
                                    className={`cursor-pointer rounded-md px-6 py-2 text-sm font-medium transition ${loading
                                            ? 'bg-gray-400 cursor-not-allowed text-white'
                                            : 'bg-[#103b63] text-white hover:bg-[#0d2f52]'
                                        }`}
                                >
                                    {loading ? 'Registering...' : 'Register'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default AddNew;

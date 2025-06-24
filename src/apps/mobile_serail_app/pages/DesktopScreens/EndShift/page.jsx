import React, { useState, useEffect } from 'react';
import Header from '../../../components/Headers';
import { gsap } from 'gsap';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { MdReport } from "react-icons/md";
import Select from 'react-select';

const mockStockSnapshot = [
    { id: 1, name: 'IPHONE14', startQty: 100, endQty: 80 },
    { id: 2, name: 'IPHONE14 Pro', startQty: 50, endQty: 30 },
    { id: 3, name: 'IPHONE14 Pro Max', startQty: 20, endQty: 5 },
];

const discrepancyOptions = [
    { value: 'return_to_vendor', label: 'Return to Vendor' },
    { value: 'return_from_customer', label: 'Return from Customer' },
    { value: 'shipment_from_vendor', label: 'Shipment from Vendor' },
    { value: 'Others', label: 'Others-specify' },
];

const customStyles = {
    option: (provided, state) => ({
        ...provided,
        backgroundColor: state.isFocused ? '#103B63' : 'white',
        color: state.isFocused ? 'white' : '#333',
        cursor: 'pointer',
    }),
    control: (provided) => ({
        ...provided,
        borderColor: '#ccc',
        borderRadius: '0.375rem',
        padding: '2px',
        boxShadow: 'none',
        '&:hover': {
            borderColor: '#103B63',
        },
    }),
    singleValue: (provided) => ({
        ...provided,
        color: '#333',
    }),
};

const Page = () => {
    const navigate = useNavigate();
    const [showDiscrepancy, setShowDiscrepancy] = useState(false);
    const [itemDetails, setItemDetails] = useState({});

    useEffect(() => {
        gsap.fromTo('.content', { y: 50, opacity: 0 }, { y: 0, opacity: 1, duration: 1, ease: 'power4.out' });
    }, []);

    const handleChange = (id, field, value) => {
        setItemDetails(prev => ({
            ...prev,
            [id]: {
                ...prev[id],
                [field]: value
            }
        }));
    };

    const handleEndShift = () => {
        const time = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

        if (showDiscrepancy) {
            toast.success(`Discrepancy reported and shift ended at ${time}`);
        } else {
            toast.success(`Shift ended at ${time}`);
        }

        // console.log("Submitted Data:", itemDetails);

        setShowDiscrepancy(false);
        setItemDetails({});
        setTimeout(() => navigate(-1), 3000);
    };


    return (
        <div className="min-h-screen mb-10">
            <Header />

            <div className="flex justify-start mb-1">
                <button
                    type="button"
                    onClick={() => navigate(-1)}
                    className="cursor-pointer bg-white text-gray-800 px-6 py-2 rounded-md text-sm hover:bg-gray-300 m-5"
                >
                    ← Return
                </button>
            </div>

            <div className="max-w-7xl mx-auto p-6 content bg-white shadow-md mt-8 overflow-x-auto">
                <h1 className="text-2xl font-bold mb-4">End Shift</h1>
                <p className="text-gray-600 mb-6">Please review current stock and fill in the required details before ending your shift.</p>

                <table className="w-full table-auto text-sm shadow-sm mb-6">
                    <thead className="bg-[#FAFAFB] sticky top-0 z-10">
                        <tr className="text-left">
                            <th className="p-3 font-bold text-[#153d64]">Product</th>
                            <th className="p-3 font-bold text-[#153d64]">Start Shift QTY</th>
                            <th className="p-3 font-bold text-[#153d64]">End Shift QTY</th>
                            <th className="p-3 font-bold text-[#153d64]">Sold QTY</th>
                           
                            {showDiscrepancy && (
                                <>
                                    <th className="p-3 font-bold text-[#153d64]">Returned QTY</th>
                                    <th className="p-3 font-bold text-[#153d64]">Manual Count</th>
                                    <th className="p-3 font-bold text-[#153d64]">Discrepancy Type</th>
                                    <th className="p-3 font-bold text-[#153d64]">Additional Notes</th>
                                </>
                            )}

                        </tr>
                    </thead>
                    <tbody>
                        {mockStockSnapshot.map((item, i) => {
                            const details = itemDetails[item.id] || {};
                            const soldQty = item.startQty - item.endQty;

                            return (
                                <tr
                                    key={item.id}
                                    className={`transition-colors duration-200 hover:bg-[#FAFAFB] ${i % 2 === 1 ? 'bg-[#FAFAFB]' : ''} border-b`}
                                >
                                    <td className="p-3 font-bold text-[#9095a1]">{item.name}</td>
                                    <td className="p-3 text-[#9095a1]">{item.startQty}</td>
                                    <td className="p-3 text-[#9095a1]">{item.endQty}</td>
                                    <td className="p-3 text-[#9095a1]">{soldQty}</td>
                                    {showDiscrepancy && (
                                        <>
                                            <td className="p-3 text-[#9095a1]">
                                                {Math.floor(Math.random() * 10)} {/* Random return qty */}
                                            </td>
                                            <td className="p-3">
                                                <input
                                                    type="number"
                                                    min="0"
                                                    className="w-full px-3 py-2 rounded bg-gray-100 focus:outline-none"
                                                    value={details.manualQty || ''}
                                                    onChange={(e) => handleChange(item.id, 'manualQty', e.target.value)}
                                                    placeholder="Manual count"
                                                />
                                            </td>
                                            <td className="p-3">
                                                <Select
                                                    options={discrepancyOptions}
                                                    value={discrepancyOptions.find(opt => opt.value === details.discrepancyType) || null}
                                                    onChange={(selectedOption) =>
                                                        handleChange(item.id, 'discrepancyType', selectedOption ? selectedOption.value : null)
                                                    }
                                                    styles={customStyles}
                                                    placeholder="Select"
                                                    isClearable
                                                />
                                            </td>
                                            <td className="p-3">
                                                <textarea
                                                    className="w-full px-3 py-2 rounded bg-gray-100 focus:outline-none"
                                                    value={details.notes || ''}
                                                    onChange={(e) => handleChange(item.id, 'notes', e.target.value)}
                                                    placeholder="Notes"
                                                />
                                            </td>
                                        </>
                                    )}

                                </tr>
                            );
                        })}
                    </tbody>
                </table>

                <div className="flex flex-col justify-center items-center mt-6">
                    <button
                        onClick={handleEndShift}
                        className="bg-[#103B63] text-white px-10 py-2 rounded-full cursor-pointer transition w-auto max-w-xs"
                    >
                        {showDiscrepancy ? 'Report & End Shift' : 'End Shift'}
                    </button>

                    {!showDiscrepancy && (
                        <div className="flex items-center justify-center space-x-2 mt-2">
                            <MdReport className="text-[#103B63]" />
                            <button
                                onClick={() => setShowDiscrepancy(true)}
                                className="text-sm text-[#9095a1] font-bold cursor-pointer"
                            >
                                Report Discrepancy
                            </button>
                        </div>
                    )}
                </div>

            </div>
        </div>
    );
};

export default Page;

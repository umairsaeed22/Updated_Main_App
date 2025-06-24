import React, { useState, useEffect } from 'react';
import Header from '../../../components/Headers';
import { gsap } from 'gsap';
import { useNavigate, useLocation } from 'react-router-dom';
import { toast } from 'react-toastify'; // Import Toast
import 'react-toastify/dist/ReactToastify.css'; // Import Toast styles
import { postVerifySerials } from '../../../services/dashboardApi';

export default function VerifySerialNumbers() {
    const navigate = useNavigate();
    const location = useLocation();
    const grnList = location.state?.grnList || [];

    const [user, setUser] = useState(null);
    const [unverifiedArticles, setUnverifiedArticles] = useState(grnList.unverifiedArticles || []);
    const [inputSerials, setInputSerials] = useState({});
    const [submittedSerials, setSubmittedSerials] = useState({});
    const [isInputDisabled, setIsInputDisabled] = useState({});
    const [errorMessages, setErrorMessages] = useState({});
    const [selectedArticles, setSelectedArticles] = useState({});
    const [refNo, setRefNo] = useState([]);

    useEffect(() => {
        gsap.fromTo(
            ".content",
            { y: 50, opacity: 0 },
            { y: 0, opacity: 1, duration: 1, ease: "power4.out" }
        );

        const userString = localStorage.getItem('user');
        const parsedUser = userString ? JSON.parse(userString) : null;
        setUser(parsedUser);
    }, [grnList]);

    const handleInputChange = (value, articleIndex) => {
        setInputSerials(prev => ({
            ...prev,
            [articleIndex]: value
        }));
    };

    const handleSubmit = (e, articleIndex) => {
        if (e.key === 'Enter' && inputSerials[articleIndex]) {
            const serial = inputSerials[articleIndex];

            if ((submittedSerials[articleIndex] || []).includes(serial)) {
                setErrorMessages(prev => ({
                    ...prev,
                    [articleIndex]: "This serial number has already been entered."
                }));

                setTimeout(() => {
                    setErrorMessages(prev => ({
                        ...prev,
                        [articleIndex]: ""
                    }));
                }, 2000);
                return;
            }

            const matchingSerials = unverifiedArticles[articleIndex].serials.filter(
                s => s.scannedSerialNo === serial && !s.verified
            );

            if (matchingSerials.length > 0) {
                const updatedSubmitted = {
                    ...submittedSerials,
                    [articleIndex]: [...(submittedSerials[articleIndex] || []), serial]
                };
                setSubmittedSerials(updatedSubmitted);
                setInputSerials(prev => ({ ...prev, [articleIndex]: "" }));
                setErrorMessages(prev => ({ ...prev, [articleIndex]: "" }));

                const totalUnverified = unverifiedArticles[articleIndex].serials.filter(s => !s.verified).length;
                if ((updatedSubmitted[articleIndex]?.length || 0) >= totalUnverified) {
                    setIsInputDisabled(prev => ({
                        ...prev,
                        [articleIndex]: true
                    }));
                }
            } else {
                setErrorMessages(prev => ({
                    ...prev,
                    [articleIndex]: "Enter correct serial number for this article."
                }));

                setTimeout(() => {
                    setErrorMessages(prev => ({
                        ...prev,
                        [articleIndex]: ""
                    }));
                }, 2000);
            }
        }
    };

    const handleRemoveSerial = (serialToRemove, articleIndex) => {
        const updatedList = submittedSerials[articleIndex].filter(s => s !== serialToRemove);
        setSubmittedSerials(prev => ({
            ...prev,
            [articleIndex]: updatedList
        }));
        setIsInputDisabled(prev => ({
            ...prev,
            [articleIndex]: false
        }));
    };

    const handleVerify = async () => {
        const serialsToVerify = refNo;
        try {
            const response = await postVerifySerials(serialsToVerify, user?.id);
            if (response.success) {
                toast.success('Serials verified successfully!');

                // Clear all relevant states
                setUnverifiedArticles([]);
                setInputSerials({});
                setSubmittedSerials({});
                setIsInputDisabled({});
                setErrorMessages({});
                setSelectedArticles({});
                setRefNo([]);
                navigate(-1);
                // Delay navigation by 3 seconds

            } else {
                toast.error('Failed to verify serials: ' + response.message);
            }
        } catch (error) {
            toast.error('An error occurred during verification.');
        }
    };

    const handleArticleCheckbox = (index) => {
        setSelectedArticles(prev => {
            const updated = {
                ...prev,
                [index]: !prev[index]
            };

            const selectedIndexes = Object.entries(updated)
                .filter(([_, isSelected]) => isSelected)
                .map(([idx]) => parseInt(idx));

            let allRefNos = [];

            selectedIndexes.forEach(i => {
                const submitted = submittedSerials[i] || [];
                const matchedRefNos = unverifiedArticles[i].serials
                    .filter(s => submitted.includes(s.scannedSerialNo))
                    .map(s => s.refNo);

                allRefNos = [...allRefNos, ...matchedRefNos];
            });

            setRefNo(allRefNos);
            return updated;
        });
    };


    // Check if all serials for all articles are submitted
    const allSerialsEntered = unverifiedArticles.every((article, index) => {
        const totalUnverified = article.serials.filter(s => !s.verified).length;
        return (submittedSerials[index]?.length || 0) >= totalUnverified;
    });

    // New: Check if at least one article has serials entered and its checkbox selected
    const isAnyArticleReadyForVerify = unverifiedArticles.some((article, idx) => {
        const hasMatched = (submittedSerials[idx]?.length || 0) > 0;
        const isChecked = selectedArticles[idx] === true;
        return hasMatched && isChecked;
    });


    return (
        <div className="min-h-screen animated-bg">
            <Header />
            <div className="flex justify-start">
                <button
                    type="button"
                    onClick={() => navigate(-1)}
                    className="cursor-pointer bg-white text-gray-800 px-6 py-2 rounded-md text-sm hover:bg-gray-300 m-5"
                >
                    ← Return
                </button>
            </div>

            <div className="content p-6 text-left bg-white mx-4 sm:mx-6 lg:mx-15 xl:mx-30 my-2 rounded shadow-md">
                <div>
                    <h1 className="text-2xl font-bold text-[#103B63]">Verify IMEI Numbers</h1>
                    <p className="text-sm text-gray-400 mt-1">Please VERIFY the below listed IMEI Numbers</p>
                </div>

                <div className="mt-6 flex flex-col md:flex-row justify-between items-start gap-4">
                    <div className="bg-white rounded-md p-4 w-full md:w-3/5 shadow-lg">
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-y-2 text-sm">
                            <InfoBlock label="GRN REFERENCE" value={grnList.inBoundNo} />
                            <InfoBlock label="PO" value={grnList.refDoc} />
                            <InfoBlock label="Created Date" value={grnList.sapCreatedBy} />
                            <InfoBlock label="Created By" value={grnList.sapCreatedOn} />
                            <InfoBlock label="STATUS" value="NEW" bold textColor="text-[#efb034]" />
                        </div>
                    </div>

                    <div className="flex gap-2 w-full md:w-2/5 justify-end">
                        <StatCard count={grnList.totalScanQty} label="Total Quantity" />
                        <StatCard count={grnList.totalScanQty} bgColor="bg-[#8aa386]" textColor="text-white" label="Scanned Quantity" />
                    </div>
                </div>

                <div className="mt-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 p-4">
                    {unverifiedArticles.map((article, aIdx) => {
                        const totalUnverified = article.serials.filter(s => !s.verified).length;
                        const submittedCount = (submittedSerials[aIdx]?.length || 0);
                        const allEntered = submittedCount >= totalUnverified;

                        // Article-specific atLeastOneMatched and selectCheckBox:
                        const articleHasMatchedSerials = submittedCount > 0;
                        const articleCheckboxSelected = selectedArticles[aIdx] === true;

                        return (
                            <div key={article.article} className="rounded-lg p-4 shadow-md border-2 border-dashed border-[#efb034] cursor-pointer">
                                <div className="mb-4">
                                    <h3 className="text-lg font-[800] text-[#153d64]">Article - {article.article}</h3>
                                    <p className='font-semibold text-gray-400 text-xs'>{article.description}</p>
                                    {articleHasMatchedSerials && (
                                        <label className="flex items-center space-x-2">
                                            <input
                                                type="checkbox"
                                                checked={articleCheckboxSelected}
                                                onChange={() => handleArticleCheckbox(aIdx)}
                                                className="accent-[#103B63]"
                                            />
                                            <span className="text-xs font-medium text-gray-600">Proceed with this article's matched IMEI(s)</span>
                                        </label>
                                    )}
                                </div>

                                <div className="space-y-3 max-h-[400px] overflow-y-auto pr-2">
                                    <div>
                                        <h4 className="text-sm font-bold text-[#103B63]">Unverified IMEI Numbers:</h4>
                                        <ul className="list-disc pl-4 text-sm font-bold text-[#efb034]">
                                            {article.serials
                                                .filter(serial => !serial.verified)
                                                .map((serial, index) => {
                                                    const maskedSerial = serial.scannedSerialNo.slice(0, -2).replace(/./g, '*') + serial.scannedSerialNo.slice(-2);
                                                    const isMatched = (submittedSerials[aIdx] || []).includes(serial.scannedSerialNo);
                                                    return (
                                                        <li
                                                            key={index}
                                                            className={isMatched ? 'text-green-600' : ''}
                                                        >
                                                            {maskedSerial}
                                                        </li>
                                                    );
                                                })}
                                        </ul>
                                    </div>

                                    <div>
                                        <input
                                            type="text"
                                            placeholder="Enter IMEI"
                                            value={inputSerials[aIdx] || ''}
                                            onChange={e => handleInputChange(e.target.value, aIdx)}
                                            onKeyDown={e => handleSubmit(e, aIdx)}
                                            disabled={isInputDisabled[aIdx]}
                                            className="border border-gray-300 rounded px-2 py-1 w-full"
                                        />

                                        {errorMessages[aIdx] && (
                                            <p className="text-red-500 text-xs mt-1">{errorMessages[aIdx]}</p>
                                        )}
                                    </div>

                                    <div>
                                        <h4 className="text-sm font-bold text-[#103B63]">Entered IMEI Numbers:</h4>
                                        <ul className="list-disc pl-4 text-sm">
                                            {(submittedSerials[aIdx] || []).length > 0 ? (
                                                (submittedSerials[aIdx] || []).map((serial, idx) => (
                                                    <li key={idx} className="flex justify-between items-center">
                                                        <span>{serial}</span>
                                                        <button
                                                            onClick={() => handleRemoveSerial(serial, aIdx)}
                                                            className="text-red-500 ml-2 hover:underline text-xs"
                                                        >
                                                            Remove
                                                        </button>
                                                    </li>
                                                ))
                                            ) : (
                                                <li className="text-gray-400 text-sm italic">No IMEI numbers</li>
                                            )}
                                        </ul>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>

                <div className="text-center mt-6">
                    {!isAnyArticleReadyForVerify && (
                        <p className="text-red-600 text-sm mt-2">
                            Please enter IMEI numbers and select at least one checkbox to enable VERIFY.
                        </p>
                    )}
                    <button
                        type="button"
                        onClick={handleVerify}
                        disabled={!isAnyArticleReadyForVerify}
                        className={`px-6 py-2 rounded-md font-bold cursor-pointer ${isAnyArticleReadyForVerify
                            ? 'bg-[#8aa386] text-white hover:bg-[#6a7f66]'
                            : 'bg-gray-300 text-gray-600 cursor-not-allowed'
                            }`}
                    >
                        Verify
                    </button>
                </div>
            </div>
        </div>
    );
}

const InfoBlock = ({ label, value, bold = false, textColor = "text-gray-400" }) => (
    <div>
        <p className="font-bold text-[#103B63]">{label}</p>
        <p className={`${bold ? "font-extrabold" : "font-semibold"} ${textColor}`}>{value}</p>
    </div>
);

const StatCard = ({ count, label, bgColor = "bg-white", textColor = "text-gray-500" }) => (
    <div className={`${bgColor} px-4 py-2 rounded-md shadow-md text-center`}>
        <p className={`text-lg font-bold ${textColor === "text-white" ? "text-white" : "text-black"}`}>{count}</p>
        <p className={`text-sm ${textColor}`}>{label}</p>
    </div>
);


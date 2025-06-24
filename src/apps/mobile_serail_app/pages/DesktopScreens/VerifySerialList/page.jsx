import React, { useRef, useEffect, useState } from 'react';
import { CgPlayTrackNextO } from "react-icons/cg";
import Header from '../../../components/Headers';
import { gsap } from 'gsap';
import { useNavigate } from 'react-router-dom';
import { getVerifySerials } from '../../../services/dashboardApi'; // Adjust the path accordingly

const Page = () => {
    const navigate = useNavigate();
    const [grnList, setGrnList] = useState([]);

    // Function to handle tile click and pass grn data to the next page
    const handleClick = (grnData) => {
        navigate('/mobile-serial-app/verify-article', { state: { grnList: grnData } });
    };

    useEffect(() => {
        // Animate content entrance
        gsap.fromTo(
            ".content",
            { y: 50, opacity: 0 },
            { y: 0, opacity: 1, duration: 1, ease: "power4.out" }
        );

        // Fetch GRN data from API
        const fetchData = async () => {
            const response = await getVerifySerials(1, 20);
            if (response.success && response.data) {
                setGrnList(response.data.grNs);
            }
        };

        fetchData();
    }, []);


    return (
        <div className="min-h-screen animated-bg">
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

            <main className="p-6 content text-left bg-white mx-4 sm:mx-6 lg:mx-15 xl:mx-30 my-6 rounded">
                <h2 className="text-2xl font-[800] text-[#000] mb-1">Verify GRNs</h2>
                <p className="text-sm text-gray-500 mb-6">Please CLICK the link you want to update</p>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    {grnList.length > 0 ? (
                        grnList.map((grn, index) => (
                            <button
                                key={index}
                                onClick={() => handleClick(grn)} // Pass the specific grn data
                                className="cursor-pointer flex items-center justify-between w-full p-4 rounded-xl bg-white border-l-5 border-[#8aa386] shadow-lg hover:bg-gray-50"
                            >
                                <div className="flex-col text-left">
                                    <p className="text-[#103B63] font-[800]">
                                        GRN # {grn.inBoundNo || 'N/A'}
                                    </p>
                                    <span className="text-gray-400 font-semibold text-sm">
                                        Created By - {grn.sapCreatedBy || 'Unknown'}
                                    </span>
                                </div>
                                <CgPlayTrackNextO className="text-[#8aa386] text-3xl" />
                            </button>
                        ))
                    ) : (
                        <p className="text-gray-500">No GRNs Available...</p>
                    )}
                </div>
            </main>
        </div>
    );
};

export default Page;

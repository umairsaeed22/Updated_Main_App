import React from 'react';
import { useNavigate } from 'react-router-dom';
import SuccessIcon from '../../../assets/Selection.png';
import StepHeader from '../../../components/Header';
import { useGRNStore } from '../../../store/useGRNStore';

const page = () => {
    const navigate = useNavigate();
    const { grnData } = useGRNStore();

    const handleDoneClick = () => {
        navigate('/mobile-serial-app/login'); // adjust to your landing or dashboard route
    };

    return (
        <div className="w-full min-h-screen bg-[#FFF] flex flex-col items-center">
            {/* Header */}
            <StepHeader title="Registered" statusLabel="" statusValue="" />

            {/* Card */}
            <div className="mt-2 bg-white max-w-sm border-2 border-dashed border-[#BDC1CAFF] rounded-2xl p-6 shadow w-[95%]">
                <div className="flex justify-center mb-4">
                    <img src={SuccessIcon} alt="Success" className="w-24 h-24 object-contain" />
                </div>
                <h2 className="text-[#153d64] font-[800] text-center text-xl mb-4">Registration Completed!</h2>

                <div className="text-sm text-[#153D64] mb-2">
                    <div className="flex justify-between mb-1 items-center">
                        <span className="text-[#153d64] font-[800] text-sm">GRN REFERENCE</span>
                        <span className="text-[#9095A1FF] font-bold text-sm">{grnData.grn}</span>
                    </div>
                    <div className="flex justify-between mb-1 items-center">
                        <span className="text-[#153d64] font-[800] text-sm">PO</span>
                        <span className="text-[#9095A1FF] font-bold text-sm">{grnData.po}</span>
                    </div>
                    <div className="flex justify-between mb-1 items-center">
                        <span className="text-[#153d64] font-[800] text-sm">Created Date</span>
                        <span className="text-[#9095A1FF] font-bold text-sm">{grnData.createdDate}</span>
                    </div>
                    <div className="flex justify-between mb-1 items-center">
                        <span className="text-[#153d64] font-[800] text-sm">Created By</span>
                        <span className="text-[#9095A1FF] font-bold text-sm">{grnData.createdBy}</span>
                    </div>

                    <div
                        className="border-dashed border-[#1dd75b] shadow-2xl rounded-lg flex justify-between items-center px-4 py-3"
                        style={{ borderWidth: '2px', borderStyle: 'dashed', borderDasharray: '10 4' }} // Cast to `any` here as well
                    >
                        <span className="text-[#153d64] font-[800] text-xl">STATUS</span>
                        <span className="text-[#1dd75b] font-[800] text-xl">{grnData.status}</span>
                    </div>
                </div>
            </div>

            {/* Done Button */}
            <button
                onClick={handleDoneClick}
                className="mt-6 bg-[#153D64] text-white font-semibold px-12 py-2 rounded-full shadow hover:bg-[#0f2e4a] transition"
            >
                Done
            </button>
        </div>
    );
};

export default page;

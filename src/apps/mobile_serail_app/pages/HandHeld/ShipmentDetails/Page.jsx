import React from 'react';
import { useNavigate } from 'react-router-dom'; // No need for useLocation
import { useGRNStore } from '../../../store/useGRNStore'; // Import Zustand store
import StepHeader from '../../../components/Header';

const Page = () => {
  const navigate = useNavigate(); // Initialize navigate function

  // Get the grnData and grnNumber from Zustand store
  const { grnData, grnNumber } = useGRNStore();

  // Function to format the date to DD-MM-YYYY
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A'; // Return 'N/A' if no date is provided
    const date = new Date(dateString);
    const day = date.getDate().toString().padStart(2, '0'); // Add leading zero to day
    const month = (date.getMonth() + 1).toString().padStart(2, '0'); // Add leading zero to month (months are zero-based)
    const year = date.getFullYear();
    return `${day}-${month}-${year}`;
  };

  // Define some default details if no data was found in the store
  const details = grnData
    ? [
      { label: 'GRN REFERENCE', value: grnNumber },
      { label: 'PO', value: grnData.po || 'N/A' },
      { label: 'Created Date', value: formatDate(grnData.createdDate) }, 
      { label: 'Created By', value: grnData.createdBy || 'N/A' },
      
    ]
    : [];

  const handleButtonClick = () => {
    navigate('/mobile-serial-app/product-list'); // Navigate to /product-list route on button click
  };

  return (
    <div className="min-h-screen">
      <StepHeader title="Shipement Details" statusLabel="" statusValue="" />

      <div className="flex justify-center mt-1">
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

          {/* Status Box */}
          {/* Status Box */}
          <div
            className="border-dashed border-[#FFA500] shadow-2xl rounded-lg flex justify-between items-center px-4 py-5"
            style={{ borderWidth: '2px', borderStyle: 'dashed', borderDasharray: '10 4' }}
          >
            <span className="text-[#153d64] font-[800] text-xl">STATUS</span>
            <span className="text-[#EFB034FF] font-[800] text-xl">
              {grnData?.status?.toUpperCase() || 'N/A'}
            </span>
          </div>


          {/* Start Registration Button */}
          {/* Start Registration Button or Message */}
          <div className="flex justify-center mt-6">
            {grnData?.status === 'NEW' ? (
              <button
                className="bg-[#153d64] text-white px-12 py-3 rounded-full font-semibold text-base hover:bg-[#0f2e4a] transition"
                onClick={handleButtonClick}
              >
                Start Registration
              </button>
            ) : (
              <div className="text-[#153d64] font-bold text-base">
                All the articles have been registered.
              </div>
            )}
          </div>

        </div>
      </div>
    </div>
  );
};

export default Page;

import React, { useState, useEffect } from 'react';
import Header from './Headers';
import { gsap } from 'gsap';
import { useLocation, useNavigate } from "react-router-dom";

const DetailPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const poDetails = location.state?.poDetails;

  useEffect(() => {
    // Animate content entrance
    gsap.fromTo(
      ".content",
      { y: 50, opacity: 0 },
      { y: 0, opacity: 1, duration: 1, ease: "power4.out" }
    );
  }, []);

  
  return (
    <div className='animated-bg'>
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
      <div className="content container mx-auto p-8 bg-white shadow-md">
        <div className="flex flex-col justify-between">
          <h2 className="text-2xl font-bold text-gray-800">Detail Page</h2>
          <p className="text-sm text-gray-500 mb-4">Details of GRN-1023454522 are mentioned below:</p>
        </div>

        <div className="bg-white p-4 rounded-lg flex flex-col items-center cursor-pointer gap-4">
          <div class="border-dashed border-[#FFA500] border-2 bg-gray-100 rounded-md p-4 w-full md:w-3/5 shadow-lg">
            <div class="grid grid-cols-2 md:grid-cols-3 gap-y-2 text-sm">
              <div className='text-left'>
                <p class="font-bold text-[#103B63]">PO</p>
                <p class="font-semibold text-gray-400">{poDetails?.refDoc}</p>
              </div>
              <div className='text-left'>
                <p class="font-bold text-[#103B63]">Created Date</p>
                <p class="font-semibold text-gray-400">{poDetails?.createdDate}</p>
              </div>
              <div className='text-left'>
                <p class="font-bold text-[#103B63]">Created By</p>
                <p class="font-semibold text-gray-400">{poDetails?.createdBy}</p>
              </div>

            </div>
          </div>
          <div className="w-full  grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Left Large Box */}
            <div className="p-4 rounded-md col-span-1 md:col-span-1 row-span-2 shadow-md cursor-pointer bg-[#f9fafb] hover:shadow-lg hover:bg-[#f9fafb]">
              <h4 className="font-[800] text-md text-[#171A1FFF]">GRN Numbers</h4>
              <p className="text-xs text-gray-400 mb-2">List of GRN numbers</p>
              {poDetails?.grNs.map((grn, index) => (
                <ul className="space-y-1 text-sm text-[#9095A1FF] font-[800]">
                  <li key={index}>GRN-{grn.inBoundNo}</li>
                </ul>
              ))}
            </div>

            {/* Four Smaller Boxes */}
            {poDetails.grNs.map((b, i) => (
              <div
                key={i}
                className="bg-[#f9fafb] p-2 rounded-md shadow-md cursor-pointer hover:shadow-lg hover:bg-[#f9fafb] transition-all duration-200"
              >
                <div className="flex justify-between items-start bg-[#103B63] p-2 rounded-md">
                  <h4 className="font-[800] text-sm text-[#FFA500]">{b.inBoundNo}</h4>
                  <div className="bg-[#103B63] text-white text-[10px] px-2 py-1 rounded-md leading-[1.2] text-right">
                    <div>Total Qty: {b.totalDelQty}</div>
                    <div>Missing Qty: {b.totalMissingQty}</div>
                    <div>Registered Qty: {b.totalScanQty}</div>
                    <div>Verified Qty: {b.verifiedSerials}</div>
                  </div>
                </div>

                <p className="text-sm text-[#171A1FFF] font-[800] mt-2">Details</p>
                <div className="space-y-4 mt-2">
                  {poDetails.grNs.map((item, index) => (
                    <div key={index} className="border border-gray-200 rounded-xl p-4 shadow-sm bg-white">
                      {/* Article Number */}
                      {item.articles.map((a, i) => {
                        return (
                          <div key={i}>
                            <p className="text-[#171A1FFF] font-bold text-sm mb-1">Article: <span className="text-[#9095A1FF] font-bold">{a.article}</span></p>
                            <div className="grid grid-cols-3 gap-2 text-xs mb-2">
                              <div>
                                <p className="font-[800] text-[#171A1FFF]">Received By</p>
                                <p className="text-[#9095A1FF] font-bold">{item.receivedBy}</p>
                              </div>
                              <div>
                                <p className="font-[800] text-[#171A1FFF]">Registered Date</p>
                                <p className="text-[#9095A1FF] font-bold">{item.registeredDate}</p>
                              </div>
                              <div>
                                <p className="font-[800] text-[#171A1FFF]">Verified By</p>
                                <p className="text-[#9095A1FF] font-bold">{item.verifiedBy}</p>
                              </div>
                            </div>

                            <div className="grid grid-cols-3 gap-2 text-[11px] font-bold text-[#9095A1FF]">
                              
                              {a.serials.map((serial, sIndex) => (
                                <a key={sIndex} href="#" className="hover:text-blue-500">
                                  {serial.scannedSerialNo}
                                </a>
                              ))}
                            </div>
                          </div>
                        )
                      })}

                      {/* Metadata */}


                      {/* Serial Numbers */}
                      {/* <div className="grid grid-cols-3 gap-2 text-[11px] font-bold text-[#9095A1FF]">
                        {item.serialNumbers.map((serial, sIndex) => (
                          <a key={sIndex} href="#" className="hover:text-blue-500">
                            {serial}
                          </a>
                        ))}
                      </div> */}
                    </div>
                  ))}
                </div>

              </div>

            ))}
          </div>

        </div>
      </div>
    </div>

  );
};

const InfoBlock = ({ label, value }) => (
  <div className="flex flex-col">
    <span className="font-semibold text-gray-700">{label}</span>
    <span className="text-gray-500">{value}</span>
  </div>
);

const StatCard = ({ label, value }) => (
  <div className="p-4 bg-[#f4f4f9] rounded-lg shadow-md text-center">
    <div className="text-xl font-bold text-[#103B63]">{value}</div>
    <div className="text-sm text-gray-600">{label}</div>
  </div>
);

export default DetailPage;

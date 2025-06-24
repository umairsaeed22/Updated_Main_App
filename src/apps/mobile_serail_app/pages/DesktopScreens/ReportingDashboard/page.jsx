import React, { useEffect, useState } from "react";
import Header from "../../../components/Headers";
import { gsap } from 'gsap';
import { useNavigate } from "react-router-dom";
import { getShiftHistory } from "../../../services/dashboardApi";
import { getShiftDetails } from '../../../services/dashboardApi';
import { ChevronLeft, ChevronRight } from "lucide-react";

const Page = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [shiftData, setShiftData] = useState({ activeShift: null, allShifts: [] });
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [activeShiftDetails, setActiveShiftDetails] = useState(null);
  const pageSize = 10;

  useEffect(() => {
    // Animate content entrance
    gsap.fromTo(
      ".content",
      { y: 50, opacity: 0 },
      { y: 0, opacity: 1, duration: 1, ease: "power4.out" }
    );
    const userString = localStorage.getItem('user');
    const parsedUser = userString ? JSON.parse(userString) : null;
    setUser(parsedUser);
  }, []);


  // Fetch data for given page number
  const fetchShiftData = async (pageNumber) => {
    setLoading(true);
    try {
      const res = await getShiftHistory(user?.id, pageNumber, pageSize);
      console.log(res)
      if (res.success && res.data) {
        setShiftData(res.data);

        const totalCount = res.data.totalCount || 0;
        const totalPagesCalc = Math.ceil(totalCount / pageSize);
        setTotalPages(totalPagesCalc > 0 ? totalPagesCalc : 1);
      }
    } catch (error) {
      console.error("Failed to fetch shift history:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user?.id) fetchShiftData(currentPage);
  }, [user?.id, currentPage]);

  // Pagination page number generator
  const generatePages = () => {
    const pages = [];
    if (totalPages <= 7) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      if (currentPage <= 4) {
        pages.push(1, 2, 3, 4, 5, "...", totalPages);
      } else if (currentPage >= totalPages - 3) {
        pages.push(
          1,
          "...",
          totalPages - 4,
          totalPages - 3,
          totalPages - 2,
          totalPages - 1,
          totalPages
        );
      } else {
        pages.push(
          1,
          "...",
          currentPage - 1,
          currentPage,
          currentPage + 1,
          "...",
          totalPages
        );
      }
    }
    return pages;
  };

  const pages = generatePages();

  const buttonBaseStyle = {
    borderColor: "#DEE1E6FF",
    borderStyle: "solid",
    boxShadow: "0px 4px 9px #171a1f1C, 0px 0px 2px #171a1f1F",
    fontWeight: 400,
    color: "#9095A1FF",
  };

  const activeButtonStyle = {
    ...buttonBaseStyle,
    backgroundColor: "#103B63",
    color: "#fff",
  };

  const handleReportDiscrepancy = async (shiftId) => {
    try {
      const res = await getShiftDetails(shiftId);
      if (res.success && res.data) {
        console.log('Shift Details:', res.data);
        setActiveShiftDetails(res.data);
        // You can navigate or show a modal here
        navigate('/mobile-serial-app/start-shift', { state: { data: res.data } });
      } else {
        console.error('Failed to fetch shift details:', res.message);
      }
    } catch (err) {
      console.error('Error while reporting discrepancy:', err);
    }
  };

  const handleReportDiscrepancyHistory = async (shiftId) => {
    try {
      const res = await getShiftDetails(shiftId);
      if (res.success && res.data) {
        console.log('Shift Details:', res.data);
        setActiveShiftDetails(res.data);
        navigate('/mobile-serial-app/Shift-detail-page', { state: { data: res.data } });
      } else {
        console.error('Failed to fetch shift details:', res.message);
      }
    } catch (err) {
      console.error('Error while reporting discrepancy:', err);
    }
  };

  return (
    <div className="min-h-screen animated-bg">
      <Header />

      <div className="flex justify-start">
        <button
          onClick={() => navigate(-1)}
          className="cursor-pointer bg-white text-gray-800 px-6 py-2 rounded-md text-sm hover:bg-gray-300 m-5"
        >
          ← Return
        </button>
      </div>

      <div className="p-6 mx-4 sm:mx-6 lg:mx-15 xl:mx-30 my-6 bg-white rounded content">
        <h1 className="text-2xl font-[800] text-[#000] mb-1">Inventory Reporting</h1>
        <p className="text-sm text-gray-500 mb-6">
          Below are the inventory details based on Start and End shifts
        </p>

        {/* Ongoing Shift Table */}
        <div className="mt-8 px-6 pb-10 mx-auto">
          <h2 className="flex items-center text-xl font-bold text-[#103B63] mb-4">
            <span
              className={`w-2 h-2 rounded-full mr-2 ${shiftData?.activeShift ? 'bg-red-500' : 'bg-[#efb034]'
                }`}
            ></span>
            <span
              className={`${shiftData?.activeShift ? 'text-red-500' : 'text-[#efb034]'
                }`}
            >
              {shiftData?.activeShift
                ? 'Unresolved Shifts — Report Discrepancy'
                : 'Current Shift'}
            </span>
          </h2>
          <div className="overflow-x-auto bg-white shadow rounded-lg">
            <table className="w-full table-auto text-sm shadow-sm">
              <thead className="bg-[#FAFAFB] sticky top-0 z-10">
                <tr className="text-left">
                  <th className="p-3 font-[800] text-lg text-[#153d64]">Shift ID</th>
                  <th className="p-3 font-[800] text-lg text-[#153d64]">Start Time</th>
                  <th className="p-3 font-[800] text-lg text-[#153d64]">Discrepancies</th>
                  <th className="p-3 font-[800] text-lg text-[#153d64]">Status</th>
                  <th className="p-3 font-[800] text-lg text-[#153d64]">Action</th>
                </tr>
              </thead>
              <tbody>
                {shiftData?.activeShift || shiftData?.onGoingShift ? (
                  <tr
                    key={
                      (shiftData?.activeShift || shiftData?.onGoingShift)?.shiftId
                    }
                    className="cursor-pointer transition-colors duration-200 hover:bg-[#FAFAFB] border-b"
                  >
                    <td className="p-3 font-bold text-[#9095a1]">
                      {(shiftData?.activeShift || shiftData?.onGoingShift)?.shiftId.slice(0, 8)}********
                    </td>
                    <td className="p-3 font-bold text-[#9095a1]">
                      {(shiftData?.activeShift || shiftData?.onGoingShift)?.startTime}
                    </td>
                    <td
                      className={`p-3 font-[800] ${(shiftData?.activeShift || shiftData?.onGoingShift)
                        ?.discrepancyCount === 0
                        ? 'text-green-600'
                        : 'text-red-500'
                        }`}
                    >
                      {(shiftData?.activeShift || shiftData?.onGoingShift)
                        ?.discrepancyCount || 'None'}
                    </td>
                    <td className="p-3 font-bold text-[#efb034]">
                      {shiftData?.activeShift ? 'Pending' : 'Ongoing'}
                    </td>
                    <td className="p-3 font-bold text-[#103B63] hover:underline cursor-pointer">
                      {shiftData?.activeShift ? (
                        <span
                          onClick={() =>
                            handleReportDiscrepancy(shiftData.activeShift.shiftId)
                          }
                        >
                          Report discrepancy
                        </span>
                      ) : (
                        <span
                          onClick={() =>
                            handleReportDiscrepancyHistory(
                              shiftData?.onGoingShift?.shiftId
                            )
                          }
                        >
                          View
                        </span>
                      )}
                    </td>
                  </tr>
                ) : (
                  <tr>
                    <td colSpan={5} className="p-3 text-gray-500 text-center">
                      No current shift found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Shift History */}
        <div className="mt-12 px-6 mx-auto">
          <h2 className="text-xl font-bold text-[#103B63] mb-4">Shift History</h2>
          <div className="overflow-x-auto bg-white shadow rounded-lg">
            <table className="w-full table-auto text-sm shadow-sm">
              <thead className="bg-[#FAFAFB] sticky top-0 z-10">
                <tr className="text-left">
                  <th className="p-3 font-[800] text-lg text-[#153d64]">Shift ID</th>
                  <th className="p-3 font-[800] text-lg text-[#153d64]">Start Time</th>
                  <th className="p-3 font-[800] text-lg text-[#153d64]">End Time</th>
                  <th className="p-3 font-[800] text-lg text-[#153d64]">Combined Discrepancies</th>
                  <th className="p-3 font-[800] text-lg text-[#153d64]">Action</th>
                </tr>
              </thead>
              <tbody>
                {shiftData?.allShifts?.length > 0 ? (
                  shiftData.allShifts.map((shift, i) => (
                    <tr
                      key={shift.shiftId}
                      className={`transition-colors duration-200 hover:bg-[#FAFAFB] ${i % 2 === 1 ? "bg-[#FAFAFB]" : ""
                        } border-b`}
                    >
                      <td className="p-3 font-bold text-[#9095a1]">
                        {shift.shiftId.slice(0, 8)}********
                      </td>
                      <td className="p-3 font-bold text-[#9095a1]">{shift.startTime}</td>
                      <td className="p-3 font-bold text-[#9095a1]">{shift.endTime}</td>
                      <td
                        className={`p-3 font-[800] ${shift.discrepancyCount === 0 ? "text-green-600" : "text-red-500"
                          }`}
                      >
                        {shift.discrepancyCount || "None"}
                      </td>
                      <td
                        className="p-3 font-bold text-[#103B63] hover:underline cursor-pointer"
                        onClick={() => handleReportDiscrepancyHistory(shift.shiftId)}
                      >
                        View
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={5} className="p-3 text-gray-500 text-center">
                      No shift history found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>

            {/* Pagination Controls */}
            <div className="flex justify-center my-6 gap-2">
              <button
                className="p-2 border rounded cursor-pointer disabled:cursor-not-allowed"
                style={buttonBaseStyle}
                onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
                disabled={currentPage === 1}
              >
                <ChevronLeft size={16} className="text-gray-500" />
              </button>

              {pages.map((page, i) => (
                <button
                  key={i}
                  disabled={page === "..."}
                  className="p-2 w-10 h-10 rounded cursor-pointer disabled:cursor-default"
                  onClick={() => typeof page === "number" && setCurrentPage(page)}
                  style={page === currentPage ? activeButtonStyle : buttonBaseStyle}
                >
                  {page}
                </button>
              ))}

              <button
                className="p-2 border rounded cursor-pointer disabled:cursor-not-allowed"
                style={buttonBaseStyle}
                onClick={() => setCurrentPage((prev) => Math.min(totalPages, prev + 1))}
                disabled={currentPage === totalPages}
              >
                <ChevronRight size={16} className="text-gray-500" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Page;

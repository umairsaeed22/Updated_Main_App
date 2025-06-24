import React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { getPurchaseOrderDetails } from "../services/dashboardApi"; 


const statusStyles = {
  NEW: "text-gray-500 font-[800]",
  INPROGRESS: "text-yellow-600 font-[800]",
  COMPLETE: "text-green-600 font-[800]",
};

export default function GRNTable({ data, currentPage, setCurrentPage, totalCount }) {
  const navigate = useNavigate();  // Use useNavigate hook for navigation
  const itemsPerPage = 10;
  const totalPages = Math.ceil(totalCount / itemsPerPage);

  const generatePages = () => {
    const pages = [];
    if (totalPages <= 7) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      if (currentPage <= 4) {
        pages.push(1, 2, 3, 4, 5, "...", totalPages);
      } else if (currentPage >= totalPages - 3) {
        pages.push(1, "...", totalPages - 4, totalPages - 3, totalPages - 2, totalPages - 1, totalPages);
      } else {
        pages.push(1, "...", currentPage - 1, currentPage, currentPage + 1, "...", totalPages);
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

  const handleRowClick = async (row) => {
    try {
      const response = await getPurchaseOrderDetails(row.refDoc);
      if (response.success && response.data) {
        navigate("/mobile-serial-app/PO-details", {
          state: { poDetails: response.data }, // ✅ THIS is correct
        });
      } else {
        console.error("API error or no data found.");
        // Optionally handle UI error message here
      }
    } catch (error) {
      console.error("Error fetching PO details:", error);
    }
  };


  return (
    <div className="p-4 pt-0">
      <div className="overflow-x-auto shadow-md rounded-md">
        <div className="overflow-y-auto">
          <table className="w-full table-auto text-sm">
            <thead className="bg-[#FAFAFB] sticky top-0 z-10">
              <tr className="text-left cursor-pointer">
                <th className="p-3 font-[800] text-lg text-[#153d64]">Purchase Order</th>
                <th className="p-3 font-[800] text-lg text-[#153d64]">GRN REFERENCE</th>
                <th className="p-3 font-[800] text-lg text-[#153d64]">Created Date</th>
                <th className="p-3 font-[800] text-lg text-[#153d64]">Created By</th>
                <th className="p-3 font-[800] text-lg text-[#153d64]">Status</th>
              </tr>
            </thead>
            <tbody>
              {Array.isArray(data) && data.length > 0 ? (
                data.map((row, i) => (
                  <tr
                    key={i}
                    className={`cursor-pointer transition-colors duration-200 hover:bg-[#FAFAFB] ${i % 2 === 1 ? "bg-[#FAFAFB]" : ""
                      }`}
                    onClick={() => handleRowClick(row)} // Handle row click
                  >
                    <td className="p-3 font-bold text-[#9095a1]">{row.refDoc || "Not Available"}</td>
                    <td className="p-3 font-bold text-[#9095a1]">{row.inBoundNo || "Not Available"}</td>
                    <td className="p-3 font-medium text-[#9095a1]">{row.sapCreatedOn || "Not Available"}</td>
                    <td className="p-3 font-medium text-[#9095a1]">{row.sapCreatedBy || "Not Available"}</td>
                    <td className="p-3 flex items-center gap-3">
                      <span
                        className={`w-2 h-2 rounded-full ${statusStyles[row.status] || ""}`}
                        style={{
                          fontWeight: "bold",
                          display: "inline-block",
                          backgroundColor: "currentColor",
                        }}
                      ></span>
                      <span className={`${statusStyles[row.status] || ""} font-[800]`}>
                        {row.status}
                      </span>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="text-center text-[#9095a1] py-6 font-semibold">
                    No records available...
                  </td>
                </tr>
              )}
            </tbody>

          </table>
        </div>
      </div>

      <div className="flex justify-center mt-6 gap-2">
        <button
          className="p-2 border rounded bg-[#103B63] text-white cursor-pointer"
          style={buttonBaseStyle}
          onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
        >
          <ChevronLeft size={16} className="text-white" />
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
          className="p-2 border rounded bg-[#103B63] text-white cursor-pointer"
          style={buttonBaseStyle}
          onClick={() => setCurrentPage((prev) => Math.min(totalPages, prev + 1))}
        >
          <ChevronRight size={16} className="text-white" />
        </button>
      </div>
    </div>
  );
}

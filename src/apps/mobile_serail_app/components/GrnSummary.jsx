import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { CgPlayTrackNextO } from "react-icons/cg";
import { GrFormNextLink } from "react-icons/gr";
import { getUnverifiedSerialCount } from '../services/dashboardApi';
import useAuthStore from "../../../store/useAuthStore";

export default function GRNSummary({ summary, onStatusChange }) {
  const [selected, setSelected] = useState("NEW");
  const [unverifiedCount, setUnverifiedCount] = useState(0);
  const navigate = useNavigate();

  const { apps } = useAuthStore();

  // Get all module names from the first app entry
  const moduleNames = apps?.[0]?.module?.map((mod) => mod.moduleName) || [];

  const hasModule = (name) => moduleNames.includes(name);

  const handleAddNewClick = () => {
    navigate("/mobile-serial-app/add-new");
  };

  const handleEcommerceClick = () => {
    navigate("/mobile-serial-app/ecommerce-order");
  };

  useEffect(() => {
    const fetchUnverifiedCount = async () => {
      const result = await getUnverifiedSerialCount();
      if (result.success) {
        setUnverifiedCount(result.data.count || 0);
      } else {
        console.error('Failed to fetch unverified count:', result.message);
      }
    };

    fetchUnverifiedCount();
  }, []);

  const summaryData = [
    {
      title: "NEW",
      description: "List of new PO",
      count: summary?.new ?? 0
    },
    {
      title: "COMPLETE",
      description: "List of Completed PO",
      count: summary?.completed ?? 0
    },
    hasModule("ExceptionGRN-page") && {
      title: "Exception IMEI GRN Update",
      description: "Please 'Click' to update the pending GRN",
      count: summary?.inProgress ?? 0
    },
    // {
    //   title: "Verify Scanned IMEI with Vendor List",
    //   description: "Please 'Click' to update the pending GRN",
    //   count: unverifiedCount
    // },
    hasModule("reporting-page") && {
      title: "Reports",
      description: "Please 'Click' to perform the reporting",
    }
  ].filter(Boolean); // Remove false entries

  const handleTileClick = (title) => {
    if (title === "Exception IMEI GRN Update") {
      navigate("/mobile-serial-app/pending-grn");
    } else if (title === "Verify Scanned IMEI with Vendor List") {
      navigate("/mobile-serial-app/verify-serial");
    } else if (title === "Reports") {
      navigate("/mobile-serial-app/reporting");
    } else {
      setSelected(title);
      onStatusChange(title);
    }
  };

  useEffect(() => {
    onStatusChange(selected);
  }, []);

  return (
    <div className="grid grid-cols-4 gap-4 p-4">
      {summaryData.slice(0, 5).map((item, index) => {
        const isUpdateTile = item.title === "Exception IMEI GRN Update";
        const isVerifyTile = item.title === "Verify Scanned IMEI with Vendor List";
        const isReporting = item.title === "Reports";
        const isSelected = selected === item.title;

        let tileClasses = "";

        if (isSelected) {
          tileClasses = "bg-[#103B63] text-white border-dashed border-[#103B63] shadow-md";
        } else if (isVerifyTile) {
          tileClasses = "bg-[#efb034] text-white border-dashed border-white hover:shadow-md";
        } else if (isUpdateTile) {
          tileClasses = "bg-[#8aa386] text-white border-dashed border-white hover:shadow-md";
        } else if (isReporting) {
          tileClasses = "bg-[#67839C] text-white border-dashed border-white shadow-md";
        } else {
          tileClasses = "bg-white text-black border-dashed border-[#103B63] hover:bg-[#f0f4f8] shadow-md";
        }

        return (
          <button
            key={index}
            onClick={() => handleTileClick(item.title)}
            className={`rounded-xl p-4 border-2 text-left transition-colors duration-200 ${tileClasses} cursor-pointer relative`}
          >
            <h3 className="text-xl font-bold">{item.title}</h3>
            <p className={`text-sm font-semibold ${(isUpdateTile || isVerifyTile || isSelected || isReporting) ? 'text-white' : 'text-[#978C9D]'}`}>
              {item.description}
            </p>
            {item.count !== undefined && (
              <p className="text-3xl font-bold mt-2">{item.count}</p>
            )}

            {(isUpdateTile || isVerifyTile) && (
              <CgPlayTrackNextO className="absolute bottom-3 right-3 text-white text-4xl" />
            )}
          </button>
        );
      })}

      <div></div>

      {/* Footer actions */}
      <div className="col-span-7 flex justify-between mt-4">
        {hasModule("Ecommerce-page") && (
          <div className="flex items-center">
            <button
              className="w-full sm:w-auto font-[800] text-[#103B63] cursor-pointer text-right"
              onClick={handleEcommerceClick}
            >
              Ecommerce Order
            </button>
            <GrFormNextLink />
          </div>
        )}
        {hasModule("addNewSerialPage-exception") && (
          <button
            className="w-full sm:w-auto font-[800] text-[#103B63] cursor-pointer text-right"
            onClick={handleAddNewClick}
          >
            + Add New Exception Item
          </button>
        )}
      </div>
    </div>
  );
}

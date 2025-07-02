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

  const moduleNames = apps?.[0]?.module?.map((mod) => mod.moduleName) || [];
  const hasModule = (name) => moduleNames.includes(name);

  const handleAddNewClick = () => navigate("/mobile-serial-app/add-new");
  const handleEcommerceClick = () => navigate("/mobile-serial-app/ecommerce-order");

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
    hasModule("reporting-page") && {
      title: "Reports",
      description: "Please 'Click' to perform the reporting",
    }
  ].filter(Boolean);

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
        const isNewTile = item.title === "NEW";
        const isCompleteTile = item.title === "COMPLETE";
        const isSelected = selected === item.title;

        let tileClasses = "";
        let customStyle = {};

        if (isSelected && !isNewTile && !isCompleteTile) {
          tileClasses = "text-white border-dashed border-[#103B63] shadow-md";
          customStyle = { backgroundColor: '#103B63' };
        } else if (isVerifyTile) {
          tileClasses = "text-white border-dashed border-white hover:shadow-md";
          customStyle = { backgroundColor: '#efb034' };
        } else if (isUpdateTile) {
          tileClasses = "text-white border-dashed border-white shadow-md hover:shadow-lg";
          customStyle = {
            backgroundColor: '#f29e03',
            backgroundImage: `url(data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='40' height='40' viewBox='0 0 100 100'%3E%3Crect x='0' y='0' width='46' height='46' fill-opacity='0.6' fill='%23ffa61d'/%3E%3C/svg%3E"")`  
            ,
            backgroundAttachment: 'fixed',
            backgroundSize: 'cover'
           };
        } else if (isReporting) {
          tileClasses = "text-white border-dashed border-white shadow-md hover:shadow-lg";
          customStyle = {
            backgroundcolor: '#330000',
            backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100%25' height='100%25' viewBox='0 0 800 400'%3E%3Cdefs%3E%3CradialGradient id='a' cx='396' cy='281' r='514' gradientUnits='userSpaceOnUse'%3E%3Cstop offset='0' stop-color='%23D18'/%3E%3Cstop offset='1' stop-color='%23330000'/%3E%3C/radialGradient%3E%3ClinearGradient id='b' gradientUnits='userSpaceOnUse' x1='400' y1='148' x2='400' y2='333'%3E%3Cstop offset='0' stop-color='%23FA3' stop-opacity='0'/%3E%3Cstop offset='1' stop-color='%23FA3' stop-opacity='0.5'/%3E%3C/linearGradient%3E%3C/defs%3E%3Crect fill='url(%23a)' width='800' height='400'/%3E%3Cg fill-opacity='0.4'%3E%3Ccircle fill='url(%23b)' cx='267.5' cy='61' r='300'/%3E%3Ccircle fill='url(%23b)' cx='532.5' cy='61' r='300'/%3E%3Ccircle fill='url(%23b)' cx='400' cy='30' r='300'/%3E%3C/g%3E%3C/svg%3E")
            `,
            backgroundAttachment: 'fixed',
            backgroundSize: 'cover'
        };

        } else if (isNewTile) {
          tileClasses = "text-white border-dashed border-[#fff] shadow-md hover:shadow-lg";
          customStyle = {
            backgroundColor: '#113311',
            backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='250' height='250' viewBox='0 0 20 20'%3E%3Cg %3E%3Cpolygon fill='%23242' points='20 10 10 0 0 0 20 20'/%3E%3Cpolygon fill='%23242' points='0 10 0 20 10 20'/%3E%3C/g%3E%3C/svg%3E")`
          };
        } else if (isCompleteTile) {
          tileClasses = "text-white border-dashed border-[#fff] shadow-md hover:shadow-lg";
          customStyle = {
            backgroundColor: '#ff0000',
            backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 1000 1000'%3E%3Cdefs%3E%3CradialGradient id='a' cx='500' cy='500' r='60%25' gradientUnits='userSpaceOnUse'%3E%3Cstop offset='0' stop-color='%23ff0000'/%3E%3Cstop offset='1' stop-color='%23900'/%3E%3C/radialGradient%3E%3CradialGradient id='b' cx='500' cy='500' r='70%25' gradientUnits='userSpaceOnUse'%3E%3Cstop offset='0' stop-color='%23FF0' stop-opacity='1'/%3E%3Cstop offset='1' stop-color='%23FF0' stop-opacity='0'/%3E%3C/radialGradient%3E%3C/defs%3E%3Crect fill='url(%23a)' width='1000' height='1000'/%3E%3Cg fill='none' stroke='%23F40' stroke-width='2' stroke-miterlimit='10' stroke-opacity='.5'%3E%3Ccircle cx='500' cy='500' r='725'/%3E%3Ccircle cx='500' cy='500' r='700'/%3E%3Ccircle cx='500' cy='500' r='675'/%3E%3Ccircle cx='500' cy='500' r='650'/%3E%3Ccircle cx='500' cy='500' r='625'/%3E%3Ccircle cx='500' cy='500' r='600'/%3E%3Ccircle cx='500' cy='500' r='575'/%3E%3Ccircle cx='500' cy='500' r='550'/%3E%3Ccircle cx='500' cy='500' r='525'/%3E%3Ccircle cx='500' cy='500' r='500'/%3E%3Ccircle cx='500' cy='500' r='475'/%3E%3Ccircle cx='500' cy='500' r='450'/%3E%3Ccircle cx='500' cy='500' r='425'/%3E%3Ccircle cx='500' cy='500' r='400'/%3E%3Ccircle cx='500' cy='500' r='375'/%3E%3Ccircle cx='500' cy='500' r='350'/%3E%3Ccircle cx='500' cy='500' r='325'/%3E%3Ccircle cx='500' cy='500' r='300'/%3E%3Ccircle cx='500' cy='500' r='275'/%3E%3Ccircle cx='500' cy='500' r='250'/%3E%3Ccircle cx='500' cy='500' r='225'/%3E%3Ccircle cx='500' cy='500' r='200'/%3E%3Ccircle cx='500' cy='500' r='175'/%3E%3Ccircle cx='500' cy='500' r='150'/%3E%3Ccircle cx='500' cy='500' r='125'/%3E%3Ccircle cx='500' cy='500' r='100'/%3E%3Ccircle cx='500' cy='500' r='75'/%3E%3Ccircle cx='500' cy='500' r='50'/%3E%3Ccircle cx='500' cy='500' r='25'/%3E%3C/g%3E%3Crect fill-opacity='.5' fill='url(%23b)' width='1000' height='1000'/%3E%3C/svg%3E")`,
            backgroundAttachment: 'fixed',
            backgroundSize: 'cover'
          };
        } else {
          tileClasses = "bg-white text-black border-dashed border-[#103B63] hover:bg-[#f0f4f8] shadow-md";
        }

        return (
          <button
            key={index}
            onClick={() => handleTileClick(item.title)}
            className={`rounded-xl p-4 border-2 text-left transition-colors duration-200 ${tileClasses} cursor-pointer relative`}
            style={customStyle}
          >
            <h3 className="text-xl font-bold">{item.title}</h3>
            <p className={`text-sm font-semibold ${tileClasses.includes("text-white") ? "text-white" : "text-[#978C9D]"}`}>
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


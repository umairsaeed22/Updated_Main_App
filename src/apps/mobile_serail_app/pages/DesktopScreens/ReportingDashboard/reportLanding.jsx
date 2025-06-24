import React, { useEffect } from "react";
import { useNavigate } from 'react-router-dom';
import Header from "../../../components/Headers";
import { gsap } from 'gsap';
import useAuthStore from "../../../../../store/useAuthStore";

const ReportingOverview = () => {
  const navigate = useNavigate();
  const { apps } = useAuthStore();

  // Extract module names
  const moduleNames = apps?.[0]?.module?.map(mod => mod.moduleName) || [];

  const hasModule = (name) => moduleNames.includes(name);

  useEffect(() => {
    gsap.fromTo(
      ".content",
      { y: 50, opacity: 0 },
      { y: 0, opacity: 1, duration: 1, ease: "power4.out" }
    );
  }, []);

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
        <h1 className="text-2xl font-[800] text-[#000] mb-1">Reporting</h1>
        <p className="text-sm text-gray-500 mb-6">
          Below are the features you can perform in reporting
        </p>

        <div className="max-w-screen-md">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">

            {/* Card 1 — Order Reports Hub */}
            {hasModule("Ecommerce-page") && (
              <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-200 hover:shadow-xl transition cursor-pointer">
                <h2 className="text-xl font-bold text-[#103B63] mb-2">Order Reports Hub</h2>
                <p className="text-gray-500 mb-4 text-sm">
                  Grab instant reports for Sales & Return Orders — straight from Ecommerce or Retail Pro!
                </p>
                <button
                  onClick={() => navigate('/mobile-serial-app/download-report')}
                  className="px-4 py-2 text-white rounded bg-[#103B63] transition cursor-pointer hover:bg-[#0d2e4b]"
                >
                  View Order Reports Now
                </button>
              </div>
            )}

            {/* Card 2 — Inventory Records */}
            {hasModule("shift") && (
              <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-200 hover:shadow-xl transition cursor-pointer">
                <h2 className="text-xl font-bold text-[#103B63] mb-2">Inventory Records</h2>
                <p className="text-gray-500 text-sm mb-4">
                  Dive into detailed inventory reports and track shift insights effortlessly.
                </p>
                <button
                  onClick={() => navigate('/mobile-serial-app/reporting-dashboard')}
                  className="px-4 py-2 text-white rounded bg-[#103B63] transition cursor-pointer hover:bg-[#0d2e4b]"
                >
                  Explore Records Now
                </button>
              </div>
            )}

          </div>
        </div>
      </div>
    </div>
  );
};

export default ReportingOverview;

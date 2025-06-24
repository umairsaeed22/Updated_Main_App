import React, { useEffect, useState } from 'react';
import OtherDepartmentOverview from '../otherDepartmentsComponents.jsx/OtherDepartmentOverview';
import OtherDepartmenTransactionsTrend from '../otherDepartmentsComponents.jsx/OtherDepartmenTransactionsTrend';
import OtherDepartmentTransactionsData from '../otherDepartmentsComponents.jsx/OtherDepartmentTransactionsData';
import useSalespersonDataStore from '../../../store/useSalespersonDataStore';

const OtherDepartmentsData = () => {
  const { salespersonData } = useSalespersonDataStore();

  const [storedOtherDepartmentCode, setStoredOtherDepartmentCode] =
    useState(null);

  useEffect(() => {
    if (salespersonData?.periods?.[0]?.departments?.length) {
      const firstOtherDepartment =
        salespersonData.periods[0].departments
          .filter((department) => department.isMainDepartment === false)
          .map((c) => c.code)?.[0] || null;

      setStoredOtherDepartmentCode(firstOtherDepartment);
    }
  }, [salespersonData]);

  const handleStoreOtherDepartmentCode = (code) => {
    setStoredOtherDepartmentCode(code || null);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-10 gap-6 lg:p-8 p-4">
      {/* Department Overview Card */}
      <div className="lg:col-span-5 col-span-1 h-[320px] bg-white rounded-xl border border-incentiveBorder overflow-hidden ">
        <OtherDepartmentOverview
          handleStoreOtherDepartmentCode={handleStoreOtherDepartmentCode}
          storedCode={storedOtherDepartmentCode}
        />
      </div>

      {/* Transactions Trend Bar Chart */}
      <div className="lg:col-span-5 col-span-1 h-[320px] bg-white rounded-xl border border-incentiveBorder overflow-hidden ">
        <OtherDepartmenTransactionsTrend
          storedCode={storedOtherDepartmentCode}
        />
      </div>

      {/* Transactions Table */}
      <div className="lg:col-span-10 col-span-1 min-h-[500px] bg-white rounded-xl border border-incentiveBorder overflow-hidden">
        <OtherDepartmentTransactionsData
          storedCode={storedOtherDepartmentCode}
        />
      </div>
    </div>
  );
};

export default OtherDepartmentsData;

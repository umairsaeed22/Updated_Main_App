import React from 'react';
import CurrentTargetData from '../mainDepartmentComponents/CurrentTargetData';
import TransactionsTrend from '../mainDepartmentComponents/TransactionsTrend';
import TargetProgress from '../mainDepartmentComponents/TargetProgress';
import TransactionsData from '../mainDepartmentComponents/TransactionsData';
import OtherDepartmentsTotalSales from '../mainDepartmentComponents/OtherDepartmentsTotalSales';

const MainDepartmentData = () => {
  return (
    <div className="w-full grid grid-cols-12 gap-6  lg:p-8 p-4  ">
      {/**First */}
      <div className="xl:col-span-7 col-span-12 md:order-1 order-2">
        <div className="grid sm:grid-cols-12 grid-cols-1  gap-6">
          <div className="sm:col-span-6 md:block hidden  col-span-1 h-[180px] bg-white rounded-xl border border-incentiveBorder overflow-hidden">
            <CurrentTargetData />
          </div>
          <div className="sm:col-span-6 md:block hidden  col-span-1 h-[180px] bg-white rounded-xl border border-incentiveBorder overflow-hidden">
            <OtherDepartmentsTotalSales />
          </div>
          <div className="sm:col-span-12 col-span-1 h-[320px] bg-white rounded-xl border border-incentiveBorder overflow-hidden">
            <TransactionsTrend />
          </div>
        </div>
      </div>
      {/**Second */}
      <div className="xl:col-span-5 col-span-12 md:order-2 order-1">
        <div className="bg-white rounded-xl border border-incentiveBorder xl:h-[525px] h-fit overflow-hidden">
          <TargetProgress />
        </div>
      </div>
      {/**Third */}
      <div className="col-span-12 order-3">
        <div className="bg-white rounded-xl border border-incentiveBorder h-[540px] overflow-hidden ">
          <TransactionsData />
        </div>
      </div>
    </div>
  );
};

export default MainDepartmentData;

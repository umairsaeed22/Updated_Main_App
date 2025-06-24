import React from 'react';
import { useTranslation } from 'react-i18next';
import useSalespersonDataStore from '../../../store/useSalespersonDataStore';
import TransactionTrendBarchart from '../shared/TransactionTrendBarchart';

const OtherDepartmenTransactionsTrend = ({ storedCode }) => {
  const { t } = useTranslation('salespersonDashboard');
  const { salespersonData } = useSalespersonDataStore();

  const otherDepartmentDetails = salespersonData?.periods[0]?.departments
    ?.filter((department) => {
      return department.isMainDepartment === false;
    })
    .find((dept) => {
      return dept?.code === storedCode;
    });

  return (
    <div className="w-full h-full flex flex-col  ">
      {/**Title */}

      <div className="w-full mt-6 px-6">
        <h1 className="text-incentiveTextPrimary text-lg font-outfit font-medium tracking-tight   ">
          {t('otherDepartmenTransactionsTrend.title')}
        </h1>
      </div>

      {/**Chart */}
      <div className="flex-1 mt-2  overflow-x-auto overflow-y-hidden sm:px-4 px-2.5   ">
        {otherDepartmentDetails ? (
          <TransactionTrendBarchart
            transactions={otherDepartmentDetails?.transactions}
          />
        ) : (
          <div className="w-full h-full flex justify-center items-center md:text-sm text-[0.810rem] text-center text-incentiveTextSecondary  leading-relaxed">
            {t('transactionsTable.noTransactionsMessage')}
          </div>
        )}
      </div>
    </div>
  );
};

export default OtherDepartmenTransactionsTrend;

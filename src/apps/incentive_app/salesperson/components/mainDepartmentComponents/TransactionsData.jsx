import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import TransactionsTable from '../shared/TransactionsTable';
import useSalespersonDataStore from '../../../store/useSalespersonDataStore';
import ItemsBar from '../shared/ItemsBar';
import useDropdownStore from '../../../store/useDropdownStore';

const TransactionsData = () => {
  const [storeTransactionCode, setStoreTransactionCode] = useState(null);
  const { t } = useTranslation('salespersonDashboard');

  const { salespersonData } = useSalespersonDataStore();
  const { setOpenDropDown } = useDropdownStore();

  const mainDepartmentData = salespersonData?.periods[0]?.departments?.find(
    (department) => {
      return department.isMainDepartment === true;
    },
  );

  const handleStoreTransactionCode = (code) => {
    setStoreTransactionCode(code || null);
  };

  const handleCloseItemsBar = () => {
    setStoreTransactionCode(null);
    setOpenDropDown(null);
  };

  // A function that returns the itemsList by transaction code that passed from the TransactionsTable
  const availableItemsByTransactionCode =
    mainDepartmentData?.transactions?.find((transaction) => {
      return transaction.transactionCode === storeTransactionCode;
    });

  return (
    <div className="w-full h-full flex flex-col p-6">
      <h2 className="text-lg font-outfit font-medium text-incentiveTextPrimary mb-4">
        {t('transactionsTable.title')}
      </h2>
      {mainDepartmentData ? (
        <TransactionsTable
          setStoreTransactionCode={handleStoreTransactionCode}
          transactions={mainDepartmentData?.transactions}
        />
      ) : (
        <div className="w-full h-full flex justify-center items-center md:text-sm text-[0.810rem] text-center text-incentiveTextSecondary md:mt-4 mt-2 leading-relaxed">
          {t('transactionsTable.noTransactionsMessage')}
        </div>
      )}
      <ItemsBar
        transactionCode={storeTransactionCode}
        onClose={handleCloseItemsBar}
        itemsList={availableItemsByTransactionCode?.items}
      />
    </div>
  );
};

export default TransactionsData;

import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useLanguage } from '../../../../../context/LanguageContext';
import { GoSearch } from 'react-icons/go';

import moment from 'moment/moment';
import useDropdownStore from '../../../store/useDropdownStore';
import { currency } from '../../constants';

const TransactionsTable = ({ transactions, setStoreTransactionCode }) => {
  const { t } = useTranslation('salespersonDashboard');
  const { lang } = useLanguage();
  const { setOpenDropDown } = useDropdownStore();
  const [selectedDay, setSelectedDay] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1); // Pagination
  const [rowsPerPage, setRowsPerPage] = useState(4);

  const availableTransactionsDates = () => {
    const getTransactionsDates = transactions?.map((transaction) => {
      return transaction.date;
    });

    return [...new Set(getTransactionsDates)];
  };

  const transactionsDates = availableTransactionsDates();

  const displayedTransactions = transactions?.filter((transaction) => {
    if (searchQuery) {
      return transaction?.transactionCode
        ?.toLowerCase()
        .includes(searchQuery.toLowerCase());
    }
    if (selectedDay) {
      return moment(transaction?.date, 'DD-MM-YYYY').isSame(
        moment(selectedDay, 'DD-MM-YYYY'),
        'day',
      );
    }

    return true;
  });

  //Pagination logic

  const totalPages = Math.ceil(displayedTransactions?.length / rowsPerPage);
  const paginatedTransactions = displayedTransactions?.slice(
    (currentPage - 1) * rowsPerPage,
    currentPage * rowsPerPage,
  );
  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage((prevPage) => prevPage + 1);
    }
  };

  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage((prevPage) => prevPage - 1);
    }
  };

  return (
    <>
      {/**Filters */}
      <div className="w-full flex sm:flex-row flex-col sm:gap-4 gap-2 mt-2 ">
        {/**Search bar */}

        <div className="sm:w-80 w-full h-9 rounded-lg border border-incentiveBorder relative flex items-center ">
          <input
            type="text"
            name="searchQuery"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={t('transactionsTable.searchPlaceholder')}
            className="w-full h-full text-[0.830rem] text-incentiveTextPrimary placeholder:text-incentiveTextPlaceholder px-8 outline-0"
          />
          <GoSearch
            size={15}
            className={` text-incentiveTextSecondary absolute ${
              lang === 'en' ? 'left-2.5' : 'right-2.5'
            }`}
          />
        </div>

        {/**Day picker */}
        <select
          onChange={(e) => setSelectedDay(e.target.value)}
          className="sm:w-52 w-full h-9 rounded-lg border border-incentiveBorder  text-[0.830rem] text-incentiveTextPrimary"
          name="selectedDay"
        >
          <option value="">{lang === 'en' ? 'All days' : 'جميع الأيام'}</option>
          {transactionsDates?.map((date, index) => (
            <option key={index} value={date}>
              {date}
            </option>
          ))}
        </select>
      </div>

      {/**Table */}
      <div className="relative overflow-x-auto mt-4 ">
        <table className="w-full text-sm text-left rtl:text-right text-gray-500 table-fixed">
          <thead className="text-xs text-gray-700 uppercase bg-gray-50 px-2  ">
            <tr className="font-outfit">
              <th className="w-42 px-2 py-3 whitespace-nowrap text-start">
                {t('transactionsTable.tableHeaderCode')}
              </th>
              <th className="w-32 py-3 whitespace-nowrap">
                {t('transactionsTable.tableHeaderDate')}
              </th>
              <th className="w-24 py-3 whitespace-nowrap">
                {t('transactionsTable.tableHeaderTime')}
              </th>
              <th className="w-24 py-3 whitespace-nowrap">
                {t('transactionsTable.tableHeaderQty')}
              </th>
              <th className="w-32 py-3 whitespace-nowrap">
                {t('transactionsTable.tableHeaderTotalAmount')}
              </th>
              <th className="w-40 py-3 whitespace-nowrap text-end ">
                {t('transactionsTable.tableHeaderAction')}
              </th>
            </tr>
          </thead>

          <tbody>
            {paginatedTransactions?.map((transaction) => (
              <tr
                key={transaction?.transactionCode}
                className="bg-white border-b border-incentiveBorder  hover:bg-gray-50 font-outfit px-2"
              >
                <td className="w-32 py-4 font-medium text-gray-900 whitespace-nowrap text-start">
                  {transaction?.transactionCode}
                </td>
                <td className="w-32 py-4 whitespace-nowrap">
                  {moment(transaction?.date, 'DD-MM-YYYY').format('DD-MM-YYYY')}
                </td>
                <td className="w-24 py-4 whitespace-nowrap">
                  {transaction?.time}
                </td>
                <td className="w-24 py-4 whitespace-nowrap">
                  {transaction?.quantity}
                </td>
                <td className="w-32 py-4 whitespace-nowrap">
                  {transaction?.totalAmount.toLocaleString()} {currency[lang]}
                </td>
                <td className="w-40 py-4 whitespace-nowrap text-end ">
                  <button
                    onClick={() => {
                      setStoreTransactionCode(transaction?.transactionCode);
                      setOpenDropDown('itemsBar');
                    }}
                    className="font-medium text-blue-600 rounded-lg border border-blue-600 py-1 px-3 hover:bg-blue-600 hover:text-white cursor-pointer"
                  >
                    {lang === 'en' ? 'Items list' : 'قائمة العناصر'}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {/* Pagination */}
      <nav
        className="flex items-center md:justify-end justify-center pt-4 px-4 py-4 mt-auto "
        aria-label="Table navigation"
      >
        <ul className="inline-flex -space-x-px rtl:space-x-reverse text-sm h-8">
          <li>
            <button
              onClick={handlePrevPage}
              disabled={currentPage === 1}
              className="flex items-center justify-center px-3 h-8 text-gray-500 bg-white border border-gray-300 rounded-s-lg hover:bg-gray-100 hover:text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {lang === 'en' ? 'Previous' : 'ألسابق'}
            </button>
          </li>
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
            <button
              key={page}
              onClick={() => setCurrentPage(page)}
              className={`flex items-center justify-center px-3 h-8 border border-gray-300 ${
                page === currentPage
                  ? 'bg-blue-50 text-blue-600'
                  : 'bg-white text-gray-500'
              } hover:bg-gray-100 hover:text-blue-700`}
            >
              {page}
            </button>
          ))}
          <li>
            <button
              onClick={handleNextPage}
              disabled={currentPage === totalPages}
              className="flex items-center justify-center px-3 h-8 text-gray-500 bg-white border border-gray-300 rounded-e-lg hover:bg-gray-100 hover:text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {lang === 'en' ? 'Next' : 'ألتالي'}
            </button>
          </li>
        </ul>
      </nav>
    </>
  );
};

export default TransactionsTable;

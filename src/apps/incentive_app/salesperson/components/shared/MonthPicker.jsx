import React, { useState } from 'react';
import useDropdownStore from '../../../store/useDropdownStore';
import { useLanguage } from '../../../../../context/LanguageContext';
import { MdKeyboardArrowLeft } from 'react-icons/md';
import { MdKeyboardArrowRight } from 'react-icons/md';

import useDateStore from '../../../store/useDateStore';

const months = [
  'Jan',
  'Feb',
  'Mar',
  'Apr',
  'May',
  'Jun',
  'Jul',
  'Aug',
  'Sep',
  'Oct',
  'Nov',
  'Dec',
];
const MonthPicker = () => {
  const { openDropDown, setOpenDropDown } = useDropdownStore();
  const { lang } = useLanguage();
  const { selectedMonthYear, setSelectedMonthYear } = useDateStore();

  const [selectedMonth, selectedYear] = selectedMonthYear
    .split('-')
    .map((v) => parseInt(v));

  const [year, setYear] = useState(selectedYear);

  if (openDropDown !== 'monthPicker') return null;
  return (
    <div
      className={`absolute w-full max-w-xs h-fit flex flex-col items-center bg-white rounded-lg border border-incentiveBorder shadow-md shadow-gray-200 z-50 lg:top-16 top-32 ${
        lang === 'en' ? 'right-4' : 'left-4'
      }`}
    >
      {/* Year Selector */}
      <div className="w-full flex items-center justify-between py-4 px-8">
        <button
          className="text-incentiveTextPrimary"
          onClick={() => setYear((prev) => prev - 1)}
        >
          <MdKeyboardArrowLeft
            size={24}
            className={`${lang === 'ar' && 'rotate-180'}`}
          />
        </button>
        <h1 className="text-lg font-poppins text-incentiveTextPrimary font-semibold">
          {year}
        </h1>
        <button
          className="text-incentiveTextPrimary"
          onClick={() => setYear((prev) => prev + 1)}
        >
          <MdKeyboardArrowRight
            size={24}
            className={`${lang === 'ar' && 'rotate-180'}`}
          />
        </button>
      </div>

      {/* Month Grid */}
      <div className="w-full grid grid-cols-3 p-2 gap-0.5 pb-2">
        {months.map((month, index) => {
          const isSelected =
            selectedMonth === index + 1 && selectedYear === year;
          return (
            <button
              key={index}
              onClick={() => {
                setSelectedMonthYear(index + 1, year);
                setOpenDropDown(null);
              }}
              className={`text-sm font-outfit font-semibold p-2 rounded-lg transition-all duration-200 cursor-pointer
                ${
                  isSelected
                    ? 'bg-blue-100 text-blue-600'
                    : 'text-incentiveTextSecondary hover:bg-gray-100 hover:text-incentiveTextPrimary'
                }`}
            >
              {month}
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default MonthPicker;

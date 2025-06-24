import React from 'react';
import { useLanguage } from '../context/LanguageContext';

const currentTarget = 8000;
const totalTarget = 12000;
const SalespersonIncentiveCard = () => {
  const { lang } = useLanguage();
  const progressBarValue = Math.round((currentTarget / totalTarget) * 100);

  return (
    <div className="w-full h-full flex flex-col p-4 ">
      {/**Current month target */}
      <div className="w-full flex flex-col gap-1">
        <p className="text-sm text-secondary-text font-normal sm:self-end">
          For April 2025
        </p>
        {/**Target values */}
        <div className="w-full flex items-center justify-between">
          <h1 className="text-primary-text text-lg font-semibold tracking-wide">
            {currentTarget.toLocaleString()}SAR{' '}
            <span className="text-sm text-secondary-text font-normal">
              / {totalTarget.toLocaleString()}SAR
            </span>
          </h1>
        </div>
        {/**Progress bar */}
        <div className="w-full h-2 rounded-3xl bg-gray-200">
          <div
            style={{ width: `${progressBarValue}%` }}
            className="bg-indigo-600 rounded-3xl h-full"
          ></div>
        </div>
      </div>
      {/**Last transaction */}
      <div className="flex-1 bg-gray-50 mt-6 rounded-lg p-4 flex flex-col">
        {/**Transaction Date */}
        <div className="flex sm:flex-row flex-col items-center sm:justify-between">
          <p className="text-sm text-primary-text">
            {lang === 'en' ? 'Last transaction' : 'آخر عملية'}
          </p>
          <p className="text-sm text-secondary-text">Apr 9, 2025 · 3:43 PM</p>
        </div>
        {/**Article and amount */}
        <div className="flex items-center justify-between mt-8">
          <p className="text-sm text-secondary-text">#TXN-053-451</p>
          <p className="text-sm text-indigo-600 font-semibold">3,000SAR</p>
        </div>
      </div>
    </div>
  );
};

export default SalespersonIncentiveCard;

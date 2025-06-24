import React, { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useLanguage } from '../../../../../context/LanguageContext';
import { currency } from '../../constants';
import useSalespersonDataStore from '../../../store/useSalespersonDataStore';
import { MdOutlineKeyboardArrowRight } from 'react-icons/md';
import useLayoutStore from '../../../store/useLayoutStore';

const OtherDepartmentsTotalSales = () => {
  const { salespersonData } = useSalespersonDataStore();
  const { t } = useTranslation('salespersonDashboard');
  const { lang } = useLanguage();
  const { isOtherDepartment, setIsOtherDepartment } = useLayoutStore();

  const otherDepratmentData = salespersonData?.periods[0]?.departments?.filter(
    (department) => {
      return department.isMainDepartment === false;
    },
  );
  const otherDepartmentsTotalSales = useMemo(() => {
    if (!otherDepratmentData?.length) return 0;

    return otherDepratmentData.reduce((acc, department) => {
      return acc + (department?.currentTotalSales || 0);
    }, 0);
  }, [otherDepratmentData]);

  return (
    <div className="w-full h-full flex flex-col p-5">
      {/**Title and navigation */}
      <div className="w-full flex items-center justify-between">
        <p className="text-[0.8rem]  rounded-full w-fit py-1 px-3 bg-amber-100 text-amber-800">
          {t('otherDepartmentsTotalSales.subTitle')}
        </p>
        <button
          onClick={() => setIsOtherDepartment(!isOtherDepartment)}
          className="text-sm text-gray-600 hover:text-gray-700 cursor-pointer flex items-center"
        >
          {lang === 'en' ? 'more' : 'ألمزيد'}
          <MdOutlineKeyboardArrowRight
            size={16}
            className={`${lang === 'ar' && 'rotate-180'}`}
          />
        </button>
      </div>

      {/**Target Details */}
      <div className="w-full mt-auto flex flex-col gap-1 p-1">
        {/**Title */}
        <p className="text-[0.840rem] text-incentiveTextSecondary w-full border-b border-incentiveBorder pb-1">
          {t('otherDepartmentsTotalSales.title')}
        </p>

        {/* *Target amount */}
        <div className="flex items-center justify-between mt-3">
          {otherDepartmentsTotalSales ? (
            <h1 className="font-poppins text-amber-600 text-2xl font-bold">
              {otherDepartmentsTotalSales.toLocaleString()}{' '}
              <span className="text-sm text-incentiveTextSecondary font-normal">
                / {currency[lang]}
              </span>
            </h1>
          ) : (
            <h1 className="font-poppins text-amber-600 text-sm font-bold">
              {t('otherDepartmentsTotalSales.fallbackMessage')}{' '}
            </h1>
          )}
          <p className="text-[0.8rem]  rounded-full w-fit py-1 px-3 bg-gray-200 text-gray-600">
            {lang === 'en' ? 'Total sales' : 'ألمبيعات الكلية'}
          </p>
        </div>
      </div>
    </div>
  );
};

export default OtherDepartmentsTotalSales;

import React from 'react';
import { useTranslation } from 'react-i18next';
import { useLanguage } from '../../../../../context/LanguageContext';
import { currency } from '../../constants';
import useSalespersonDataStore from '../../../store/useSalespersonDataStore';

const CurrentTargetData = () => {
  const { salespersonData } = useSalespersonDataStore();
  const { t } = useTranslation('salespersonDashboard');
  const { lang } = useLanguage();

  const mainDepartmentData = salespersonData?.periods[0]?.departments?.find(
    (department) => department.isMainDepartment === true,
  );

  return (
    <div className="w-full h-full flex flex-col p-5">
      {/**Target Details */}
      {/**Title */}
      <p className="text-[0.8rem]  rounded-full w-fit py-1 px-3 bg-blue-100 text-blue-800">
        {t('currentTarget.title')}
      </p>
      <div className="w-full mt-auto flex flex-col gap-6 p-1">
        {/**Sales and Target Numbers */}
        <div className="w-full flex flex-col gap-2">
          {/** Current Total Sales */}
          <div className="flex items-center justify-between border-b border-incentiveBorder pb-2">
            <h1 className="font-poppins text-incentiveTextPrimary text-2xl font-bold">
              {mainDepartmentData?.currentTotalSales.toLocaleString() || 0}{' '}
              <span className="text-sm text-incentiveTextSecondary font-normal">
                / {currency[lang]}
              </span>
            </h1>

            <p className="text-[0.8rem] rounded-full w-fit py-1 px-3 bg-green-100 text-green-900">
              {t('currentTarget.subTitle')}
            </p>
          </div>

          {/** Total Target */}
          <div className="flex items-center justify-between">
            <h1 className="font-poppins text-blue-700 text-2xl font-bold">
              {mainDepartmentData?.totalTarget.toLocaleString() || 0}{' '}
              <span className="text-sm text-incentiveTextSecondary font-normal">
                / {currency[lang]}
              </span>
            </h1>

            <p className="text-[0.8rem] rounded-full w-fit py-1 px-3 bg-blue-100 text-blue-800">
              {/* You will later add proper translation here */}
              {t('currentTarget.totalSubTitle')}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CurrentTargetData;

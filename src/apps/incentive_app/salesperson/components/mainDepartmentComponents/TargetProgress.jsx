import React, { useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useLanguage } from '../../../../../context/LanguageContext';
import TargetProgressChart from './TargetProgressChart';
import { currency } from '../../constants';
import useSalespersonDataStore from '../../../store/useSalespersonDataStore';
import useDropdownStore from '../../../store/useDropdownStore';
import CommissionPopUp from './CommissionPopUp';
import Confetti from 'react-confetti';
import useWindowSize from 'react-use/lib/useWindowSize';

const TargetProgress = () => {
  const { t } = useTranslation('salespersonDashboard');
  const { lang } = useLanguage();
  const { salespersonData } = useSalespersonDataStore();

  const { setOpenDropDown } = useDropdownStore();

  const { width, height } = useWindowSize();

  const [showCelebration, setShowCelebration] = useState(false);

  const mainDepartmentData = salespersonData?.periods[0]?.departments?.find(
    (department) => {
      return department.isMainDepartment === true;
    },
  );

  const otherDepratmentData = salespersonData?.periods[0]?.departments?.filter(
    (department) => {
      return department.isMainDepartment === false;
    },
  );

  const remainingAmount = useMemo(() => {
    return (
      mainDepartmentData?.totalTarget - mainDepartmentData?.currentTotalSales
    );
  }, [mainDepartmentData, salespersonData]);

  const otherDepartmentsTotalSales = useMemo(() => {
    if (!otherDepratmentData?.length) return 0;

    return otherDepratmentData.reduce((acc, department) => {
      return acc + (department?.currentTotalSales || 0);
    }, 0);
  }, [otherDepratmentData]);

  const targetProgress = useMemo(() => {
    const currentSales = mainDepartmentData?.currentTotalSales || 0;

    const totalSales =
      currentSales >= mainDepartmentData?.totalTarget
        ? currentSales + otherDepartmentsTotalSales
        : currentSales;

    return Math.round((totalSales / mainDepartmentData?.totalTarget) * 100);
  }, [mainDepartmentData, otherDepartmentsTotalSales]);

  const values = [
    {
      title: { en: 'Total sales', ar: 'إجمالي المبيعات' },
      amount:
        mainDepartmentData?.currentTotalSales >= mainDepartmentData?.totalTarget
          ? (mainDepartmentData?.currentTotalSales || 0) +
            otherDepartmentsTotalSales
          : mainDepartmentData?.currentTotalSales || 0,
    },
    {
      title: { en: 'Total target', ar: 'إجمالي الهدف' },
      amount: mainDepartmentData?.totalTarget || 0,
    },
    mainDepartmentData?.currentTotalSales >= mainDepartmentData?.totalTarget
      ? {
          title: { en: 'Commission', ar: 'العمولة' },
          amount: mainDepartmentData?.commission || '!',
        }
      : {
          title: { en: 'Remain', ar: 'المتبقي' },
          amount: remainingAmount || 0,
        },
  ];

  useEffect(() => {
    const current = mainDepartmentData?.currentTotalSales;
    const target = mainDepartmentData?.totalTarget;

    const isValid =
      typeof current === 'number' &&
      typeof target === 'number' &&
      target > 0 &&
      current >= target;

    if (isValid) {
      setShowCelebration(true);
    } else {
      setShowCelebration(false); // 👈 RESET celebration if condition is false
    }
  }, [mainDepartmentData]);
  return (
    <div className="w-full h-full flex flex-col    overflow-hidden">
      {/* 🎉 Confetti */}
      {showCelebration && <Confetti width={width} height={height} />}

      {/* 🎉 Celebration Modal */}
      {showCelebration && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 px-4">
          <div className="bg-white rounded-lg shadow-lg p-6 text-center max-w-sm w-full">
            <h2 className="text-2xl font-bold text-green-600 mb-4">
              {lang === 'en' ? 'Congratulations!' : 'تهانينا!'}
            </h2>
            <p className="text-sm text-gray-600 mb-4">
              {lang === 'en'
                ? 'You have achieved your target! Keep up the great work.'
                : 'لقد حققت هدفك! استمر في العمل الرائع.'}
            </p>
            <button
              onClick={() => setShowCelebration(false)}
              className="mt-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm"
            >
              {lang === 'en' ? 'Close' : 'إغلاق'}
            </button>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="px-6 pt-6">
        <h2 className="text-lg font-outfit font-medium text-incentiveTextPrimary">
          {t('targetProgress.title')}
        </h2>
        <p className="md:text-sm text-[0.810rem] text-incentiveTextSecondary mt-1">
          {t('targetProgress.subTitle')}
        </p>
      </div>

      {/* Chart Section */}
      <div className="flex flex-col px-6 md:mt-18 mt-8 mb-4">
        <TargetProgressChart progressValue={targetProgress} />
        {mainDepartmentData ? (
          <p className="md:text-sm text-[0.810rem] text-center text-incentiveTextSecondary md:mt-4 mt-2 leading-relaxed">
            {lang === 'en'
              ? `You have achieved ${
                  mainDepartmentData?.currentTotalSales.toLocaleString() || 0
                } SAR out of your total monthly target of ${
                  mainDepartmentData?.totalTarget.toLocaleString() || 0
                } SAR.`
              : `لقد حققت ${
                  mainDepartmentData?.currentTotalSales.toLocaleString() || 0
                } ريال سعودي من إجمالي هدفك الشهري البالغ ${
                  mainDepartmentData?.totalTarget.toLocaleString() || 0
                } ريال سعودي.`}
          </p>
        ) : (
          <p className="md:text-sm text-[0.810rem] text-center text-incentiveTextSecondary md:mt-4 mt-2 leading-relaxed">
            {lang === 'en'
              ? 'There is no target assigned for this month!'
              : 'لا يوجد هدف لهذا الشهر'}
          </p>
        )}
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-3 divide-x divide-gray-300   px-2 py-5 bg-gray-100 text-center mt-auto">
        {values.map((value, index) => (
          <div key={index} className="px-2">
            <p className="md:text-sm text-[0.820rem] text-incentiveTextSecondary">
              {value.title[lang]}
            </p>
            {typeof value.amount === 'number' ? (
              <p
                className={`font-poppins font-semibold md:text-base text-sm ${
                  value.title[lang].includes(
                    'Total sales' || 'إجمالي المبيعات',
                  ) && value.amount >= mainDepartmentData?.totalTarget
                    ? 'text-blue-600'
                    : 'text-incentiveTextPrimary'
                } mt-1 whitespace-nowrap`}
              >
                {value.amount.toLocaleString()} {currency[lang]}
              </p>
            ) : (
              <button
                onClick={() => setOpenDropDown('commissionPopUp')}
                className="font-poppins font-semibold md:text-base text-sm text-blue-600 hover:text-blue-700 cursor-pointer mt-1 whitespace-nowrap"
              >
                {lang === 'en' ? 'Details' : 'تفاصيل'}
              </button>
            )}
          </div>
        ))}
      </div>
      <CommissionPopUp />
    </div>
  );
};

export default TargetProgress;

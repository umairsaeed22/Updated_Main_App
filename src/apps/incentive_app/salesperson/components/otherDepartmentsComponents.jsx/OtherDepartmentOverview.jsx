import React, { useEffect, useMemo, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import useSalespersonDataStore from '../../../store/useSalespersonDataStore';
import { MdOutlineKeyboardArrowDown } from 'react-icons/md';
import { useLanguage } from '../../../../../context/LanguageContext';
import { currency } from '../../constants';
import useDateStore from '../../../store/useDateStore';
import { MdTrendingUp } from 'react-icons/md';
import { GrTransaction } from 'react-icons/gr';
import { GoPackage } from 'react-icons/go';
import { TbCalendarMonth } from 'react-icons/tb';

const OtherDepartmentOverview = ({
  handleStoreOtherDepartmentCode,
  storedCode,
}) => {
  const [departmentsMenu, setDepartmentsMenu] = useState(false);
  const { selectedMonthYear } = useDateStore();
  const { t } = useTranslation('salespersonDashboard');
  const { lang } = useLanguage();
  const { salespersonData } = useSalespersonDataStore();
  const departmentMenuRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (
        departmentMenuRef.current &&
        !departmentMenuRef.current.contains(e.target)
      ) {
        setDepartmentsMenu(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleToggleDeparmentsMenu = () => {
    setDepartmentsMenu(!departmentsMenu);
  };
  const otherDepartments = salespersonData?.periods[0]?.departments?.filter(
    (department) => {
      return department.isMainDepartment === false;
    },
  );

  const otherDepartmentsNames = otherDepartments?.map((department) => {
    return { code: department?.code, name: department?.name };
  });

  const getOneOtherDepartmentName = otherDepartmentsNames?.find((dept) => {
    return dept?.code === storedCode;
  });

  const departmentFullDetails = otherDepartments?.find((dept) => {
    return dept.code === storedCode;
  });

  const departmentTransactionItemsSum =
    departmentFullDetails?.transactions?.flatMap((tran) => {
      return tran?.items;
    })?.length;

  return (
    <div className="w-full h-full flex flex-col  relative p-6  ">
      {/**Title */}

      <div className="w-full flex items-center justify-between ">
        <div
          ref={departmentMenuRef}
          className="w-full flex items-center justify-between"
        >
          <div
            onClick={handleToggleDeparmentsMenu}
            className="w-fit     flex items-center  text-incentiveTextPrimary text-lg  font-medium tracking-tight font-outfit  gap-2 cursor-pointer"
          >
            {getOneOtherDepartmentName
              ? getOneOtherDepartmentName?.name[lang]
              : 'Not available'}{' '}
            <MdOutlineKeyboardArrowDown
              className={`${
                departmentsMenu && 'rotate-180 transition-all duration-200'
              }`}
              size={20}
            />
          </div>

          {departmentsMenu && getOneOtherDepartmentName && (
            <div className="absolute z-50 w-fit min-w-56 h-fit bg-white rounded-lg border border-incentiveBorder shadow-md shadow-gray-300 top-16 p-2.5">
              <ul className="w-full flex flex-col gap-1">
                {otherDepartmentsNames?.map((department) => (
                  <li
                    onClick={() => {
                      department?.code !== storedCode &&
                        handleStoreOtherDepartmentCode(department?.code);
                    }}
                    key={department?.code}
                    className={`w-full p-2 rounded-lg  text-sm font-outfit  ${
                      department?.code === storedCode
                        ? 'bg-blue-600 text-white '
                        : 'hover:bg-gray-100 cursor-pointer text-incentiveTextSecondary hover:text-incentiveTextPrimary transition-all duration-200'
                    }`}
                  >
                    {department?.name[lang]}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>
      {/**Full details */}
      {departmentFullDetails ? (
        <div className="flex-1 flex flex-col p-1 mt-1.5 gap-5.5 ">
          {/**code */}
          <p className="text-[0.820rem] text-incentiveTextSecondary font-medium">
            {departmentFullDetails?.code}
          </p>
          {/**Total sales */}

          <div className="w-full flex items-center gap-2 py-0.5 bg-blue-50  mt-6 text-incentiveTextPrimary">
            <MdTrendingUp size={18} />
            <p className=" sm:text-sm text-[0.820rem]  font-semibold    ">
              {lang === 'en' ? 'Total sales' : 'إجمالي ألمبيعات'}:{' '}
              <span className="font-poppins font-bold text-blue-600">
                {departmentFullDetails?.currentTotalSales.toLocaleString()}{' '}
                {currency[lang]}
              </span>
            </p>
          </div>
          {/**Number of transactions */}
          <div className="w-full flex items-center gap-2   text-incentiveTextPrimary">
            <GrTransaction size={18} />
            <p className="sm:text-sm text-[0.820rem]    ">
              {lang === 'en' ? 'Number of transactions' : 'عدد المعاملات'}:{' '}
              <span className="font-poppins font-bold text-blue-600">
                {departmentFullDetails?.transactions?.length || 0}{' '}
              </span>
            </p>
          </div>
          {/**All transactions items sum */}
          <div className="w-full flex items-center gap-2 text-incentiveTextPrimary  ">
            <GoPackage size={18} />
            <p className=" sm:text-sm text-[0.820rem]    ">
              {lang === 'en'
                ? 'Sum of All Transaction Items'
                : 'مجموع جميع عناصر المعاملات'}
              :{' '}
              <span className="font-poppins font-bold text-blue-600">
                {departmentTransactionItemsSum || 0}{' '}
              </span>
            </p>
          </div>
          {/**For date */}
          <div className="w-full flex items-center gap-2 text-incentiveTextPrimary  ">
            <TbCalendarMonth size={18} />
            <p className=" sm:text-sm text-[0.820rem] text-incentiveTextPrimary    ">
              {lang === 'en' ? 'For date' : 'للتاريخ'}:{' '}
              <span className="font-poppins font-bold text-blue-600">
                {selectedMonthYear}{' '}
              </span>
            </p>
          </div>
        </div>
      ) : (
        <div className="flex-1 flex justify-center items-center md:text-sm text-[0.810rem] text-center text-incentiveTextSecondary  leading-relaxed">
          {lang === 'en' ? 'No data available!' : 'لا يوجد بيانات متاحة'}
        </div>
      )}
    </div>
  );
};

export default OtherDepartmentOverview;

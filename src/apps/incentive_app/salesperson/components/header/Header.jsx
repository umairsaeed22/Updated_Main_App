import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useLanguage } from '../../../../../context/LanguageContext';
import profilePic from '../../assests/pro.jpg';

import { MdOutlineKeyboardArrowDown } from 'react-icons/md';
import { TbCalendarMonth } from 'react-icons/tb';
import { RiExchange2Fill } from 'react-icons/ri';
import { MdInsertChart } from 'react-icons/md';
import { PiDotsThreeBold } from 'react-icons/pi';
import { HiOutlineMenuAlt1 } from 'react-icons/hi';

import useDropdownStore from '../../../store/useDropdownStore';
import useLayoutStore from '../../../store/useLayoutStore';
import { AnimatePresence, motion } from 'motion/react';

const Header = ({ openMobileBar }) => {
  const [isMobileButtonOpen, setIsMobileButtonOpen] = useState(false);
  const { t } = useTranslation('salespersonDashboard');
  const { lang } = useLanguage();
  const { openDropDown, setOpenDropDown } = useDropdownStore();

  const { isOtherDepartment, setIsOtherDepartment } = useLayoutStore();

  const handleOpenMobileButton = () => {
    setIsMobileButtonOpen(!isMobileButtonOpen);
  };

  useEffect(() => {
    const handleAutoCloseMobileButtons = () => {
      if (window.innerWidth >= 1024) {
        setIsMobileButtonOpen(false);
        setOpenDropDown({ openDropDown: null });
      }
    };

    window.addEventListener('resize', handleAutoCloseMobileButtons);
    return () =>
      window.removeEventListener('resize', handleAutoCloseMobileButtons);
  }, []);

  return (
    <>
      <div className="w-full h-16 flex items-center justify-between">
        {/**Mobile screen sidebar open button */}

        <button
          onClick={openMobileBar}
          className="text-incentiveTextSecondary lg:hidden"
        >
          <HiOutlineMenuAlt1
            size={24}
            className={`${lang === 'ar' && 'rotate-180'}`}
          />{' '}
        </button>

        {/**Logo */}
        <div className="flex items-center gap-1.5">
          <MdInsertChart size={30} className="text-blue-700" />
          <h1 className="text-incentiveTextPrimary font-outfit font-semibold text-lg">
            IncentiveApp
          </h1>
        </div>
        {/**Header buttons larg screen */}
        <div
          className={`lg:flex hidden items-center gap-4 ${
            lang === 'en' ? 'ml-auto' : 'mr-auto'
          } `}
        >
          {/**Change layout */}
          <button
            onClick={() => setIsOtherDepartment(!isOtherDepartment)}
            className={`p-2 bg-gray-100 rounded-full h-10 flex items-center justify-center w-10  hover:bg-gray-200  transition-all duration-200 cursor-pointer ${
              isOtherDepartment
                ? 'text-blue-700 rotate-180 duration-1000 transition-transform'
                : 'text-incentiveTextPrimary'
            }`}
          >
            <RiExchange2Fill size={21} />
          </button>

          {/**Month picker */}
          <button
            onClick={() =>
              setOpenDropDown(
                openDropDown === 'monthPicker' ? null : 'monthPicker',
              )
            }
            className="p-2 bg-gray-100 rounded-full h-10 flex items-center justify-center w-10 text-incentiveTextPrimary hover:bg-gray-200  transition-all duration-200 cursor-pointer"
          >
            <TbCalendarMonth size={21} />
          </button>

          {/**Avatar */}
          <div
            onClick={() =>
              setOpenDropDown(
                openDropDown === 'avatarMenu' ? null : 'avatarMenu',
              )
            }
            className="flex items-center group cursor-pointer gap-2 "
          >
            <span className="w-10 h-10 rounded-full  overflow-hidden">
              <img
                src={profilePic}
                alt="profile-pic"
                loading="lazy"
                className="w-full h-full object-cover group-hover:grayscale-25 transition-all duration-200"
              />
            </span>
            <MdOutlineKeyboardArrowDown
              size={18}
              className={`${
                openDropDown === 'avatarMenu' &&
                'rotate-180 transition-all duration-300'
              }`}
            />
          </div>
        </div>
        {/**Mobile header buttons open button */}
        <button
          onClick={handleOpenMobileButton}
          className="text-incentiveTextSecondary lg:hidden"
        >
          <PiDotsThreeBold size={22} />{' '}
        </button>
      </div>
      {/**Header buttons mobile screen */}
      <AnimatePresence>
        {isMobileButtonOpen && (
          <motion.div
            initial={{ opacity: 0, y: -5 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -5 }}
            transition={{ duration: 0.5, ease: 'easeInOut' }}
            className="h-16 w-full flex items-center justify-end border-t border-incentiveBorder "
          >
            <div
              className={`flex  items-center gap-4 ${
                lang === 'en' ? 'ml-auto' : 'mr-auto'
              } `}
            >
              {/**Change layout */}
              <button
                onClick={() => setIsOtherDepartment(!isOtherDepartment)}
                className={`p-2 bg-gray-100 rounded-full h-10 flex items-center justify-center w-10  hover:bg-gray-200  transition-all duration-200 cursor-pointer ${
                  isOtherDepartment
                    ? 'text-blue-700 rotate-180 duration-1000 transition-transform'
                    : 'text-incentiveTextPrimary'
                }`}
              >
                <RiExchange2Fill size={21} />
              </button>

              {/**Month picker */}
              <button
                onClick={() =>
                  setOpenDropDown(
                    openDropDown === 'monthPicker' ? null : 'monthPicker',
                  )
                }
                className="p-2 bg-gray-100 rounded-full h-10 flex items-center justify-center w-10 text-incentiveTextPrimary hover:bg-gray-200  transition-all duration-200 cursor-pointer"
              >
                <TbCalendarMonth size={21} />
              </button>

              {/**Avatar */}
              <div
                onClick={() =>
                  setOpenDropDown(
                    openDropDown === 'avatarMenu' ? null : 'avatarMenu',
                  )
                }
                className="flex items-center group cursor-pointer gap-2 "
              >
                <span className="w-10 h-10 rounded-full  overflow-hidden">
                  <img
                    src={profilePic}
                    alt="profile-pic"
                    loading="lazy"
                    className="w-full h-full object-cover group-hover:grayscale-25 transition-all duration-200"
                  />
                </span>
                <MdOutlineKeyboardArrowDown
                  size={18}
                  className={`${
                    openDropDown === 'avatarMenu' &&
                    'rotate-180 transition-all duration-300'
                  }`}
                />
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Header;

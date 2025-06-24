import React from 'react';
import { useLocation } from 'react-router-dom';
import { FaUsersGear } from 'react-icons/fa6';
import { useLanguage } from '../../../../context/LanguageContext';

const Header = () => {
  const location = useLocation();
  const { lang } = useLanguage();
  const isOverview = location.pathname.includes('/userManagment/userManagment');

  return (
    <div className="w-full h-full px-4 flex items-center">
      {/**BreadCrumbs */}
      <div className="flex items-center  text-[0.80rem] font-outfit">
        <p className="text-secondary-text">Users-management / </p>
        <span
          className={`flex items-center gap-1 font-medium ${
            lang === 'en' ? 'ml-1' : 'mr-1'
          } `}
        >
          {isOverview ? (
            <>
              {' '}
              <FaUsersGear size={14} /> Users overview
            </>
          ) : (
            location.pathname
          )}
        </span>
      </div>
    </div>
  );
};

export default Header;

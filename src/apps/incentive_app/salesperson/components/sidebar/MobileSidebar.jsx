import React from 'react';

import { RiCloseLargeLine } from 'react-icons/ri';
import { sidebarItems, sidebarItemsSettingsItems } from '../../constants';
import { useLanguage } from '../../../../../context/LanguageContext';
import { useLocation, useNavigate } from 'react-router-dom';

const MobileSidebar = ({ onClose }) => {
  const { lang } = useLanguage();
  const location = useLocation();
  const { toggleLanguage } = useLanguage();
  const navigate = useNavigate();

  const handleLogout = () => {
    navigate('/');
  };

  return (
    <div className="w-full min-h-full flex flex-col p-4">
      {/**Close */}
      <button
        onClick={onClose}
        className="p-2 text-incentiveTextSecondary rounded-lg bg-gray-100 hover:bg-gray-200 w-fit"
      >
        <RiCloseLargeLine size={18} />
      </button>
      {/**Sidebar items */}
      <ul className={`w-full flex flex-col mt-10 gap-3 `}>
        {sidebarItems.map((item, index) => {
          return (
            <li
              key={index}
              className={`flex items-center rounded-lg  cursor-pointer p-2 gap-3 font-outfit ${
                item.linkto === location.pathname
                  ? 'bg-blue-50 text-blue-600 font-semibold ring-1 ring-blue-100'
                  : 'text-incentiveTextSecondary hover:bg-gray-100 transition-all duration-200'
              } `}
            >
              <item.icon size={22} className="shrink-0" />{' '}
              <h1 className={`  font-semibold text-sm`}>{item.title[lang]}</h1>
            </li>
          );
        })}
      </ul>

      {/**Language & Log out */}
      <ul className="w-full border-t border-incentiveBorder pt-4 mt-2 space-y-3">
        {sidebarItemsSettingsItems.map((item, index) => (
          <li
            onClick={() =>
              item.itemType === 'lang' ? toggleLanguage() : handleLogout()
            }
            key={index}
            className={`flex items-center rounded-lg  cursor-pointer p-2 gap-3 font-outfit text-incentiveTextSecondary hover:bg-gray-100 transition-all duration-200 `}
          >
            <item.icon size={22} className="shrink-0" />{' '}
            <h1 className={`  font-semibold text-sm`}>{item.title[lang]}</h1>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default MobileSidebar;

import React from 'react';
import { HiOutlineMenuAlt1 } from 'react-icons/hi';
import { RiCloseLargeLine } from 'react-icons/ri';
import { sidebarItems, sidebarItemsSettingsItems } from '../../constants';
import { useLanguage } from '../../../../../context/LanguageContext';
import { useLocation, useNavigate } from 'react-router-dom';

const SideBar = ({ onOpen, isSidebarFullView }) => {
  const { lang } = useLanguage();
  const location = useLocation();
  const { toggleLanguage } = useLanguage();
  const navigate = useNavigate();

  const handleLogout = () => {
    navigate('/');
  };
  return (
    <div className="w-full min-h-full flex flex-col p-4">
      {/**Open button */}
      <button
        onClick={onOpen}
        className={`text-incentiveTextSecondary ${
          isSidebarFullView ? 'mx-0' : 'mx-auto'
        } p-2 bg-gray-100 rounded-lg hover:bg-gray-200 cursor-pointer transition-all duration-200 w-fit`}
      >
        {isSidebarFullView ? (
          <RiCloseLargeLine size={20} />
        ) : (
          <HiOutlineMenuAlt1 size={20} />
        )}
      </button>

      {/**Sidebar items */}
      <ul
        className={`w-full flex flex-col mt-10 gap-3 ${
          isSidebarFullView ? 'items-start' : 'items-center'
        }`}
      >
        {sidebarItems.map((item, index) => {
          return (
            <li
              key={index}
              className={`flex items-center rounded-lg  cursor-pointer p-2 gap-3 font-outfit ${
                item.linkto === location.pathname
                  ? 'bg-blue-50 text-blue-600 font-semibold ring-1 ring-blue-100'
                  : 'text-incentiveTextSecondary hover:bg-gray-100 transition-all duration-200'
              } ${isSidebarFullView ? 'w-full' : 'w-fit'}`}
            >
              <item.icon size={22} className="shrink-0" />{' '}
              <h1
                className={`${
                  isSidebarFullView ? 'block' : 'hidden'
                }  font-semibold text-sm`}
              >
                {item.title[lang]}
              </h1>
            </li>
          );
        })}
      </ul>
      {/**Language & Log out */}
      <ul className="w-full border-t border-incentiveBorder pt-4 mt-auto space-y-3">
        {sidebarItemsSettingsItems.map((item, index) => (
          <li
            onClick={() =>
              item.itemType === 'lang' ? toggleLanguage() : handleLogout()
            }
            key={index}
            className={`flex items-center rounded-lg  cursor-pointer p-2 gap-3 font-outfit text-incentiveTextSecondary hover:bg-gray-100 transition-all duration-200 ${
              isSidebarFullView ? 'w-full' : 'w-fit'
            }`}
          >
            <item.icon size={22} className="shrink-0" />{' '}
            <h1
              className={`${
                isSidebarFullView ? 'block' : 'hidden'
              }  font-semibold text-sm`}
            >
              {item.title[lang]}
            </h1>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default SideBar;

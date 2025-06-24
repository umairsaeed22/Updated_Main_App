import React from 'react';
import { FaUsersGear } from 'react-icons/fa6';
import { useLanguage } from '../../../../context/LanguageContext';
import { useLocation, useNavigate } from 'react-router-dom';
import { managementMenuItems, otherMenuItems } from '../../constants';
import defaultProfilePic from '../../assets/profilePic.jpg';
const Sidebar = () => {
  const { toggleLanguage, lang } = useLanguage();
  const location = useLocation();
  const navigate = useNavigate();

  const sideBarActions = (action) => {
    if (action === 'switchLang') {
      toggleLanguage();
    }
    if (action === 'goBack') {
      navigate('/dashboard');
    }
    if (action === 'logOut') {
      navigate('/');
    }
  };

  return (
    <div className="w-full min-h-full p-4 flex flex-col">
      {/**Header */}
      <div className="w-full flex items-center gap-2">
        <span className="p-1.5 bg-neutral-800 text-white rounded-lg">
          <FaUsersGear size={14} />
        </span>
        <h1 className=" text-primary-text font-outfit font-semibold">
          {lang === 'en' ? 'UsersManagment' : 'إدارة المستخدمين'}
        </h1>
      </div>
      {/**Main Items */}
      <p className="text-[0.80rem] text-secondary-text mt-8">
        {lang === 'en' ? 'General' : 'عام'}
      </p>
      <ul className="w-full flex flex-col gap-0.5 mt-3 p-1">
        {managementMenuItems.map((item, index) => (
          <li
            key={index}
            className={`w-full rounded-lg py-1.5 px-2.5 text-[0.820rem] flex items-center gap-2.5 tracking-tight  hover:bg-neutral-300 hover:font-medium hover:text-primary-text 
              transition-all duration-300 cursor-pointer ${
                item.route === location.pathname
                  ? 'bg-neutral-300 font-medium text-primary-text'
                  : 'text-neutral-500'
              } `}
          >
            <item.icon size={17} /> {item.label[lang]}
          </li>
        ))}
      </ul>

      {/**Other Items */}
      <p className="text-[0.80rem] text-secondary-text mt-4">
        {lang === 'en' ? 'Others' : 'اخرى'}
      </p>
      <ul className="w-full flex flex-col gap-0.5 mt-3 p-1">
        {otherMenuItems.map((item, index) => (
          <li
            onClick={() => sideBarActions(item.action)}
            key={index}
            className={`w-full rounded-lg py-1.5 px-2.5 text-[0.820rem] flex items-center gap-2.5 tracking-tight hover:font-medium text-neutral-500 ${
              item.action === 'logOut'
                ? 'hover:bg-red-100 hover:text-red-700'
                : 'hover:bg-neutral-300  hover:text-primary-text'
            }
              transition-all duration-300 cursor-pointer  `}
          >
            <item.icon size={17} /> {item.label[lang]}
          </li>
        ))}
      </ul>
      <div className="w-full border-t border-border mt-auto pt-4 flex items-center gap-3">
        <span className="w-8 h-8 rounded-full shadow-sm shadow-neutral-200 overflow-hidden">
          <img
            src={defaultProfilePic}
            alt="profilePic"
            loading="eager"
            className="w-full h-full object-cover"
          />
        </span>
        <div className="flex flex-col">
          <h1 className="text-primary-text font-outfit text-[0.820rem] font-semibold">
            {lang === 'en' ? 'Ahmed Ali' : 'احمد علي'}
          </h1>
          <p className="text-xs text-secondary-text">
            {lang === 'en'
              ? 'IT manager - head office'
              : 'مدير قسم المعلومات - المكتب الرئيسي '}
          </p>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;

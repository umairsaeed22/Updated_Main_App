import React from 'react';
import useDropdownStore from '../../../store/useDropdownStore';
import { useLanguage } from '../../../../../context/LanguageContext';
import { avatarMenuItems } from '../../constants';
import { useNavigate } from 'react-router-dom';

const AvatarMenu = () => {
  const { openDropDown } = useDropdownStore();
  const { lang } = useLanguage();
  const navigate = useNavigate();

  if (openDropDown !== 'avatarMenu') return null;
  return (
    <div
      className={`absolute z-20 w-72 h-fit rounded-lg border border-incentiveBorder bg-white lg:top-16 top-32 shadow-sm shadow-gray-300 flex flex-col ${
        lang === 'en' ? 'right-2' : 'left-2'
      }`}
    >
      {/**User info */}
      <div className="w-full border-b border-incentiveBorder p-2.5">
        <h1 className="text-incentiveTextPrimary text-sm font-semibold">
          {lang === 'en' ? 'Ahmed Hasan' : 'أحمد حسن'}
        </h1>
        <p className="text-[0.8rem] text-incentiveTextSecondary mt-0.5">
          {lang === 'en' ? 'Salesperson' : 'مسؤول مبيعات'}
        </p>
      </div>
      {/**User info */}
      <div className="w-full border-b border-incentiveBorder p-2.5">
        <h1 className="text-incentiveTextPrimary text-sm font-semibold">
          {lang === 'en' ? 'SACO Al-takhasusi' : 'ساكو التخصصي'}
        </h1>
        <p className="text-[0.8rem] text-incentiveTextSecondary mt-0.5">
          {lang === 'en' ? 'Riyadh' : 'الرياض'}
        </p>
      </div>
      {/**Menu buttons */}
      <ul className="w-full flex flex-col p-2">
        {avatarMenuItems.map((item, index) => (
          <li
            onClick={() => navigate(item.linkTo)}
            key={index}
            className={`p-2 rounded-lg text-sm text-incentiveTextPrimary hover:bg-gray-100 transition-all duration-200 cursor-pointer flex items-center gap-2`}
          >
            <item.icon size={18} /> {item.title[lang]}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default AvatarMenu;

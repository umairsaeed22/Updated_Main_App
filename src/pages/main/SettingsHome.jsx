import React from 'react';
import { useTranslation } from 'react-i18next';
import { settingsNavigationsTabs } from '../../constants';
import { useLanguage } from '../../context/LanguageContext';
import { MdOutlineKeyboardArrowRight } from 'react-icons/md';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '../../context/ThemeContext';

const SettingsHome = () => {
  const { t } = useTranslation('mainDashboardSettings');
  const { lang } = useLanguage();
  const { theme } = useTheme();

  const navigate = useNavigate();

  return (
    <div className="w-full h-full bg-white/80 lg:p-6 p-4 flex flex-col overflow-x-hidden overflow-y-auto">
      <h1 className="text-primary-text text-base font-semibold">
        {t('settingsHomeTitle')}
      </h1>
      <p className="text-secondary-text text-sm mt-1">
        {t('settingsHomeSubtitle')}
      </p>
      {/**Settings navigations */}
      <div className="flex-1">
        <ul className="w-full md:max-w-md  flex flex-col mt-8 gap-2">
          {settingsNavigationsTabs.map((tab, index) => (
            <li
              onClick={() => navigate(tab.pageRoute)}
              key={index}
              className={`p-4 flex items center text-primary-text gap-2 bg-white text-sm  ${
                theme === 'orange'
                  ? 'hover:text-orange-600'
                  : 'hover:text-indigo-600'
              } transition-all duration-300 cursor-pointer border border-gray-200 ${
                theme === 'orange'
                  ? 'hover:border-orange-600'
                  : 'hover:border-indigo-600'
              } rounded-lg `}
            >
              <tab.icon size={18} /> {tab.title[lang]}{' '}
              <MdOutlineKeyboardArrowRight
                size={18}
                className={`${
                  lang === 'en' ? 'ml-auto' : 'mr-auto rotate-180'
                }`}
              />
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default SettingsHome;

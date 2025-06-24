import React from 'react';
import { useTranslation } from 'react-i18next';
import { useLanguage } from '../../context/LanguageContext';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '../../context/ThemeContext';

const LanguageSettings = () => {
  const { toggleLanguage, lang } = useLanguage();
  const { t } = useTranslation('mainDashboardSettings');
  const { theme } = useTheme();

  const navigate = useNavigate();
  return (
    <div className="w-full h-full bg-white/80 lg:p-6 p-4 flex flex-col">
      <button
        onClick={() => navigate('/mainDashboard/settings')}
        className={`cursor-pointer  text-sm ${
          theme === 'orange'
            ? 'text-blue-600 hover:text-blue-700 hover:tracking-wide'
            : 'text-indigo-600 hover:text-indigo-700 hover:tracking-wide '
        }  transition-all duration-300 w-fit`}
      >
        {t('navigationBack')}
      </button>

      <h1 className="text-primary-text text-base font-semibold mt-4">
        {t('languageSettingsTitle')}
      </h1>
      <p className="text-secondary-text text-sm mt-1">
        {t('languageSettingsSubtitle')}
      </p>

      <div className="w-full max-w-md mt-4">
        <button
          onClick={toggleLanguage}
          className={`p-2.5  text-white ${
            theme === 'orange'
              ? 'bg-orange-600 hover:bg-orange-700'
              : 'bg-button hover:bg-button-hover'
          } cursor-pointer font-rubik font-semibold text-sm rounded-md w-full mt-2`}
        >
          {lang === 'en' ? 'Switch to Arabic' : 'التبديل إلى اللغة الإنجليزية'}
        </button>
      </div>
    </div>
  );
};

export default LanguageSettings;

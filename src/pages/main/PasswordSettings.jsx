import React from 'react';
import { useTranslation } from 'react-i18next';

import { useNavigate } from 'react-router-dom';
import FormInput from '../../components/authentication/FormInput';
import { useTheme } from '../../context/ThemeContext';

const PasswordSettings = () => {
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
        {t('passwordSettingsTitle')}
      </h1>
      <p className="text-secondary-text text-sm mt-1 ">
        {t('passwordSettingsSubtitle')}
      </p>
      <form action="" className="w-full max-w-md flex flex-col gap-1 mt-4">
        <FormInput placeholder={t('passwordSettingsCurrent')} />
        <FormInput placeholder={t('passwordSettingsNew')} />
        <FormInput placeholder={t('passwordSettingsConfirm')} />
        <button
          className={`p-2.5  text-white ${
            theme === 'orange'
              ? 'bg-orange-600 hover:bg-orange-700'
              : 'bg-button hover:bg-button-hover'
          } cursor-pointer font-rubik font-semibold text-sm rounded-md w-full mt-2`}
        >
          {t('passwordSettingsAction')}
        </button>
      </form>
    </div>
  );
};

export default PasswordSettings;

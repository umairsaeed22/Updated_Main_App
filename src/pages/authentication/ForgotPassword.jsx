import React from 'react';
import { useTranslation } from 'react-i18next';
import { TbLockPassword } from 'react-icons/tb';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '../../context/ThemeContext';

const ForgotPassword = () => {
  const { t } = useTranslation('global');
  const { theme } = useTheme();
  const navigate = useNavigate();
  return (
    <div className="md:w-md md:h-fit w-full  bg-white md:border md:border-gray-200 md:rounded-lg md:shadow-md md:shadow-gray-300 md:p-6 p-4 flex flex-col items-center">
      <div className="bg-gray-200 p-2 rounded-lg text-primary-text mt-4">
        <TbLockPassword size={24} />
      </div>
      <h1 className="text-primary-text font-rubik text-xl font-semibold mt-4">
        {t('ForgotTitle')}
      </h1>
      <p className="text-sm text-center tracking-wide text-secondary-text mt-1">
        {t('ForgotPassword')}
      </p>
      <button
        onClick={() => navigate('/')}
        className={`p-2.5 ${
          theme === 'orange'
            ? 'bg-orange-600 hover:bg-orange-700'
            : 'bg-button hover:bg-button-hover'
        } font-rubik font-semibold cursor-pointer transition-normal duration-300 mt-8 rounded-md text-white w-full`}
      >
        {t('ForgotAcknowledge')}
      </button>
    </div>
  );
};

export default ForgotPassword;

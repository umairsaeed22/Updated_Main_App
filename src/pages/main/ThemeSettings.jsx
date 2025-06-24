import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import defaultTheme from '../../assets/defaultTheme.png';
import OrangeTheme from '../../assets/orangeTheme.png';
import noPatternTheme from '../../assets/noPatternTheme.png';
import { useTheme } from '../../context/ThemeContext';

const ThemeSettings = () => {
  const { theme, setThemeByName } = useTheme();
  const [themeChoice, setThemeChoice] = useState(theme);

  const { t } = useTranslation('mainDashboardSettings');
  const navigate = useNavigate();

  const handleSetTheme = (e) => {
    const newTheme = e.target.value;
    setThemeChoice(newTheme);
    setThemeByName(newTheme);
  };

  return (
    <div className="w-full h-full bg-white/80 lg:p-6 p-4 flex flex-col ">
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
        {t('ThemeSettingsTitle')}
      </h1>
      <p className="text-secondary-text text-sm mt-1">
        {t('ThemeSettingsSubtitle')}
      </p>
      <div className="w-full max-w-md mt-4 grid sm:grid-cols-2 grid-cols-1 gap-6 overflow-y-auto">
        <div className="h-44 overflow-hidden rounded-lg  flex flex-col">
          <img
            src={defaultTheme}
            alt="defaultTheme"
            className="w-full h-[80%]  rounded-lg"
          />
          {/**input */}
          <div className="flex-1 flex items-center gap-1 justify-center">
            <input
              type="radio"
              name="themeChoice"
              value="default"
              checked={themeChoice === 'default'}
              onChange={handleSetTheme}
            />{' '}
            <p className="text-sm text-primary-text">Default</p>
          </div>
        </div>
        <div className="h-44 overflow-hidden rounded-lg  flex flex-col">
          <img
            src={OrangeTheme}
            alt="orangeTheme"
            className="w-full h-[80%] rounded-lg"
          />
          {/**input */}
          <div className="flex-1 flex items-center gap-1 justify-center">
            <input
              type="radio"
              name="themeChoice"
              value="orange"
              checked={themeChoice === 'orange'}
              onChange={handleSetTheme}
            />{' '}
            <p className="text-sm text-primary-text">Orange</p>
          </div>
        </div>
        <div className="h-44 overflow-hidden rounded-lg  flex flex-col">
          <img
            src={noPatternTheme}
            alt="noPattern"
            className="w-full h-[80%]  rounded-lg"
          />
          {/**input */}
          <div className="flex-1 flex items-center gap-1 justify-center">
            <input
              type="radio"
              name="themeChoice"
              value="noPattern"
              checked={themeChoice === 'noPattern'}
              onChange={handleSetTheme}
            />{' '}
            <p className="text-sm text-primary-text">No pattern</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ThemeSettings;

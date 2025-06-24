// src/components/authentication/AuthLayout.jsx

import React, { useEffect, useRef, useState } from 'react';
import wavebg from '../../assets/wavebg.svg';
import sacoLogo from '../../assets/sacoLogo.png';
import { MdOutlineLanguage, MdKeyboardArrowDown } from 'react-icons/md';
import LanguageMenu from './LanguageMenu';
import { useLanguage } from '../../context/LanguageContext';
import { Outlet } from 'react-router-dom';
import { authFooter } from '../../constants';
import sacoLogo2 from '../../assets/sacoLogo2.png';
import { motion } from 'motion/react';
import { useTheme } from '../../context/ThemeContext';
import waveOrangebg from '../../assets/orangeTheme/wavebgOrange.svg';
const AuthLayout = () => {
  const [languageMenu, setLanguageMenu] = useState(false);
  const { toggleLanguage, lang } = useLanguage();
  const { theme } = useTheme();
  const menuRef = useRef(null);

  const toggleLanguageMenu = () => {
    setLanguageMenu((prev) => !prev);
  };

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setLanguageMenu(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
      className="w-screen min-h-dvh h-dvh relative flex flex-col"
    >
      <div className="w-screen h-full md:block hidden">
        {theme !== 'noPattern' && (
          <img
            src={theme === 'orange' ? waveOrangebg : wavebg}
            alt="wave"
            loading="eager"
            decoding="sync"
            className="w-full h-full object-cover"
          />
        )}
      </div>

      <div className="w-full h-full absolute z-10 flex flex-col md:p-6 ">
        {/**Mobile screen lsaco logo */}
        <div className="w-full md:hidden p-4">
          <img src={sacoLogo2} alt="sacologo" className=" w-24" />
        </div>
        {/* Header */}
        <div
          ref={menuRef}
          className="w-full md:flex items-center justify-between hidden "
        >
          <img
            src={theme !== 'noPattern' ? sacoLogo : sacoLogo2}
            alt="company-logo"
            className="w-24"
          />
          <button
            onClick={toggleLanguageMenu}
            className={`p-2 border  ${
              theme !== 'noPattern'
                ? 'text-white border-white'
                : 'text-indigo-600 border-indigo-600'
            } rounded-lg flex items-center  text-sm font-rubik font-medium gap-2 cursor-pointer`}
          >
            <MdOutlineLanguage size={18} />
            {lang === 'en' ? 'En' : 'Ar'}
            <MdKeyboardArrowDown
              size={18}
              className={`${
                languageMenu && 'rotate-180 transition-transform duration-300'
              }`}
            />
          </button>
          <LanguageMenu isOpen={languageMenu} />
        </div>

        {/* Page-specific form */}
        <motion.div
          initial={{ opacity: 0, y: 5 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
          className="flex-1  flex flex-col justify-center items-center"
        >
          <Outlet />

          {/**Footer */}
          <ul className="flex items-center gap-4 md:text-sm text-[0.830rem] text-secondary-text space-x-4 mt-16">
            {authFooter.map((item, index) => (
              <li
                key={index}
                className={`cursor-pointer ${
                  theme === 'orange'
                    ? 'hover:text-blue-600'
                    : 'hover:text-indigo-600'
                } transition-normal duration-300`}
              >
                {item.title[lang]}
              </li>
            ))}
            <li
              onClick={toggleLanguage}
              className={` md:hidden cursor-pointer ${
                theme === 'orange'
                  ? 'hover:text-blue-600'
                  : 'hover:text-indigo-600'
              } transition-normal duration-300 `}
            >
              {lang === 'en' ? 'Arabic' : 'ألإنجليزية'}
            </li>
          </ul>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default AuthLayout;

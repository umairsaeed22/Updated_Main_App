import React, { useEffect, useRef, useState } from 'react';
import mainbg from '../../assets/mainbg.svg';
import mainbgAr from '../../assets/mainbgAr.svg';
import SideBar from './SideBar';
import { AnimatePresence, motion } from 'motion/react';
import Header from './Header';
import LanguageMenu from '../authentication/LanguageMenu';
import MobileSideBar from './MobileSideBar';
import { useLanguage } from '../../context/LanguageContext';
import { Outlet } from 'react-router-dom';
import { useTheme } from '../../context/ThemeContext';
import orangengEn from '../../assets/orangeTheme/orangbg.svg';
import orangengAr from '../../assets/orangeTheme/orangebgAr.svg';

const MainDashboardLayout = () => {
  const [isLanguageMenuOpen, setIsLanguageMenuOpen] = useState(false);

  const [isMobileBarOpen, setIsMobilebarOpen] = useState(false);

  const menuRef = useRef(null);
  const { theme } = useTheme();

  const { lang } = useLanguage();

  let mobileSidebarOpenDirection = lang === 'en' ? -72 : 72;

  const toggleLanguageMenu = () => {
    setIsLanguageMenuOpen((prev) => !prev);
  };

  const handleToggleMobileSideBar = () => {
    setIsMobilebarOpen(true);
  };

  const handleCloseMobileSideBar = () => {
    setIsMobilebarOpen(false);
  };

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setIsLanguageMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);

    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    const handleAutoCloseMobileSidebar = () => {
      if (window.innerWidth >= 1024) {
        handleCloseMobileSideBar();
      }
    };

    window.addEventListener('resize', handleAutoCloseMobileSidebar);

    return () => {
      window.removeEventListener('resize', handleAutoCloseMobileSidebar);
    };
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
      className="w-screen min-h-dvh h-dvh flex  relative overflow-hidden "
    >
      {theme !== 'noPattern' && (
        <img
          src={
            theme === 'orange'
              ? lang === 'en'
                ? orangengEn
                : orangengAr
              : lang === 'en'
              ? mainbg
              : mainbgAr
          }
          alt="mainDashboar-background"
          loading="eager"
          decoding="sync"
          className="w-full h-full object-cover "
        />
      )}

      <div className="w-full h-full flex absolute z-10 ">
        {/**Side bar */}
        <div
          className={`w-72 h-full bg-card ${
            lang === 'en' ? 'border-r' : 'border-l'
          } border-gray-200 overflow-y-auto lg:block hidden`}
        >
          <SideBar />
        </div>

        <div className="flex-1 flex flex-col ">
          {/**Header */}
          <div
            ref={menuRef}
            className="w-full h-16 bg-card/80 border-b border-gray-200 relative"
          >
            <Header
              isLanguageMenuOpen={isLanguageMenuOpen}
              toggleMenu={toggleLanguageMenu}
              onMobileSideBarOpen={handleToggleMobileSideBar}
            />
            <LanguageMenu isOpen={isLanguageMenuOpen} />
          </div>
          {/**MainDashboard */}
          <div className="flex-1 overflow-hidden ">
            <Outlet />
          </div>
        </div>
      </div>

      {/**Mobile sidebar */}
      <AnimatePresence>
        {isMobileBarOpen && (
          <div className="w-full h-full bg-black/50 fixed inset-0 z-50">
            <motion.div
              initial={{ opacity: 0, x: mobileSidebarOpenDirection }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: mobileSidebarOpenDirection }}
              transition={{ duration: 0.8, ease: 'easeOut' }}
              className="w-72 h-full bg-card border-r border-gray-200 overflow-y-auto  "
            >
              <MobileSideBar onClose={handleCloseMobileSideBar} />
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default MainDashboardLayout;

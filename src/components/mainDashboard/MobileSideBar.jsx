import React, { useState } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { mockLogOut, mockUserProfile, sideBarItems } from '../../constants';
import { useLocation, useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { IoMdClose } from 'react-icons/io';
import { useTheme } from '../../context/ThemeContext';
import useAuthStore from '../../store/useAuthStore';
import { LuLogOut } from 'react-icons/lu';

const MobileSideBar = ({ onClose }) => {
  const [hoveredIndex, setHoveredIndex] = useState(null);
  const { lang } = useLanguage();
  const { theme } = useTheme();

  const { employee, logout } = useAuthStore();
  const navigate = useNavigate();
  const location = useLocation();
  const handleLogOut = () => {
    logout(), navigate('/');
  };
  return (
    <div className="w-full min-h-full p-4 flex flex-col ">
      {/**close button */}

      <button
        onClick={onClose}
        className="text-primary-text cursor-pointer self-end"
      >
        <IoMdClose size={18} />
      </button>

      {/**User info */}
      <div className="w-full flex items-center">
        <span className="w-10 h-10 rounded-full overflow-hidden bg-indigo-700 text-white flex items-center justify-center font-semibold text-base">
          {employee?.firstName?.toUpperCase()?.slice(0, 1) || '-'}
        </span>
        <div className={`flex flex-col ${lang === 'en' ? 'ml-2.5' : 'mr-2.5'}`}>
          <h1 className="text-sm text-primary-text font-semibold">
            {(employee?.firstName || '') + ' ' + (employee?.lastName || '')}
          </h1>
          <p className="text-[0.80rem] text-secondary-text">
            {employee?.fileNo || ''}
          </p>
        </div>
      </div>
      {/**Sidebar items */}
      <ul className="w-full flex flex-col mt-10 gap-2 pb-4 ">
        {sideBarItems.map((item, index) => {
          const isActive = item.link === location.pathname;

          return (
            <motion.li
              key={index}
              onClick={() => {
                navigate(item.link);
                onClose();
              }}
              onMouseEnter={() => setHoveredIndex(index)}
              onMouseLeave={() => setHoveredIndex(null)}
              className={`flex items-center p-2 gap-2 text-primary-text text-sm  ${
                theme === 'orange'
                  ? 'hover:bg-orange-200'
                  : 'hover:bg-indigo-200'
              } transition-all duration-200 rounded-md cursor-pointer ${
                isActive
                  ? theme === 'orange'
                    ? 'bg-orange-200'
                    : 'bg-indigo-200'
                  : ''
              }`}
            >
              <motion.div
                animate={
                  isActive || hoveredIndex === index
                    ? {
                        rotate: [0, 8, -8, 8, -8, 0],
                        transition: {
                          repeat: Infinity,
                          duration: 1,
                          ease: 'backInOut',
                        },
                      }
                    : { rotate: 0, transition: { duration: 0.3 } }
                }
              >
                <item.icon size={18} />
              </motion.div>
              {item.title[lang]}
            </motion.li>
          );
        })}
        <li
          onClick={handleLogOut}
          className="flex items-center p-2 gap-2 text-primary-text text-sm hover:bg-red-100 hover:text-red-800 transition-normal duration-200 rounded-md cursor-pointer"
        >
          <LuLogOut size={18} /> {lang === 'en' ? 'Logout' : 'تسجيل الخروج'}
        </li>
      </ul>
      <div className="mt-auto border-t border-gray-200 pt-4 text-secondary-text text-sm text-center">
        © {new Date().getFullYear()} SACO. All rights reserved.
      </div>
    </div>
  );
};

export default MobileSideBar;

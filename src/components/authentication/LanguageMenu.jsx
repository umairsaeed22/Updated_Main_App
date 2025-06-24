import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLanguage } from '../../context/LanguageContext';

const LanguageMenu = ({ isOpen }) => {
  const { toggleLanguage, lang } = useLanguage();
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, y: 5 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -5 }}
          transition={{ duration: 0.3 }}
          className={`absolute top-17  ${
            lang === 'en' ? 'right-4' : 'left-4'
          }  w-28 bg-white shadow-md rounded-md z-50 overflow-hidden p-2 border border-gray-200  shadow-gray-400`}
        >
          <ul className="text-sm ">
            <li
              onClick={toggleLanguage}
              className={`p-2 hover:bg-neutral-200 cursor-pointer rounded-md ${
                lang === 'en' ? 'text-indigo-600' : 'text-neutral-700'
              }`}
            >
              English
            </li>
            <li
              onClick={toggleLanguage}
              className={`p-2 hover:bg-neutral-200 cursor-pointer rounded-md ${
                lang === 'ar' ? 'text-indigo-600' : 'text-neutral-700'
              }`}
            >
              العربية
            </li>
          </ul>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default LanguageMenu;

import React from 'react';
import ReactDom from 'react-dom';
import useDropdownStore from '../../../store/useDropdownStore';
import { AnimatePresence, motion } from 'motion/react';
import { useLanguage } from '../../../../../context/LanguageContext';
import { LuInfo } from 'react-icons/lu';

const CommissionPopUp = () => {
  const { openDropDown, closeDropDown } = useDropdownStore();
  const { lang } = useLanguage();

  const isOpen = openDropDown === 'commissionPopUp';

  return ReactDom.createPortal(
    <AnimatePresence>
      {isOpen && (
        <div className="w-full h-full bg-black/60 fixed inset-0 z-50 flex justify-center items-center px-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5, ease: 'easeInOut' }}
            className="w-full max-w-sm h-fit rounded-lg bg-white py-6 px-4 flex flex-col gap-6 justify-between"
          >
            {/**icon */}

            <LuInfo size={32} className="text-incentiveTextSecondary mx-auto" />
            {/**Text */}
            <div className="w-full text-center text-sm text-incentiveTextSecondary ">
              {lang === 'en'
                ? 'Commission data will be available once the calculations are completed. Please check back later.'
                : 'ستتوفر بيانات العمولة بمجرد اكتمال عملية الحساب. يرجى العودة لاحقًا.'}
            </div>
            {/**Got it */}

            <div className="w-full flex items-center justify-end    ">
              <button
                onClick={closeDropDown}
                className="py-1.5 px-3 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-medium text-sm transition-all duration-200 cursor-pointer"
              >
                {lang === 'en' ? 'Got it' : 'حسنا'}
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>,

    document.body,
  );
};

export default CommissionPopUp;

import React from 'react';
import loader from '../../assets/loader.svg';
import { useLanguage } from '../../context/LanguageContext';
import ReactDom from 'react-dom';
const FullScreenLoader = () => {
  const { lang } = useLanguage();
  return ReactDom.createPortal(
    <div className="w-screen min-h-dvh h-dvh z-[9999] bg-[#f9fafb] fixed inset-0 flex flex-col justify-center items-center overflow-x-hidden gap-2.5">
      <img src={loader} alt="loader" className="w-48 h-48" />
      <h1 className="text-balance font-semibold text-primary-text font-rubik tracking-wide">
        {lang === 'en'
          ? 'Launching the app, please wait...'
          : 'ألرجاء جاري تشغيل التطبيق، الرجاء الانتظار...'}
      </h1>
    </div>,
    document.body,
  );
};

export default FullScreenLoader;

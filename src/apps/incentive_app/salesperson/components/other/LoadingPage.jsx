import React from 'react';
import { MdInsertChart } from 'react-icons/md';
import { useLanguage } from '../../../../../context/LanguageContext';
import ReactDom from 'react-dom';
const LoadingPage = () => {
  const { lang } = useLanguage();
  return ReactDom.createPortal(
    <div className="w-screen h-dvh bg-white flex flex-col justify-center items-center gap-2 p-6">
      <MdInsertChart size={80} className="animate-pulse text-blue-700" />
      <h1 className="text font-outfit font-semibold tracking-wide text-center">
        {lang === 'en'
          ? 'Please wait. We are preparing your data'
          : 'يرجى الانتظار. نحن نقوم بتحضير بياناتك'}
      </h1>
    </div>,
    document.body,
  );
};

export default LoadingPage;

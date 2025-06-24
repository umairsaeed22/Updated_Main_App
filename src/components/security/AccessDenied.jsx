import React from 'react';
import forbiddenImage from '../../assets/forbidden.svg';
import { useLanguage } from '../../context/LanguageContext';
import { useNavigate } from 'react-router-dom';
const AccessDenied = () => {
  const { lang } = useLanguage();
  const navigate = useNavigate();
  return (
    <div className="w-screen h-dvh min-h-dvh overflow-x-hidden flex flex-col justify-center items-center px-4 gap-4">
      <img
        src={forbiddenImage}
        alt="forbidden-Image"
        loading="lazy"
        className="w-80 h-80"
      />
      <h1 className="font-inter text-base  text-primary-text text-center">
        {lang === 'en'
          ? 'You do not have permission to access this page. Please contact your system administrator if you believe this is a mistake'
          : 'لا تملك الصلاحيات للوصول إلى هذه الصفحة. يرجى التواصل مع مسؤول النظام إذا كنت تعتقد أن هذا خطأ'}
      </h1>
      <button
        onClick={() => navigate('/mainDashboard')}
        className="py-2 px-5 rounded-lg bg-blue-600 hover:bg-blue-700 transition-all duration-200 cursor-pointer text-white text-sm font-medium"
      >
        {lang === 'en' ? 'Got it' : 'حسنا'}
      </button>
    </div>
  );
};

export default AccessDenied;

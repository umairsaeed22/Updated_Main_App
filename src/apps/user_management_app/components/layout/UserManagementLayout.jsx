import React, { useState } from 'react';
import { useLanguage } from '../../../../context/LanguageContext';
import { Outlet, useLocation } from 'react-router-dom';
import Sidebar from '../sidebar/Sidebar';
import Header from '../header/Header';

const UserManagementLayout = () => {
  const { lang } = useLanguage();
  const location = useLocation();

  return (
    <div className="w-screen min-h-dvh h-dvh overflow-x-hidden bg-neutral-100  flex  ">
      {/**Side bar */}

      <div className="w-64 h-full overflow-y-auto lg:block hidden">
        <Sidebar />
      </div>

      <div className="flex-1 lg:p-4 overflow-hidden">
        <div className="w-full h-full rounded-lg bg-neutral-50 border border-border shadow-sm shadow-neutral-200 flex flex-col  ">
          {/**Header */}
          <div className="w-full h-10 border-b border-border shrink-0 ">
            <Header />
          </div>
          {/**Main */}
          <div className="flex-1 overflow-y-auto  ">
            <Outlet />
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserManagementLayout;

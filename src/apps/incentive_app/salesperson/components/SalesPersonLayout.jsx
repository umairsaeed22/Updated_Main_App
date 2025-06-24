import React, { useEffect, useRef, useState } from 'react';
import { Outlet } from 'react-router-dom';
import { useLanguage } from '../../../../context/LanguageContext';

import AvatarMenu from './header/AvatarMenu';
import useDropdownStore from '../../store/useDropdownStore';
import Header from './header/Header';
import SideBar from './sidebar/SideBar';
import MobileSidebar from './sidebar/MobileSidebar';
import MonthPicker from './shared/MonthPicker';
import useDateStore from '../../store/useDateStore';
import { useQuery } from '@tanstack/react-query';
import { getSalespersonData } from '../api/salesperson';
import useSalespersonDataStore from '../../store/useSalespersonDataStore';
import LoadingPage from './other/LoadingPage';
const SalesPersonLayout = () => {
  const [isSidebarFullView, setIsSidebarFullView] = useState(false);
  const [isMobileBarOpen, setIsMobilebarOpen] = useState(false);

  const dropDownRef = useRef(null);
  const monthPickerRef = useRef(null);
  const { lang } = useLanguage();
  const { openDropDown, closeDropDown } = useDropdownStore();
  const { selectedMonthYear } = useDateStore();
  const { setSalespersonData, setLoading, setError } =
    useSalespersonDataStore();

  const { data, isLoading, error } = useQuery({
    queryKey: ['SALESPERSON_DATA', selectedMonthYear],
    queryFn: () => getSalespersonData(selectedMonthYear),
    retry: 0,
  });

  useEffect(() => {
    if (isLoading) {
      setLoading();
    } else if (error) {
      setError(error);
    } else if (data) {
      setSalespersonData(data);
    }
  }, [data, isLoading, error, setSalespersonData, setError, setLoading]);
  useEffect(() => {
    const handleClickOutside = (e) => {
      const clickedOutsideDropdown =
        dropDownRef.current && !dropDownRef.current.contains(e.target);
      const clickedOutsideMonthPicker =
        monthPickerRef.current && !monthPickerRef.current.contains(e.target);

      if (openDropDown === 'avatarMenu' && clickedOutsideDropdown) {
        closeDropDown();
      }

      if (openDropDown === 'monthPicker' && clickedOutsideMonthPicker) {
        closeDropDown();
      }
    };

    if (openDropDown) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [openDropDown, closeDropDown]);

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

  const handleFullViewSidebar = () => {
    setIsSidebarFullView(!isSidebarFullView);
  };

  const handleToggleMobileSideBar = () => {
    setIsMobilebarOpen(true);
  };

  const handleCloseMobileSideBar = () => {
    setIsMobilebarOpen(false);
  };
  if (isLoading) {
    return <LoadingPage />;
  }
  return (
    <div className="w-screen min-h-dvh h-dvh overflow-x-hidden  flex ">
      {/**Sidebar */}
      <div
        className={`${
          isSidebarFullView ? 'w-64' : 'w-16'
        } h-full bg-white hidden lg:block overflow-y-auto ${
          lang === 'en' ? 'border-r' : 'border-l'
        } border-incentiveBorder`}
      >
        <SideBar
          onOpen={handleFullViewSidebar}
          isSidebarFullView={isSidebarFullView}
        />
      </div>

      {/**Header & Dashboard */}

      <div className="flex-1 flex flex-col overflow-hidden h-dvh">
        {/**Header */}
        <div className="relative w-full flex flex-col border-b border-incentiveBorder bg-white lg:px-6 px-4 ">
          <Header openMobileBar={handleToggleMobileSideBar} />
          <div ref={dropDownRef}>
            <AvatarMenu />
          </div>
          <div ref={monthPickerRef}>
            <MonthPicker />
          </div>
        </div>
        {/**Dashboard */}
        <div className="flex-1 overflow-y-auto">
          <Outlet />
        </div>
      </div>
      {/**Mobile sidebar */}
      {isMobileBarOpen && (
        <div className="w-full h-full bg-black/50 fixed inset-0 z-50">
          <div className="w-72 h-full bg-white  overflow-y-auto  ">
            <MobileSidebar onClose={handleCloseMobileSideBar} />
          </div>
        </div>
      )}
    </div>
  );
};

export default SalesPersonLayout;

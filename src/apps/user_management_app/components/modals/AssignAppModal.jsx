import React, { useState } from 'react';
import ReactDom from 'react-dom';
import { IoClose } from 'react-icons/io5';
import { useLanguage } from '../../../../context/LanguageContext';
import useUserManagementModalStore from '../../store/useUserManagementModalStore';
import useUserManagementUsersInfoStore from '../../store/useUserManagementUsersInfoStore';
import useUserManagementAppsStore from '../../store/useUserManagementAppsStore';

const AssignAppModal = () => {
  const { selectedModal, setSelectedModal } = useUserManagementModalStore();
  const { userInfo } = useUserManagementUsersInfoStore();
  const { availableApps, departmentName, departmentCode } =
    useUserManagementAppsStore();
  const { lang } = useLanguage();

  if (selectedModal !== 'assignAppModal') return null;

  return ReactDom.createPortal(
    <div className="w-full h-full fixed inset-0 z-50 bg-black/60 flex items-center justify-center sm:p-4">
      <div className="w-full h-full sm:max-w-3xl sm:h-[600px] bg-white sm:rounded-lg sm:shadow-lg flex flex-col overflow-hidden">
        {/* Header */}
        <div className="w-full flex items-center justify-between p-4 border-b border-border">
          <h1 className="text-primary-text font-semibold">
            {lang === 'en' ? 'Assign Apps to User' : 'تعيين التطبيقات للمستخدم'}
          </h1>
          <button
            onClick={() => setSelectedModal(null)}
            className="text-secondary-text hover:text-primary-text"
          >
            <IoClose size={24} />
          </button>
        </div>
      </div>
    </div>,
    document.body,
  );
};

export default AssignAppModal;

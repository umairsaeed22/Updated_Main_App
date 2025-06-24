import React from 'react';
import { useLanguage } from '../../../context/LanguageContext';
import UsersOverviewTable from '../components/table/UsersOverviewTable';
import ViewAppsModal from '../components/modals/ViewAppsModal';
import AssignAppModal from '../components/modals/AssignAppModal';

const UserManagementMain = () => {
  const { lang } = useLanguage();
  return (
    <div className="w-full h-full flex flex-col lg:p-8 p-4 gap-6">
      {/**Title */}
      <div className="w-full flex flex-col gap-[1px]">
        <h1 className="text-primary-text font-semibold text-lg font-outfit">
          {lang === 'en' ? 'Users Overview' : 'نظرة عامة عن المستخدمين'}
        </h1>
        <p className="text-[0.80rem] text-secondary-text text-wrap">
          {lang === 'en'
            ? 'View and manage users, assign applications, and control access levels'
            : 'عرض وإدارة المستخدمين، وتعيين التطبيقات، والتحكم في مستويات الوصول'}
        </p>
      </div>
      {/**Table */}
      <div className="flex-1">
        <UsersOverviewTable />
      </div>
      <ViewAppsModal />
      <AssignAppModal />
    </div>
  );
};

export default UserManagementMain;

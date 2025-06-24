import React from 'react';
import ReactDom from 'react-dom';
import useUserManagementModalStore from '../../store/useUserManagementModalStore';
import useUserManagementUsersInfoStore from '../../store/useUserManagementUsersInfoStore';
import { useLanguage } from '../../../../context/LanguageContext';
import { IoMapOutline } from 'react-icons/io5';
import { TiLocationOutline } from 'react-icons/ti';
import { HiOutlineOfficeBuilding } from 'react-icons/hi';
import { MdOutlineWorkOutline } from 'react-icons/md';
import { GrAppsRounded } from 'react-icons/gr';

const ViewAppsModal = () => {
  const { selectedModal, setSelectedModal } = useUserManagementModalStore();
  const { userInfo, resetUserInfo } = useUserManagementUsersInfoStore();
  const { lang } = useLanguage();

  const handleCloseModal = () => {
    setSelectedModal(null);
    resetUserInfo();
  };
  if (selectedModal !== 'userAppsModal') return null;

  return ReactDom.createPortal(
    <div className="w-full h-full fixed inset-0 z-50 bg-black/60 flex items-center justify-center sm:p-4">
      <div className="w-full h-full sm:max-w-3xl sm:h-[520px] bg-white sm:rounded-lg sm:shadow-lg flex flex-col overflow-hidden">
        {/* Main content */}
        <div className="flex-1 grid grid-cols-1 sm:grid-cols-3 overflow-hidden">
          {/* User Info */}
          <div className="col-span-1 border-r border-border p-6 flex flex-col items-center bg-gray-50">
            {/* Avatar */}
            <div className="w-24 h-24 rounded-full overflow-hidden border-2 border-gray-300">
              <img
                src={userInfo.imageURL}
                alt="User Avatar"
                className="w-full h-full object-cover"
              />
            </div>

            {/* Name + File */}
            <div className="text-center mt-2">
              <h2 className="text-base font-semibold text-primary-text">
                {userInfo.name[lang]}
              </h2>
              <p className="text-[0.80rem] text-secondary-text">
                {lang === 'en' ? 'File No.' : 'رقم الملف'}:{' '}
                {userInfo.fileNumber}
              </p>
            </div>

            {/* Other Info */}
            <div className="w-full flex flex-col mt-10 gap-6 text-[0.80rem] text-secondary-text leading-[18px]">
              {/* Region */}
              <div className="flex items-start gap-3 border-b border-border pb-2">
                <span className="p-2 rounded-lg ring-1 ring-neutral-400 text-secondary-text">
                  <IoMapOutline size={16} />
                </span>
                <div className="flex flex-col">
                  <span>{lang === 'en' ? 'Region' : 'المنطقة'}</span>
                  <span className="text-primary-text text-[0.820rem]">
                    {userInfo.region[lang]}
                  </span>
                </div>
              </div>

              {/* Location */}
              <div className="flex items-start gap-3 border-b border-border pb-2">
                <span className="p-2 rounded-lg ring-1 ring-neutral-400 text-secondary-text">
                  <TiLocationOutline size={16} />
                </span>
                <div className="flex flex-col">
                  <span>{lang === 'en' ? 'Location' : 'الموقع'}</span>
                  <span className="text-primary-text text-[0.820rem]">
                    {userInfo.location[lang]}
                  </span>
                </div>
              </div>

              {/* Department */}
              <div className="flex items-start gap-3 border-b border-border pb-2">
                <span className="p-2 rounded-lg ring-1 ring-neutral-400 text-secondary-text">
                  <HiOutlineOfficeBuilding size={16} />
                </span>
                <div className="flex flex-col">
                  <span>{lang === 'en' ? 'Department' : 'القسم'}</span>
                  <span className="text-primary-text text-[0.820rem]">
                    {userInfo.department[lang]}
                  </span>
                </div>
              </div>

              {/* Position */}
              <div className="flex items-start gap-3 pb-2">
                <span className="p-2 rounded-lg ring-1 ring-neutral-400 text-secondary-text">
                  <MdOutlineWorkOutline size={16} />
                </span>
                <div className="flex flex-col">
                  <span>{lang === 'en' ? 'Position' : 'المنصب'}</span>
                  <span className="text-primary-text text-[0.820rem]">
                    {userInfo.position[lang]}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Apps List */}
          <div className="col-span-2 p-6 bg-white overflow-y-auto">
            <h3 className="text-base font-semibold text-primary-text flex items-center gap-2 mb-4">
              <GrAppsRounded size={18} />
              {lang === 'en' ? 'Assigned Apps' : 'التطبيقات المعينة'}
            </h3>

            {userInfo.apps?.length > 0 ? (
              <div className="flex flex-col gap-4">
                {userInfo.apps.map((app) => (
                  <div
                    key={app.appId}
                    className="border border-border rounded-lg p-4 shadow-sm hover:shadow transition-shadow"
                  >
                    <div className="flex justify-between items-center mb-2">
                      <div className="flex items-center gap-2 font-semibold text-sm text-primary-text">
                        <GrAppsRounded size={16} />
                        <span>{app.appName[lang]}</span>
                      </div>
                    </div>
                    <div className="flex justify-between text-[0.82rem] border-t border-border pt-2 text-secondary-text">
                      <span>{lang === 'en' ? 'App ID' : 'معرف التطبيق'}</span>
                      <span className="text-primary-text">{app.appId}</span>
                    </div>
                    <div className="flex justify-between text-[0.82rem] mt-2 text-secondary-text">
                      <span>{lang === 'en' ? 'App role' : 'الدور'}</span>
                      <span className="text-primary-text">{app.appRole}</span>
                    </div>
                    <div className="flex justify-between text-[0.82rem] text-secondary-text mt-2">
                      <span>
                        {lang === 'en' ? 'Access Level' : 'مستوى الوصول'}
                      </span>
                      <span className="text-primary-text">{app.appAccess}</span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-secondary-text mt-4">
                {lang === 'en' ? 'No apps assigned' : 'لا توجد تطبيقات معينة'}
              </p>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="h-12 border-t border-border flex items-center justify-end px-4 bg-gray-50">
          <button
            onClick={handleCloseModal}
            className="text-sm font-medium text-primary-text hover:underline cursor-pointer"
          >
            {lang === 'en' ? 'Close' : 'إغلاق'}
          </button>
        </div>
      </div>
    </div>,
    document.body,
  );
};

export default ViewAppsModal;

import React, { useEffect, useRef, useState } from 'react';
import { useLanguage } from '../../../../context/LanguageContext';
import { MdOutlineKeyboardArrowLeft } from 'react-icons/md';
import { MdOutlineKeyboardArrowRight } from 'react-icons/md';
import { CiSearch } from 'react-icons/ci';
import { MdOutlineKeyboardArrowDown } from 'react-icons/md';
import useClickOutside from '../../../../hooks/useClickOutside';

import { MdOutlineRemoveRedEye } from 'react-icons/md';
import { TbApps } from 'react-icons/tb';
import useUserManagementMenuStore from '../../store/useUserManagementMenuStore';
import useUserManagementModalStore from '../../store/useUserManagementModalStore';
import useUserManagementUsersInfoStore from '../../store/useUserManagementUsersInfoStore';
import { userData } from '../../mock/index';
import useUserManagementAppsStore from '../../store/useUserManagementAppsStore';
const UsersOverviewTable = () => {
  const { lang } = useLanguage();
  const { selectedMenu, setSelectedMenu } = useUserManagementMenuStore();
  const { setSelectedModal } = useUserManagementModalStore();
  const { setUserInfo } = useUserManagementUsersInfoStore();
  const { setAvailableApps } = useUserManagementAppsStore();
  const toggleRegionRef = useRef(null);
  const regionMenuRef = useRef(null);
  const toggleLocationRef = useRef(null);
  const locationMenuRef = useRef(null);
  const [selectedRegion, setSelectedRegion] = useState({
    regionCode: null,
    regionName: '',
  });
  const [selectedLocation, setSelectedLocation] = useState({
    locationCode: null,
    locationName: '',
  });
  const [selectedDepartmentId, setSelectedDepartmentId] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');

  useClickOutside(
    [toggleRegionRef, toggleLocationRef, regionMenuRef, locationMenuRef],
    () => setSelectedMenu(null),
  );

  const getRegions = userData?.regions.map((region) => ({
    regionCode: region.regionCode,
    regionName: region.regionName,
  }));

  const getLocations = userData?.regions
    ?.filter((region) => region.regionCode === selectedRegion.regionCode)
    .flatMap((location) => location.locations);

  const handleStoreSelectedRegion = (id, name) => {
    setSelectedRegion({
      regionCode: id || null,
      regionName: name || '',
    });
    setSelectedMenu(null);
  };
  const handleStoreSelectedLocation = (id, name) => {
    setSelectedLocation({
      locationCode: id || null,
      locationName: name || '',
    });
    setSelectedMenu(null);
  };

  const regionLabel =
    selectedRegion?.regionName?.[lang] ??
    (lang === 'en' ? 'Region' : 'المنطقة');

  const locationLabel =
    selectedLocation.locationName?.[lang] ??
    (lang === 'en' ? 'Location' : 'الموقع');

  useEffect(() => {
    setSelectedLocation({
      locationCode: null,
      locationName: '',
    });
  }, [selectedRegion]);

  const filteredEmployees =
    selectedRegion.regionCode && selectedLocation.locationCode
      ? userData.regions
          .filter((region) => region.regionCode === selectedRegion.regionCode)
          .flatMap((region) =>
            region.locations
              .filter(
                (location) =>
                  location.locationCode === selectedLocation.locationCode,
              )
              .flatMap((location) =>
                location.departments
                  .filter(
                    (department) =>
                      !selectedDepartmentId ||
                      department.departmentCode === selectedDepartmentId,
                  )
                  .flatMap((department) =>
                    department.employees.map((emp) => ({
                      ...emp,
                      departmentCode: department.departmentCode,
                      departmenName: department.departmentName,
                      regionName: region.regionName,
                      locationName: location.name,
                    })),
                  ),
              ),
          )
          .filter((emp) => {
            const search = searchQuery.toLowerCase();
            const fullName = emp.name[lang].toLowerCase();
            const fileNum = emp.fileNumber.toLowerCase();
            return fullName.includes(search) || fileNum.includes(search);
          })
      : [];
  console.log(userData);
  return (
    <div className="w-full h-full flex flex-col">
      {/**Table */}
      <div className="w-full h-[550px] gap-2  flex flex-col">
        {/**Upper buttons */}
        <div className="w-full   flex items-center justify-end gap-4 flex-wrap relative">
          {/**search */}
          <div
            className={`md:w-[50%] sm:w-[60%] w-full py-1.5 px-3 rounded-lg border border-neutral-300  flex items-center  ${
              lang === 'en' ? 'mr-auto' : 'ml-auto'
            }`}
          >
            <input
              type="text"
              name="searchQuery"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={
                lang === 'en'
                  ? 'search by name or file number'
                  : 'البحث بواسطة الإسم او رقم الملف'
              }
              className={`w-full outline-0 text-[0.820rem] ${
                lang === 'en' ? 'pl-6' : 'pr-6'
              }`}
            />
            <CiSearch size={16} className="absolute z-20" />
          </div>
          <div className="relative sm:w-24 w-full">
            <button
              ref={toggleRegionRef}
              onClick={() =>
                setSelectedMenu(
                  selectedMenu === 'regionMenu' ? null : 'regionMenu',
                )
              }
              className="flex items-center justify-between w-full py-1.5 px-3 border border-neutral-300 rounded-lg   text-secondary-text hover:text-primary-text cursor-pointer text-[0.820rem] "
            >
              {regionLabel}
              <MdOutlineKeyboardArrowDown
                size={14}
                className={`transition-all duration-300 ${
                  selectedMenu === 'regionMenu' ? 'rotate-180' : ''
                }`}
              />
            </button>

            {selectedMenu === 'regionMenu' && (
              <div
                ref={regionMenuRef}
                className={`absolute z-30 w-full sm:w-44 bg-white h-fit rounded-lg border border-border shadow-sm shadow-neutral-200 top-full mt-1 p-2  ${
                  lang === 'en' ? 'sm:right-0' : 'sm:left-0'
                }`}
              >
                <ul className="w-full flex flex-col gap-0.5 ">
                  {getRegions.map((region) => (
                    <li
                      onClick={() =>
                        handleStoreSelectedRegion(
                          region?.regionCode,
                          region?.regionName,
                        )
                      }
                      key={region?.regionCode}
                      className={`py-1 px-2.5 rounded-lg hover:text-primary-text text-[0.820rem] hover:bg-gray-200 transition-all duration-300 cursor-pointer ${
                        selectedRegion.regionCode === region?.regionCode
                          ? 'bg-gray-200 text-primary-text'
                          : 'text-secondary-text'
                      }`}
                    >
                      {region?.regionName[lang]}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
          <div className="relative sm:min-w-24 sm:max-w-fit w-full">
            <button
              disabled={!selectedRegion.regionCode}
              ref={toggleLocationRef}
              onClick={() =>
                setSelectedMenu(
                  selectedMenu === 'locationMenu' ? null : 'locationMenu',
                )
              }
              className="flex items-center justify-between gap-4  w-full py-1.5 px-3 border border-neutral-300 rounded-lg   text-secondary-text hover:text-primary-text cursor-pointer text-[0.820rem] disabled:text-secondary-text disabled:cursor-not-allowed "
            >
              {locationLabel}
              <MdOutlineKeyboardArrowDown
                size={14}
                className={`transition-all duration-300 ${
                  selectedMenu === 'locationMenu' ? 'rotate-180' : ''
                }`}
              />
            </button>
            {selectedMenu === 'locationMenu' && (
              <div
                ref={locationMenuRef}
                className={`absolute z-30 w-full sm:w-44 bg-white h-fit rounded-lg border border-border shadow-sm shadow-neutral-200 top-full mt-1 p-2 ${
                  lang === 'en' ? 'sm:right-0' : 'sm:left-0'
                }`}
              >
                <ul className="w-full flex flex-col gap-0.5 ">
                  {getLocations.map((location) => (
                    <li
                      onClick={() =>
                        handleStoreSelectedLocation(
                          location?.locationCode,
                          location?.name,
                        )
                      }
                      key={location?.locationCode}
                      className={`py-1 px-2.5 rounded-lg hover:text-primary-text text-[0.820rem] hover:bg-gray-200 transition-all duration-300 cursor-pointer ${
                        selectedLocation.locationCode === location?.locationCode
                          ? 'bg-gray-200 text-primary-text'
                          : 'text-secondary-text'
                      }`}
                    >
                      {location?.name[lang]}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>
        {/**Table */}
        {filteredEmployees.length > 0 ? (
          <div className="flex flex-col mt-1 px-2 ">
            <div className="-m-1.5 overflow-x-auto">
              <div className="p-1.5 min-w-full inline-block align-middle border-t border-b border-border">
                <div className="overflow-hidden">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead>
                      <tr>
                        <th
                          scope="col"
                          className="px-6 py-3 text-start text-xs font-medium text-gray-500 uppercase"
                        >
                          {lang === 'en' ? '#FileNum' : '#رقم الملف'}
                        </th>
                        <th
                          scope="col"
                          className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase border-l border-r border-border"
                        >
                          {lang === 'en' ? 'Name' : 'الإسم'}
                        </th>
                        <th
                          scope="col"
                          className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase"
                        >
                          {lang === 'en' ? 'Department' : 'القسم'}
                        </th>
                        <th
                          scope="col"
                          className={`px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase ${
                            lang === 'en' ? 'border-l' : 'border-r'
                          } border-border`}
                        >
                          {lang === 'en' ? 'Position' : 'المنصب'}
                        </th>
                        <th
                          scope="col"
                          className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase border-l border-r border-border"
                        >
                          {lang === 'en' ? 'Apps count' : 'عدد التتطبيقات'}
                        </th>
                        <th
                          scope="col"
                          className="px-6 py-3 text-center text-xs whitespace-nowrap w-[1%] font-medium text-gray-500 uppercase"
                        >
                          {lang === 'en' ? 'Actions' : 'العمليات'}
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {filteredEmployees.map((emp, index) => (
                        <tr
                          className={`${
                            index % 2 !== 0 ? 'bg-neutral-100' : ''
                          }`}
                          key={emp?.fileNumber}
                        >
                          <td className="px-6 py-4 whitespace-nowrap text-[0.820rem] text-blue-700">
                            {emp?.fileNumber}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-[0.820rem] text-center font-medium text-gray-800 border-l border-r border-border">
                            <div className="flex items-center justify-center gap-2.5">
                              <span className="w-6 h-6 overflow-hidden rounded-full">
                                <img
                                  src={emp?.imageURL}
                                  alt="user-Image"
                                  className="w-full h-full object-cover"
                                />
                              </span>
                              {emp?.name[lang]}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-[0.820rem]  ">
                            <p className="py-1.5 px-2.5 rounded-2xl bg-yellow-50 text-yellow-800 w-fit mx-auto">
                              {' '}
                              {emp?.departmenName[lang]}{' '}
                            </p>
                          </td>
                          <td
                            className={`px-6 py-4 whitespace-nowrap text-[0.820rem] text-gray-800 ${
                              lang === 'en' ? 'border-l' : 'border-r'
                            } border-border `}
                          >
                            <p className="py-1.5 px-2.5 rounded-2xl bg-green-50 text-green-800 w-fit mx-auto">
                              {emp?.position[lang]}
                            </p>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-[0.820rem]  border-l border-r border-border">
                            <p className="py-1.5 px-2.5 rounded-2xl bg-blue-50-50 text-blue-800 font-bold w-fit mx-auto">
                              {emp?.apps?.length}
                            </p>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-end text-[0.820rem] ">
                            <div className="w-full  flex items-center gap-4 justify-end">
                              <button
                                onClick={() => {
                                  setSelectedModal('userAppsModal');
                                  setUserInfo({
                                    fileNumber: emp?.fileNumber,
                                    name: emp?.name,
                                    region: emp?.regionName,
                                    location: emp.locationName,
                                    imageURL: emp?.imageURL,
                                    department: emp?.departmenName,
                                    position: emp?.position,
                                    apps: emp?.apps,
                                  });
                                }}
                                className="flex items-center gap-2  text-gray-500  hover:text-gray-800 cursor-pointer py-2 px-4 rounded-lg hover:bg-neutral-200 border border-border"
                              >
                                <MdOutlineRemoveRedEye size={16} />{' '}
                                {lang === 'en' ? 'View apps' : 'اعرض التطبيقات'}
                              </button>
                              <button
                                onClick={() => {
                                  setSelectedModal('assignAppModal');

                                  const selectedRegionData =
                                    userData.regions.find(
                                      (region) =>
                                        region.regionCode ===
                                        selectedRegion.regionCode,
                                    );

                                  const selectedLocationData =
                                    selectedRegionData?.locations.find(
                                      (loc) =>
                                        loc.locationCode ===
                                        selectedLocation.locationCode,
                                    );

                                  const department =
                                    selectedLocationData?.departments.find(
                                      (dept) =>
                                        dept.departmentCode ===
                                        emp.departmentCode,
                                    );

                                  setAvailableApps({
                                    apps: department?.availableApps || [],
                                    name: department?.departmentName || '',
                                    code: department?.departmentCode || '',
                                  });

                                  setUserInfo({
                                    fileNumber: emp?.fileNumber,
                                    name: emp?.name,
                                    imageURL: emp?.imageURL,
                                    department: emp?.departmenName,
                                    departmentCode: emp?.departmentCode,
                                    position: emp?.position,
                                    apps: emp?.apps,
                                  });
                                }}
                                className="flex items-center gap-2  text-gray-500  hover:text-blue-800 cursor-pointer py-2 px-4 rounded-lg hover:bg-blue-50 border border-border"
                              >
                                <TbApps size={16} />{' '}
                                {lang === 'en'
                                  ? 'Assign apps'
                                  : 'تعيين التطبيقات'}
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="flex-1 flex justify-center items-center text-secondary-text w-full text-center text-wrap text-[0.820rem]">
            {lang === 'en'
              ? 'There are no results found!'
              : 'لا يوجد اي نتائج متاحة'}
          </div>
        )}
      </div>

      {/**Pagination */}
      <div className="flex-1 flex items-center justify-between p-2  ">
        {/**Found */}
        <p className="text-secondary-text text-[0.8rem]">
          10{' '}
          <span>{lang === 'en' ? 'Results found from ' : ' عثر عليها من'}</span>
          220
        </p>
        {/**Paginations */}
        <div className="flex items-center gap-2">
          {/* Previous button */}
          <button className="p-1 rounded-lg border border-border shadow-sm shadow-neutral-200 cursor-pointer hover:bg-neutral-50">
            <MdOutlineKeyboardArrowLeft
              size={14}
              className={`${lang === 'ar' && 'rotate-180'}`}
            />
          </button>

          {/* Page numbers */}
          <div className="flex items-center gap-1.5 ">
            {Array.from({ length: 3 }).map((_, index) => (
              <button
                key={index}
                className="p-1  cursor-pointer  text-xs flex items-center justify-center"
              >
                {index + 1}
              </button>
            ))}
          </div>
          {/* Next button */}
          <button className="p-1 rounded-lg border border-border shadow-sm shadow-neutral-200 cursor-pointer hover:bg-neutral-50">
            <MdOutlineKeyboardArrowRight
              size={14}
              className={`${lang === 'ar' && 'rotate-180'}`}
            />
          </button>
        </div>
      </div>
    </div>
  );
};

export default UsersOverviewTable;

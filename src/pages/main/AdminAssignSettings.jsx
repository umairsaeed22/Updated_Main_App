import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useTheme } from '../../context/ThemeContext';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../../context/LanguageContext';

const mockAssignData = [
  //First Area
  {
    areaCode: 'R111',
    areaName: {
      en: 'Riyadh',
      ar: 'الرياض',
    },

    stores: [
      {
        storeCode: 'S111',
        storeName: {
          en: 'SACO ALTAKHASUSI',
          ar: 'ساكو التخصصي',
        },

        departments: [
          //First Department
          {
            departmentCode: 'D111',
            departmentName: {
              en: 'Outdoor & Garden',
              ar: 'الاماكن الخارجية و الحدائق',
            },

            employees: [
              {
                fileNumber: 'RSD111',
                name: {
                  en: 'Andrew Peter',
                  ar: 'اندرو بيتر',
                },
              },
              {
                fileNumber: 'RSD112',
                name: {
                  en: 'Ali Khaled',
                  ar: 'علي خالد',
                },
              },
            ],
          },

          //Second Department

          {
            departmentCode: 'D112',
            departmentName: {
              en: 'Tools & Hardware',
              ar: 'العدد و الادوات',
            },

            employees: [
              {
                fileNumber: 'RSD121',
                name: {
                  en: 'Sarah Ahmed',
                  ar: 'سارة احمد',
                },
              },
              {
                fileNumber: 'RSD122',
                name: {
                  en: 'Martin Doe',
                  ar: 'مارتن دو',
                },
              },
            ],
          },
        ],
      },

      // Second Store

      {
        storeCode: 'S211',
        storeName: {
          en: 'SACO AL-Mursalat',
          ar: 'ساكو المرسلات',
        },

        departments: [
          //First Department
          {
            departmentCode: 'D211',
            departmentName: {
              en: 'Outdoor & Garden',
              ar: 'الاماكن الخارجية و الحدائق',
            },

            employees: [
              {
                fileNumber: 'RSD211',
                name: {
                  en: 'Andrew Peter',
                  ar: 'اندرو بيتر',
                },
              },
              {
                fileNumber: 'RSD212',
                name: {
                  en: 'Ali Khaled',
                  ar: 'علي خالد',
                },
              },
            ],
          },

          //Second Department

          {
            departmentCode: 'D212',
            departmentName: {
              en: 'Tools & Hardware',
              ar: 'العدد و الادوات',
            },

            employees: [
              {
                fileNumber: 'RSD221',
                name: {
                  en: 'Sarah Ahmed',
                  ar: 'سارة احمد',
                },
              },
              {
                fileNumber: 'RSD222',
                name: {
                  en: 'Martin Doe',
                  ar: 'مارتن دو',
                },
              },
            ],
          },
        ],
      },
    ],
  },
  //Second Area

  {
    areaCode: 'R311',
    areaName: {
      en: 'Jeddah',
      ar: 'جده',
    },

    stores: [
      {
        storeCode: 'S311',
        storeName: {
          en: 'SACO Tahlia',
          ar: 'ساكو التحلية',
        },

        departments: [
          //First Department
          {
            departmentCode: 'D311',
            departmentName: {
              en: 'Outdoor & Garden',
              ar: 'الاماكن الخارجية و الحدائق',
            },

            employees: [
              {
                fileNumber: 'RSD311',
                name: {
                  en: 'Andrew Peter',
                  ar: 'اندرو بيتر',
                },
              },
              {
                fileNumber: 'RSD312',
                name: {
                  en: 'Ali Khaled',
                  ar: 'علي خالد',
                },
              },
            ],
          },

          //Second Department

          {
            departmentCode: 'D312',
            departmentName: {
              en: 'Tools & Hardware',
              ar: 'العدد و الادوات',
            },

            employees: [
              {
                fileNumber: 'RSD321',
                name: {
                  en: 'Sarah Ahmed',
                  ar: 'سارة احمد',
                },
              },
              {
                fileNumber: 'RSD322',
                name: {
                  en: 'Martin Doe',
                  ar: 'مارتن دو',
                },
              },
            ],
          },
        ],
      },

      // Second Store

      {
        storeCode: 'S312',
        storeName: {
          en: 'SACO Alandalus',
          ar: 'ساكو الاندلس',
        },

        departments: [
          //First Department
          {
            departmentCode: 'D231',
            departmentName: {
              en: 'Outdoor & Garden',
              ar: 'الاماكن الخارجية و الحدائق',
            },

            employees: [
              {
                fileNumber: 'RSD231',
                name: {
                  en: 'Andrew Peter',
                  ar: 'اندرو بيتر',
                },
              },
              {
                fileNumber: 'RSD232',
                name: {
                  en: 'Ali Khaled',
                  ar: 'علي خالد',
                },
              },
            ],
          },

          //Second Department

          {
            departmentCode: 'D214',
            departmentName: {
              en: 'Tools & Hardware',
              ar: 'العدد و الادوات',
            },

            employees: [
              {
                fileNumber: 'RSD224',
                name: {
                  en: 'Sarah Ahmed',
                  ar: 'سارة احمد',
                },
              },
              {
                fileNumber: 'RSD224',
                name: {
                  en: 'Martin Doe',
                  ar: 'مارتن دو',
                },
              },
            ],
          },
        ],
      },
    ],
  },
];

const mockApps = [
  {
    appId: 'si0012',
    appName: {
      en: 'Sales incentive',
      ar: 'حوافز المبيعات',
    },
    availableRoles: [
      {
        roleId: 'sp102102',
        roleName: 'salesperson',
      },
      {
        roleId: 'sm202102',
        roleName: 'store manager',
      },
      {
        roleId: 'ni302102',
        roleName: 'non-incentive',
      },
    ],

    availableModules: [
      {
        moduleId: '123',
        moduleName: 'track personal incentive',
        moduleOptions: [
          { optionLevel: 'FullAcess' },
          { optionLevel: 'ReadOnly' },
          { optionLevel: 'Hidden' },
        ],
      },
      {
        moduleId: '124',
        moduleName: 'Assigne incentive',
        moduleOptions: [
          { optionLevel: 'FullAcess' },
          { optionLevel: 'ReadOnly' },
          { optionLevel: 'Hidden' },
        ],
      },
    ],
  },

  {
    appId: 'sm0013',
    appName: {
      en: 'Serial number',
      ar: 'الرقم التسلسلي',
    },
    availableRoles: [
      {
        roleId: 'te102103',
        roleName: 'technician',
      },
      {
        roleId: 'sm202103',
        roleName: 'store manager',
      },
    ],

    availableModules: [
      {
        moduleId: '125',
        moduleName: 'Register serial numbers',
        moduleOptions: [
          { optionLevel: 'FullAcess' },
          { optionLevel: 'ReadOnly' },
          { optionLevel: 'Hidden' },
        ],
      },
      {
        moduleId: '126',
        moduleName: 'Report missing',
        moduleOptions: [
          { optionLevel: 'FullAcess' },
          { optionLevel: 'ReadOnly' },
          { optionLevel: 'Hidden' },
        ],
      },
    ],
  },
];

const AdminAssignSettings = () => {
  const { t } = useTranslation('mainDashboardSettings');
  const { theme } = useTheme();
  const { lang } = useLanguage();
  const [adminSelects, setAdminSelects] = useState({
    area: null,
    store: null,
    department: null,
    employeeFileNumber: null,
    applicationId: null,
    roleId: '',
    modules: [{ moduleId: '', accessLevel: '' }],
  });

  const handleChange = (e) => {
    const { name, value } = e.target;

    setAdminSelects((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const [fileSearching, setFileSearching] = useState(false);
  const [fileFound, setFileFound] = useState(false);

  const navigate = useNavigate();

  const selectedAreaStores = mockAssignData.filter((selectedArea) => {
    return selectedArea.areaCode === adminSelects.area;
  });

  const seletedStoreDepartments = selectedAreaStores[0]?.stores?.find(
    (store) => store.storeCode === adminSelects.store,
  );
  const seletedDepartmentEmployees = seletedStoreDepartments?.departments?.find(
    (department) => department.departmentCode === adminSelects.department,
  );

  const selectedAppRoles = mockApps.find(
    (app) => app.appId === adminSelects.applicationId,
  );

  const canAddModule =
    adminSelects.roleId &&
    adminSelects.modules.length < selectedAppRoles?.availableModules?.length &&
    adminSelects.modules[adminSelects.modules.length - 1]?.moduleId &&
    adminSelects.modules[adminSelects.modules.length - 1]?.accessLevel;

  console.log(adminSelects);

  return (
    <div className="w-full h-full bg-white/80 lg:p-6 p-4 flex flex-col overflow-x-hidden overflow-y-auto">
      <button
        onClick={() => navigate('/mainDashboard/settings')}
        className={`cursor-pointer  text-sm ${
          theme === 'orange'
            ? 'text-blue-600 hover:text-blue-700 hover:tracking-wide'
            : 'text-indigo-600 hover:text-indigo-700 hover:tracking-wide '
        }  transition-all duration-300 w-fit`}
      >
        {t('navigationBack')}
      </button>
      <h1 className="text-primary-text text-base font-semibold mt-4">
        {t('UserAccessSettingsTitle')}
      </h1>
      <p className="text-secondary-text text-sm mt-1 ">
        {t('UserAccessSettingsSubtitle')}
      </p>
      {/**Enter the file number if you know it */}
      <div className="w-full max-w-md p-2 mt-4 outline-0 relative bg-white border flex items-center border-gray-200 text-[0.820rem] text-primary-text rounded-md">
        <input
          type="text"
          placeholder={
            lang === 'en'
              ? 'Enter the employee file number '
              : 'أدخل رقم الملف للموظف'
          }
          value={adminSelects.employeeFileNumber || ''}
          disabled={fileFound}
          onChange={(e) => {
            const value = e.target.value.trim();
            setAdminSelects((prev) => ({
              ...prev,
              employeeFileNumber: value,
            }));
            setFileSearching(true);
            setFileFound(false);

            setTimeout(() => {
              let matched = false;
              for (const area of mockAssignData) {
                for (const store of area.stores) {
                  for (const dept of store.departments) {
                    const emp = dept.employees.find(
                      (e) => e.fileNumber.toLowerCase() === value.toLowerCase(),
                    );
                    if (emp) {
                      setAdminSelects((prev) => ({
                        ...prev,
                        area: area.areaCode,
                        store: store.storeCode,
                        department: dept.departmentCode,
                        employeeFileNumber: emp.fileNumber,
                      }));
                      setFileFound(true);
                      matched = true;
                      break;
                    }
                  }
                  if (matched) break;
                }
                if (matched) break;
              }
              setFileSearching(false);
              if (!matched)
                alert(
                  lang === 'en' ? 'Employee not found' : 'الموظف غير موجود',
                );
            }, 700);
          }}
          className="outline-0 w-full placeholder:text-incentiveTextPlaceholder disabled:opacity-50"
        />

        {fileSearching && (
          <div className="animate-spin border-2 border-gray-300 border-t-blue-500 rounded-full w-4 h-4 ml-2" />
        )}

        {fileFound && !fileSearching && (
          <button
            type="button"
            onClick={() => {
              setAdminSelects((prev) => ({
                ...prev,
                area: '',
                store: '',
                department: '',
                employeeFileNumber: '',
              }));
              setFileFound(false);
            }}
            className="text-xs text-red-500 underline ml-2"
          >
            {lang === 'en' ? 'Remove' : 'حذف'}
          </button>
        )}
      </div>

      <p className="max-w-md text-[0.820rem] text-green-600 font-semibold mt-4">
        {lang === 'en'
          ? 'Or you can manually filter and find a specific employee*'
          : 'أو يمكنك البحث عن موظف محدد بشكل يدوي*'}
      </p>
      <form action="" className="w-full max-w-md flex flex-col gap-2 mt-4">
        <select
          name="area"
          value={adminSelects.area || ''}
          disabled={fileFound}
          onChange={handleChange}
          className="w-full p-2 outline-0 bg-white border border-gray-200 text-[0.820rem] text-primary-text rounded-md disabled:bg-gray-200 disabled:text-gray-500 disabled:cursor-not-allowed"
        >
          <option value="">
            {lang === 'en' ? 'Select area' : 'إختر منطقة'}
          </option>
          {mockAssignData?.map((area) => (
            <option key={area.areaCode} value={area.areaCode}>
              {area.areaName[lang]}
            </option>
          ))}
        </select>
        <select
          name="store"
          value={adminSelects.store || ''}
          disabled={!adminSelects.area || fileFound}
          onChange={handleChange}
          className="w-full p-2 outline-0 bg-white border border-gray-200 text-[0.820rem] text-primary-text rounded-md disabled:bg-gray-200 disabled:text-gray-500 disabled:cursor-not-allowed"
        >
          <option value="">
            {lang === 'en' ? 'Select store' : 'إختر متجر'}
          </option>
          {selectedAreaStores[0]?.stores?.map((store) => (
            <option key={store.storeCode} value={store.storeCode}>
              {store.storeName[lang]}
            </option>
          ))}
        </select>
        <select
          name="department"
          value={adminSelects.department || ''}
          disabled={!adminSelects.store || fileFound}
          onChange={handleChange}
          className="w-full p-2 outline-0 bg-white border border-gray-200 text-[0.820rem] text-primary-text rounded-md disabled:bg-gray-200 disabled:text-gray-500 disabled:cursor-not-allowed"
        >
          <option value="">
            {lang === 'en' ? 'Select department' : 'إختر قسم'}
          </option>

          {seletedStoreDepartments?.departments?.map((department) => (
            <option
              key={department.departmentCode}
              value={department.departmentCode}
            >
              {department.departmentName[lang]}
            </option>
          ))}
        </select>
        <select
          name="employeeFileNumber"
          value={adminSelects.employeeFileNumber || ''}
          disabled={!adminSelects.department || fileFound}
          onChange={handleChange}
          className="w-full p-2 outline-0 bg-white border border-gray-200 text-[0.820rem] text-primary-text rounded-md disabled:bg-gray-200 disabled:text-gray-500 disabled:cursor-not-allowed"
        >
          <option value="">
            {lang === 'en' ? 'Select employee' : 'إختر موظف'}
          </option>

          {seletedDepartmentEmployees?.employees?.map((employee) => (
            <option
              key={employee.fileNumber}
              value={employee.fileNumber}
              className="flex items-center space-x-5"
            >
              {employee.fileNumber} - {employee.name[lang]}
            </option>
          ))}
        </select>
        <select
          name="applicationId"
          disabled={
            !adminSelects.employeeFileNumber ||
            adminSelects.employeeFileNumber === ''
          }
          value={adminSelects.applicationId || ''}
          onChange={handleChange}
          className="w-full p-2 outline-0 bg-white border border-gray-200 text-[0.820rem] text-primary-text rounded-md disabled:bg-gray-200 disabled:text-gray-500 disabled:cursor-not-allowed"
        >
          <option value="">
            {lang === 'en' ? 'Select application' : 'إختر تطبيق'}
          </option>

          {mockApps?.map((app) => (
            <option key={app.appId} value={app.appId}>
              {app.appName[lang]}
            </option>
          ))}
        </select>
        <select
          name="roleId"
          disabled={!adminSelects.applicationId}
          onChange={handleChange}
          className="w-full p-2 outline-0 bg-white border border-gray-200 text-[0.820rem] text-primary-text rounded-md disabled:bg-gray-200 disabled:text-gray-500 disabled:cursor-not-allowed"
        >
          <option value="">{lang === 'en' ? 'Select role' : 'إختر دور'}</option>

          {selectedAppRoles?.availableRoles?.map((role) => (
            <option key={role.roleId} value={role.roleId}>
              {role.roleName}
            </option>
          ))}
        </select>
        {adminSelects.modules.map((mod, index) => (
          <div
            key={index}
            className="w-full flex md:flex-row flex-col gap-2 items-center"
          >
            {/* Module select */}
            <select
              value={mod.moduleId}
              disabled={!adminSelects.roleId}
              onChange={(e) => {
                const updated = [...adminSelects.modules];
                updated[index].moduleId = e.target.value;
                setAdminSelects({ ...adminSelects, modules: updated });
              }}
              className="md:w-1/2 w-full p-2 outline-0 bg-white border border-gray-200 text-[0.820rem] text-primary-text rounded-md disabled:bg-gray-200 disabled:text-gray-500"
            >
              <option value="">
                {lang === 'en' ? 'Select module' : 'إختر وحدة'}
              </option>
              {selectedAppRoles?.availableModules
                .filter(
                  (m) =>
                    !adminSelects.modules.some(
                      (selectedMod, i) =>
                        selectedMod.moduleId === m.moduleId && i !== index,
                    ) || m.moduleId === mod.moduleId, // allow current selected one
                )
                .map((module) => (
                  <option key={module.moduleId} value={module.moduleId}>
                    {module.moduleName}
                  </option>
                ))}
            </select>

            {/* Access select */}
            <select
              value={mod.accessLevel}
              disabled={!mod.moduleId}
              onChange={(e) => {
                const updated = [...adminSelects.modules];
                updated[index].accessLevel = e.target.value;
                setAdminSelects({ ...adminSelects, modules: updated });
              }}
              className="md:w-1/2 w-full p-2 outline-0 bg-white border border-gray-200 text-[0.820rem] text-primary-text rounded-md disabled:bg-gray-200 disabled:text-gray-500"
            >
              <option value="">
                {lang === 'en' ? 'Access level' : 'مستوى الصلاحية'}
              </option>
              {selectedAppRoles?.availableModules
                .find((m) => m.moduleId === mod.moduleId)
                ?.moduleOptions.map((opt, i) => (
                  <option key={i} value={opt.optionLevel}>
                    {opt.optionLevel}
                  </option>
                ))}
            </select>

            {/* Remove button for extra modules only */}
            {index > 0 && (
              <button
                type="button"
                onClick={() => {
                  const updated = adminSelects.modules.filter(
                    (_, i) => i !== index,
                  );
                  setAdminSelects({ ...adminSelects, modules: updated });
                }}
                className="text-xs text-red-600 underline"
              >
                {lang === 'en' ? 'Remove' : 'حذف'}
              </button>
            )}
          </div>
        ))}

        {canAddModule && (
          <button
            type="button"
            className="mt-2 text-xs text-blue-600 underline"
            onClick={() =>
              setAdminSelects((prev) => ({
                ...prev,
                modules: [...prev.modules, { moduleId: '', accessLevel: '' }],
              }))
            }
          >
            {lang === 'en' ? 'Add another module' : 'إضافة وحدة أخرى'}
          </button>
        )}

        <button
          className={`p-2.5  text-white ${
            theme === 'orange'
              ? 'bg-orange-600 hover:bg-orange-700'
              : 'bg-button hover:bg-button-hover'
          } cursor-pointer font-rubik font-semibold text-sm rounded-md w-full mt-2`}
        >
          {lang === 'en' ? 'Review & submit' : 'المراجعة و التأكيد'}
        </button>
      </form>
    </div>
  );
};

export default AdminAssignSettings;

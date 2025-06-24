import { lazy, Suspense } from 'react';
import { LuChartNoAxesCombined } from 'react-icons/lu';
import { BiBarcodeReader } from 'react-icons/bi';
import { RiUserSettingsFill } from 'react-icons/ri';

// Dynamic imports
const SalespersonIncentiveCard = lazy(() =>
  import('../dynamic_apps_cards/SalespersonIncentiveCard'),
);
const StoreManagerIncentiveCard = lazy(() =>
  import('../dynamic_apps_cards/StoreManagerIncentiveCard'),
);
const UserManagementCard = lazy(() =>
  import('../dynamic_apps_cards/UserManagementCard'),
);
import ScannerMobileSerialCard from '../dynamic_apps_cards/ScannerMobileSerialCard';

export const appConfig = [
  // 🔧 Sales Incentive App (has versions/roles)
  // {
  //   id: 'AE204A5B-B598-460A-B924-6D91578228XO',
  //   route: '/incentive',
  //   icon: {
  //     iconShape: LuChartNoAxesCombined,
  //     iconColor: '#4f46e5',
  //     iconBackgroundColor: '#e8eaf6',
  //   },
  //   name: {
  //     en: 'Sales Incentive',
  //     ar: 'حوافز المبيعات',
  //   },
  //   getCardContent: (userAppData) => {
  //     const role = userAppData?.role?.toLowerCase();
  //     if (role === 'salesperson') {
  //       return (
  //         <Suspense fallback={<div>Loading...</div>}>
  //           <SalespersonIncentiveCard />
  //         </Suspense>
  //       );
  //     }
  //     if (role === 'storemanager') {
  //       return (
  //         <Suspense fallback={<div>Loading...</div>}>
  //           <StoreManagerIncentiveCard />
  //         </Suspense>
  //       );
  //     }
  //     return (
  //       <p className="text-sm text-secondary-text">No data for your role</p>
  //     );
  //   },
  //   getRouteForRole: (userAppData) => {
  //     const role = userAppData?.role?.toLowerCase();
  //     if (role === 'salesperson') return '/salesperson';
  //     if (role === 'storemanager') return '/storeManager';
  //     return '';
  //   },
  // },

  // 📱 Mobile Serial App
  {
    id: 'AD29A92D-FAB1-4B2B-BB68-BAC4033D1710', // Matches the appID from your user data
    route: '/mobile-serial-app',
    icon: {
      iconShape: BiBarcodeReader,
      iconColor: '#166534',
      iconBackgroundColor: '#dcfce7',
    },
    name: {
      en: 'Mobile serial maintenance',
      ar: 'صيانة الأرقام التسلسلية',
    },
    getCardContent: () => {
      return <ScannerMobileSerialCard />;
    },
    getRouteForRole: () => {
      return '';
    },
  },

  // 👤 User Management App
  // {
  //   id: 'AE204A5B-B598-460A-B924-6D9157822PHP',
  //   route: '/userManagment',
  //   icon: {
  //     iconShape: RiUserSettingsFill,
  //     iconColor: '#4f46e5',
  //     iconBackgroundColor: '#e8eaf6',
  //   },
  //   name: {
  //     en: 'User Management',
  //     ar: 'إدارة المستخدمين',
  //   },
  //   getCardContent: (userAppData) => {
  //     const role = userAppData?.role?.toLowerCase();
  //     if (role === 'it_manager') {
  //       return (
  //         <Suspense fallback={<div>Loading...</div>}>
  //           <UserManagementCard />
  //         </Suspense>
  //       );
  //     }
  //     return (
  //       <p className="text-sm text-secondary-text">No data for your role</p>
  //     );
  //   },
  //   getRouteForRole: (userAppData) => {
  //     const role = userAppData?.role?.toLowerCase();
  //     if (role === 'it_manager') return '/userManagment';
  //     return '';
  //   },
  // },
];

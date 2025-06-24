//************************************ */
import { RiHome6Line } from 'react-icons/ri';
import { MdPassword } from 'react-icons/md';
import { PiUserSwitchFill } from 'react-icons/pi';

export const managementMenuItems = [
  {
    label: {
      en: 'Users',
      ar: 'لمستخدمين',
    },
    icon: RiHome6Line,
    route: '/userManagment/userManagment',
  },
  {
    label: {
      en: 'Passwords reset',
      ar: 'إعادة تعيين كلمة المرور ',
    },
    icon: MdPassword,
    route: '*',
  },
  {
    label: {
      en: 'Departments',
      ar: 'ألمستخدمين و الأقسام',
    },
    icon: PiUserSwitchFill,
    route: '*',
  },
];
//************************************ */
import { IoLanguage } from 'react-icons/io5';
import { RiArrowGoBackFill } from 'react-icons/ri';
import { MdLogout } from 'react-icons/md';

export const otherMenuItems = [
  {
    label: {
      en: 'Arabic',
      ar: 'الإنجليزية',
    },
    action: 'switchLang',
    icon: IoLanguage,
  },
  {
    label: {
      en: 'Main app',
      ar: 'التطبيق الرئيسي',
    },
    action: 'goBack',
    icon: RiArrowGoBackFill,
  },
  {
    label: {
      en: 'Log out',
      ar: 'تسجيل الخروج',
    },
    action: 'logOut',
    icon: MdLogout,
  },
];
//************************************ */

export const authFooter = [
  {
    title: {
      en: 'Terms',
      ar: 'ألشروط',
    },
    link: '*',
  },
  {
    title: {
      en: 'Privacy',
      ar: 'ألخصوصية',
    },
    link: '*',
  },

  {
    title: {
      en: 'Help',
      ar: 'المساعدة',
    },
    link: '*',
  },
];

// Mock user
import avatar from '../assets/profile.jpg';
export const mockUserProfile = {
  image: avatar,
  name: {
    en: 'Mark Peterson',
    ar: 'مارك بيترسون',
  },
  role: {
    en: 'Salesperson',
    ar: 'مندوب مبيعات',
  },
};

// Sidebar items
import { LuLayoutDashboard } from 'react-icons/lu';
import { IoSettingsOutline } from 'react-icons/io5';
import { MdSupportAgent } from 'react-icons/md';
import { MdOutlineContactSupport } from 'react-icons/md';
import { LuLogOut } from 'react-icons/lu';

export const sideBarItems = [
  {
    icon: LuLayoutDashboard,
    title: {
      en: 'Dashboard',
      ar: 'لوحة التحكم',
    },
    link: '/mainDashboard',
  },
  {
    icon: IoSettingsOutline,
    title: {
      en: 'Settings',
      ar: 'ألإعدادات',
    },
    link: '/mainDashboard/settings',
  },
  {
    icon: MdSupportAgent,
    title: {
      en: 'Support',
      ar: 'ألدعم',
    },
    link: '/mainDashboard/support',
  },
  {
    icon: MdOutlineContactSupport,
    title: {
      en: 'Help center',
      ar: 'مركز المساعدة',
    },
    link: '/mainDashboard/helpCenter',
  },
];

// Simulate logout
export const mockLogOut = {
  icon: LuLogOut,
  title: {
    en: 'Logout',
    ar: 'تسجيل الخروج',
  },
  link: '/',
};
// settings page's navigations tabs
import { TbLockPassword } from 'react-icons/tb';
import { MdOutlineLanguage } from 'react-icons/md';
import { MdColorLens } from 'react-icons/md';
import { RiAdminLine } from 'react-icons/ri';

export const settingsNavigationsTabs = [
  {
    icon: TbLockPassword,
    title: {
      en: 'Password settings',
      ar: 'إعدادات كلمة المرور',
    },
    pageRoute: '/mainDashboard/settings/passwordSettings',
  },
  {
    icon: MdOutlineLanguage,
    title: {
      en: 'Language settings',
      ar: 'إعدادات اللغة',
    },
    pageRoute: '/mainDashboard/settings/languageSettings',
  },
  {
    icon: MdColorLens,
    title: {
      en: 'Theme settings',
      ar: 'إعدادات الخلفية',
    },
    pageRoute: '/mainDashboard/settings/themeSettings',
  },
  {
    icon: RiAdminLine,
    title: {
      en: 'User Access Management',
      ar: 'إدارة وصول المستخدمين',
    },
    pageRoute: '/mainDashboard/settings/adminAssign',
  },
];

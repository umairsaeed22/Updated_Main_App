//Avatar menu items

import { IoReturnDownBackOutline } from 'react-icons/io5';
import { RiLogoutCircleRLine } from 'react-icons/ri';

export const avatarMenuItems = [
  {
    title: {
      en: 'Return to apps page',
      ar: 'ألعودة إلى صفحة ألتطبيقات',
    },

    icon: IoReturnDownBackOutline,
    linkTo: '/mainDashboard',
  },
  {
    title: {
      en: 'Log out',
      ar: 'تسجيل ألخروج',
    },

    icon: RiLogoutCircleRLine,
    linkTo: '/',
  },
];

// Currency

export const currency = {
  en: 'SAR',
  ar: 'ريال',
};

// Sidebar itmems
import { FiHome } from 'react-icons/fi';
import { MdSupportAgent } from 'react-icons/md';
import { LuBadgeHelp } from 'react-icons/lu';

export const sidebarItems = [
  {
    title: {
      en: 'Dashboard',
      ar: 'لوحة التحكم',
    },
    icon: FiHome,
    linkto: '/incentive/salesperson',
  },
  {
    title: {
      en: 'Support',
      ar: 'ألدعم',
    },
    icon: MdSupportAgent,
    linkto: '*',
  },
  {
    title: {
      en: 'Help center',
      ar: 'مركز ألمساعدة',
    },
    icon: LuBadgeHelp,
    linkto: '*',
  },
];

//Sidebar Settings and log out
import { MdLanguage } from 'react-icons/md';
import { IoMdLogOut } from 'react-icons/io';

export const sidebarItemsSettingsItems = [
  {
    title: {
      en: 'Switch to Arabic',
      ar: 'ألتغيير إلى الإنجليزية',
    },

    icon: MdLanguage,
    itemType: 'lang',
  },
  {
    title: {
      en: 'Log out',
      ar: 'تسجيل ألخروج',
    },

    icon: IoMdLogOut,
    itemType: 'log',
  },
];

import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import enGlobal from './en/global/global.json';
import arGlobal from './ar/global/global.json';
import enMainDashboard from './en/mainDashboard/mainDashboard.json';
import arMainDashboard from './ar/mainDashboard/mainDashboard.json';
import enMainDashboardSettings from './en/mainDashboard/settings.json';
import arMainDashboardSettings from './ar/mainDashboard/settings.json';
import enSalespersonDashboard from './en/salespersonDashboard/salespersonDashboard.json';
import arSalespersonDashboard from './ar/salespersonDashboard/salespersonDashboard.json';
i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources: {
      en: {
        global: enGlobal,
        mainDashboard: enMainDashboard,
        mainDashboardSettings: enMainDashboardSettings,
        salespersonDashboard: enSalespersonDashboard,
      },
      ar: {
        global: arGlobal,
        mainDashboard: arMainDashboard,
        mainDashboardSettings: arMainDashboardSettings,
        salespersonDashboard: arSalespersonDashboard,
      },
    },
    fallbackLng: 'en', // default language
    debug: false,
    defaultNS: 'global',
    ns: [
      'global',
      'mainDashboard',
      'mainDashboardSettings',
      'salespersonDashboard',
    ],
    detection: {
      order: ['localStorage', 'navigator'],
      caches: ['localStorage'], // store selected language here
    },
    interpolation: {
      escapeValue: false, // React already escapes
    },
  });

export default i18n;

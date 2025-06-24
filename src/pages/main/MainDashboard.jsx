import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import AppCard from '../../dynamic_apps_cards/AppCard';
import { mockUser } from '../../mock/mockUserRole';
import { appConfig } from '../../config/apps.config';
import FullScreenLoader from '../../components/loader/FullScreenLoader';
import { useNavigate } from 'react-router-dom';
import useAuthStore from '../../store/useAuthStore';

const MainDashboard = () => {
  const { apps } = useAuthStore();
  const [expandedCards, setExpandedCards] = useState({}); // A state the will handle minimze and maximize app Card
  const [isLoading, setIsLoading] = useState(false);
  const { t } = useTranslation('mainDashboard');
  const navigate = useNavigate();

  const handleExpandCards = (appId) => {
    setExpandedCards((prev) => ({
      ...prev,
      [appId]: !prev[appId],
    }));
  };

  const accessibleApps = apps
    .map((userApp) => {
      const config = appConfig.find(
        (app) => app.id.toLowerCase() === userApp.appID?.toLowerCase(),
      );
      if (!config) return null;

      return {
        ...config,
        userAppData: userApp,
      };
    })
    .filter(Boolean);

  console.log(accessibleApps);

  const handleAppLaunch = (app, userApp) => {
    setIsLoading(true);

    const route = app.route + app.getRouteForRole(userApp);
    setTimeout(() => {
      navigate(route);
    }, 2000);
  };

  return (
    <div className="w-full h-full flex flex-col  ">
      {isLoading && <FullScreenLoader />}
      {/**Header */}
      <div className="w-full flex items center sticky top-0 md:p-8 p-4">
        {/**Title */}
        <div className="flex flex-col gap-1">
          <h1 className={`text-primary-text text-base font-semibold`}>
            {t('Title')}
          </h1>
          <p className="text-secondary-text text-sm">{t('Subtitle')}</p>
        </div>
      </div>
      {/**Apps cards */}
      <div className="grid xl:grid-cols-2 lg:grid-cols-1 md:grid-cols-1   grid-cols-1 overflow-y-auto lg:p-8 p-4 gap-4 w-full scroll-smooth transition-all duration-300">
        {accessibleApps.map((app) => {
          const { userAppData } = app;

          return (
            <AppCard
              key={`${app.id}-${userAppData.role}`} // make sure the key is unique if role is used
              app={app}
              userAppData={userAppData}
              onCardClick={() => handleExpandCards(app.id)}
              isMinimized={!expandedCards[app.id]}
              onLaunch={() => handleAppLaunch(app, userAppData)}
            />
          );
        })}
      </div>
    </div>
  );
};

export default MainDashboard;

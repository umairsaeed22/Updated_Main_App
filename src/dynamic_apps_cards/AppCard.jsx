import { FiMaximize } from 'react-icons/fi';
import { useLanguage } from '../context/LanguageContext';
import { LuMinimize } from 'react-icons/lu';
import { MdOutlineLaunch } from 'react-icons/md';

const AppCard = ({ app, userAppData, onCardClick, isMinimized, onLaunch }) => {
  const { lang } = useLanguage();
  const { iconColor, iconBackgroundColor } = app.icon;

  const Content = app.getCardContent(userAppData);

  const handleClick = () => {
    const route = app.route + app.getRouteForRole(userAppData);
    onLaunch(route);
  };
  return (
    <div
      className={`bg-card/90 border border-gray-200 rounded-lg shadow-sm shadow-gray-200 shrink-0 p-4 flex flex-col gap-5 ${
        isMinimized ? 'h-fit' : 'h-[350px]'
      }`}
    >
      <div className="w-full flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div
            style={{
              backgroundColor: iconBackgroundColor || '#e0e0e0',
            }}
            className="shrink-0 p-2 rounded-lg"
          >
            <app.icon.iconShape size={24} color={iconColor || '#424242'} />
          </div>
          <h1 className="text-primary-text text-base font-medium">
            {app.name[lang]}
          </h1>
        </div>
        <div className="flex items-center gap-4">
          <button
            onClick={onCardClick}
            className="text-primary-text cursor-pointer"
          >
            {isMinimized ? <FiMaximize size={20} /> : <LuMinimize size={20} />}
          </button>
          <button
            onClick={handleClick}
            className="text-primary-text cursor-pointer"
          >
            <MdOutlineLaunch size={20} />
          </button>
        </div>
      </div>
      <div
        className={`flex-1 border-t border-gray-100 ${
          isMinimized ? 'hidden' : 'block'
        }`}
      >
        {Content}
      </div>
    </div>
  );
};

export default AppCard;

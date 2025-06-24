import { MdKeyboardArrowDown, MdOutlineLanguage } from 'react-icons/md';
import { RiApps2AddLine } from 'react-icons/ri';
import { useLanguage } from '../../context/LanguageContext';
import { IoMenu } from 'react-icons/io5';
import { useTheme } from '../../context/ThemeContext';

const Header = ({ isLanguageMenuOpen, toggleMenu, onMobileSideBarOpen }) => {
  const { lang } = useLanguage();
  const { theme } = useTheme();
  return (
    <header className="w-full h-full p-4 flex items-center ">
      {/**Mobile open sidebar button */}
      <button
        onClick={onMobileSideBarOpen}
        className="text-[#111827] cursor-pointer lg:hidden"
      >
        <IoMenu size={24} />
      </button>
      {/**Logo */}
      <div
        className={`flex items-center  text-base text-primary-text  font-semibold gap-1.5  ${
          lang === 'en' ? 'ml-6 lg:ml-0' : 'mr-6 lg:mr-0'
        }  `}
      >
        <RiApps2AddLine
          size={24}
          className={`${
            theme === 'orange' ? 'text-orange-600' : 'text-indigo-600'
          } `}
        />{' '}
        {lang === 'en' ? 'Apps Hub' : 'مركز التطبيقات'}
      </div>

      <button
        onClick={toggleMenu}
        className={`p-2 border border-[#111827] rounded-lg flex items-center text-primary-text text-sm font-rubik font-medium gap-2 cursor-pointer ${
          lang === 'en' ? 'ml-auto' : 'mr-auto'
        }`}
      >
        <MdOutlineLanguage size={18} />
        {lang === 'en' ? 'En' : 'Ar'}
        <MdKeyboardArrowDown
          size={16}
          className={`${
            isLanguageMenuOpen && 'rotate-180 transition-transform duration-300'
          }`}
        />
      </button>
    </header>
  );
};

export default Header;

import React from 'react';
import { Link, NavLink } from 'react-router-dom';
import {
  HomeIcon, FlagIcon, CollectionIcon, ShoppingCartIcon,
  SwitchHorizontalIcon, InformationCircleIcon, MenuIcon, XIcon, DotsCircleHorizontalIcon
} from '@heroicons/react/outline';
import { LogoutIcon, MoonIcon, SunIcon } from '@heroicons/react/solid';

import { useUser } from '../../context/UserContext';
import { useTheme } from '../../context/ThemeContext';
import useClickOutside from '../../hooks/useClickOutside';
import logo from '../../assets/logo.png';
import { logout } from '../api/logout';
import ConfirmationModal from '../../features/dashboard/components/ConfirmationModal';
import { useTranslation } from 'react-i18next';
import { Popover, Transition } from '@headlessui/react';


type LinkInfo = {
  url: string;
  key: string;
  accessType: 'CB' | 'PM' | 'ALL';
  icon: JSX.Element;
};

type OpenButtonProps = {
  handler: React.MouseEventHandler<HTMLButtonElement>;
  open: boolean;
};

type SidebarLinkProps = {
  icon: JSX.Element;
  url: string;
  content: string;
  setOpen: (open: boolean) => void;
};

type SidebarProps = {
  open: boolean;
  setOpen: (open: boolean) => void;
};

type FooterProps = {
  closeMenu: () => void;
};

type LangsDicts = {
  [key: string]: string;
};


const iconClassname = 'h-6 w-6 text-gray-500 mr-3 dark:text-gray-300';

const links: LinkInfo[] = [
  { url: '/dashboard', key: 'dashboard', accessType: 'PM', icon: <HomeIcon className={iconClassname} /> },
  { url: '/campaigns', key: 'campaigns', accessType: 'CB', icon: <CollectionIcon className={iconClassname} /> },
  { url: '/actions', key: 'actions', accessType: 'CB', icon: <FlagIcon className={iconClassname} /> },
  { url: '/offers', key: 'offers', accessType: 'CB', icon: <ShoppingCartIcon className={iconClassname} /> },
  { url: '/transaction-history', key: 'transactions', accessType: 'ALL', icon: <SwitchHorizontalIcon className={iconClassname} /> },
  { url: '/about', key: 'about', accessType: 'ALL', icon: <InformationCircleIcon className={iconClassname} /> }
];

const lngs: LangsDicts = {
  en: 'English',
  es: 'Español',
  eus: 'Euskera',
};

const OpenButton = ({ handler, open }: OpenButtonProps) => (
  <button onClick={handler} className="lg:hidden fixed bottom-12 right-6 rounded-full z-50 bg-gray-900 h-14 w-14 flex items-center justify-center ring-2 ring-gray-400">
    <div className='w-full h-full flex items-center justify-center'>
      {open
        ? <XIcon className='w-7 text-sky-500' />
        : <MenuIcon className='w-6 text-sky-500' />
      }
    </div>
  </button>
);

const SidebarHead = () => {
  return (
    <Link to={'/'} className='flex items-center w-full h-20 p-1 bg-slate-100 dark:bg-gray-900'>
      <img src={logo} alt="" className='w-12 h-12 mx-3' />
      <h1 className='text-3xl text-gray-800 font-bold group-hover:w-50 dark:text-white'>DeustoCoin</h1>
    </Link>
  );
};

const SidebarLink = ({ icon, url, content, setOpen }: SidebarLinkProps) => (
  <NavLink
    to={url}
    onClick={() => setOpen(false)}
    className={({ isActive }) => `
    flex items-center p-2 m-1 text-lg font-semibold text-gray-600 rounded-lg hover:bg-gray-200 
    hover:text-gray-800 transition-colors dark:text-gray-300 dark:hover:text-gray-200 dark:hover:bg-gray-900
      ${isActive ? 'bg-gray-200 text-gray-800 dark:text-gray-200 dark:bg-gray-900' : ''}
    `}
  >
    {icon}
    {content}
  </NavLink>
);

const FooterMenu = () => {
  const [openModal, setOpenModal] = React.useState(false);
  const { setUser } = useUser();
  const { dark, setDark } = useTheme();
  const { t, i18n } = useTranslation();

  const handleThemeChange = (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    event.preventDefault();
    setDark(!dark);
    localStorage.setItem('theme', dark ? 'light' : 'dark');
    if (dark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  };

  const logoutHandler = async () => {
    await logout();
    setUser(null);
  };

  return (
    <>
      <Popover className="relative flex items-center justify-center">
        {({ open }) => (
          <>
            <Popover.Button
              className={`
                ${open ? '' : 'text-opacity-90'}
                bg-indigo-200 hover:bg-indigo-300 p-1 group rounded-md inline-flex items-center text-base font-medium hover:text-opacity-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75`}
            >
              <DotsCircleHorizontalIcon
                className={`${open ? '' : 'text-opacity-70'} h-7 w-7 text-indigo-700 group-hover:text-indigo-800 group-hover:text-opacity-80 transition ease-in-out duration-150`}
                aria-hidden="true"
              />
            </Popover.Button>
            <Transition
              as={React.Fragment}
              enter="transition ease-out duration-200"
              enterFrom="opacity-0 translate-y-1"
              enterTo="opacity-100 translate-y-0"
              leave="transition ease-in duration-150"
              leaveFrom="opacity-100 translate-y-0"
              leaveTo="opacity-0 translate-y-1"
            >
              <Popover.Panel className="bg-indigo-200 dark:bg-indigo-500 shadow rounded-lg absolute bottom-16 -right-1 z-10 max-w-sm w-64 py-2 mt-3 sm:px-0 lg:max-w-3xl">
                <div className='flex flex-col items-start justify-center gap-1 w-full px-4'>
                  <button onClick={handleThemeChange} className='flex items-center justify-start gap-3 w-full rounded-lg p-1.5 hover:bg-indigo-50 dark:hover:bg-indigo-700 transition-colors'>
                    {dark
                      ? <SunIcon className='h-7 w-7' />
                      : <MoonIcon className='h-7 w-7' />
                    }
                    <span>{t('sidebar.footerMenu.theme')}</span>
                  </button>
                  <button onClick={() => setOpenModal(true)} className='flex items-center justify-start gap-3 w-full rounded-lg mb-2 p-1.5 hover:bg-indigo-50 dark:hover:bg-indigo-700 transition-colors'>
                    <LogoutIcon className='h-7 w-7 text-gray-600 dark:text-gray-100' />
                    <span>{t('sidebar.footerMenu.logout')}</span>
                  </button>
                  <div className='flex items-center justify-around w-full'>
                    {Object.keys(lngs).map(lng => (
                      <button
                        key={lng}
                        className={`rounded hover:bg-indigo-400 hover:text-indigo-50 dark:hover:bg-indigo-700 px-1.5 py-0.5 ${i18n.resolvedLanguage === lng ? 'bg-indigo-400 text-indigo-50 dark:bg-indigo-900' : 'bg-indigo-300 dark:bg-indigo-600'}`}
                        onClick={() => i18n.changeLanguage(lng)}
                      >
                        {lngs[lng]}
                      </button>
                    ))}
                  </div>
                </div>
              </Popover.Panel>
            </Transition>
          </>
        )}
      </Popover>
      <ConfirmationModal open={openModal} setOpen={setOpenModal} title='Log out' content='Do you want to log out from socialcoin?' confirmHandler={logoutHandler} />
    </>
  );
};

const SidebarFooter = ({ closeMenu }: FooterProps) => {
  const { user } = useUser();
  const { t } = useTranslation();

  const reduceName = (name: string | undefined) => name && name.length > 22 ? name.slice(0, 15) + '...' : name;

  return (
    <>
      <div className='flex items-center justify-between gap-2 mx-5 py-4 text-gray-600 dark:text-gray-300'>
        <div className='flex flex-col items-start justify-center'>
          {/* TODO revise font size on mobile */}
          <span className='text-sm font-bold'>{reduceName(user?.name)}</span>
          <Link
            to='/profile'
            className='text-sm text-indigo-400 hover:underline'
            onClick={closeMenu}
          >
            {t('sidebar.viewProfile')}
          </Link>
        </div>
        <div className='col-span-1'>
          <FooterMenu />
        </div>
      </div>
    </>
  );
};

export const Sidebar = ({ open, setOpen }: SidebarProps) => {
  const { user } = useUser();
  const { t } = useTranslation();

  const openHandler = () => setOpen(!open);
  const sidebarRef = React.useRef<HTMLDivElement>(null);

  const onClickOutside = React.useCallback(() => setOpen(false), []);

  useClickOutside(sidebarRef, onClickOutside);

  return (
    <>
      <OpenButton open={open} handler={openHandler} />
      <div ref={sidebarRef} className={`h-screen w-72 fixed bg-white dark:bg-gray-800 lg:border-0 border-r border-gray-300 dark:border-r-gray-700 shadow transition-all duration-300 ease-out z-10 lg:ml-0 ${open ? '' : '-ml-72'}`}>
        <SidebarHead />
        {user &&
          <div className='flex flex-col h-full pb-20 divide-y-2 divide-gray-300 dark:divide-gray-700'>
            <ul className='flex flex-col p-2 mb-auto'>
              {links.map(l => {
                if (l.accessType === 'ALL' || user.role === 'AD' || l.accessType === user.role) {
                  return (
                    <li key={l.url}>
                      <SidebarLink
                        icon={l.icon}
                        url={l.url}
                        content={t(`sidebar.links.${l.key}`)}
                        setOpen={setOpen}
                      />
                    </li>
                  );
                }
              })}
            </ul>
            <SidebarFooter closeMenu={() => setOpen(false)} />
          </div>
        }
      </div>
    </>
  );
};
import React from 'react';
import { Link, NavLink } from 'react-router-dom';
import {
  HomeIcon, FlagIcon, CollectionIcon, ShoppingCartIcon,
  SwitchHorizontalIcon, InformationCircleIcon, MenuIcon, XIcon
} from '@heroicons/react/outline';
import { LogoutIcon, MoonIcon, SunIcon } from '@heroicons/react/solid';

import { useUser } from '../../context/UserContext';
import { useTheme } from '../../context/ThemeContext';
import useClickOutside from '../../hooks/useClickOutside';
import logo from '../../assets/logo.png';
import { logout } from '../api/logout';
import ConfirmationModal from '../../features/dashboard/components/ConfirmationModal';


type LinkInfo = {
  url: string;
  content: string;
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


const iconClassname = 'h-6 w-6 text-gray-500 mr-3 dark:text-gray-300';

const links: LinkInfo[] = [
  { url: '/dashboard', content: 'Dashboard', accessType: 'PM', icon: <HomeIcon className={iconClassname} /> },
  { url: '/campaigns', content: 'Campaigns', accessType: 'CB', icon: <CollectionIcon className={iconClassname} /> },
  { url: '/actions', content: 'Actions', accessType: 'CB', icon: <FlagIcon className={iconClassname} /> },
  { url: '/offers', content: 'Offers', accessType: 'CB', icon: <ShoppingCartIcon className={iconClassname} /> },
  { url: '/transaction-history', content: 'Transactions', accessType: 'ALL', icon: <SwitchHorizontalIcon className={iconClassname} /> },
  { url: '/about', content: 'About', accessType: 'ALL', icon: <InformationCircleIcon className={iconClassname} /> }
];

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

const SidebarHead = () => (
  <Link to={'/'} className='flex items-center w-full h-20 p-1 bg-slate-100 dark:bg-gray-900'>
    <img src={logo} alt="" className='w-12 h-12 mx-3' />
    <h1 className='text-3xl text-gray-800 font-bold group-hover:w-50 dark:text-white'>DeustoCoin</h1>
  </Link>
);

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

const SidebarFooter = () => {
  const [openModal, setOpenModal] = React.useState(false);
  const { user, setUser } = useUser();
  const { dark, setDark } = useTheme();

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

  const reduceName = (name: string | undefined) => name && name.length > 22 ? name.slice(0, 15) + '...' : name;

  return (
    <>
      <div className='flex items-center justify-center gap-2 mx-1 py-4 text-gray-600 dark:text-gray-300'>
        <div className='flex flex-col items-start justify-center'>
          {/* TODO revise font size on mobile */}
          <span className='text-sm font-bold'>{reduceName(user?.name)}</span>
          <Link to='/profile' className='text-sm text-indigo-400 hover:underline'>View profile</Link>
        </div>
        <div className='col-span-1 flex items-center justify-center'>
          <button onClick={handleThemeChange} className='flex flex-col items-center justify-center rounded-lg p-1.5 hover:bg-gray-200 dark:hover:bg-gray-900 transition-colors'>
            {dark
              ? <SunIcon className='h-7 w-7' />
              : <MoonIcon className='h-7 w-7' />
            }
          </button>
          <button onClick={() => setOpenModal(true)} className='flex flex-col items-center justify-center rounded-lg p-1.5 hover:bg-gray-200 dark:hover:bg-gray-900 transition-colors'>
            <LogoutIcon className='h-7 w-7 text-gray-600 dark:text-gray-100' />
          </button>
        </div>
      </div>
      <ConfirmationModal open={openModal} setOpen={setOpenModal} title='Log out' content='Do you want to log out from socialcoin?' confirmHandler={logoutHandler} />
    </>
  );
};

export const Sidebar = ({ open, setOpen }: SidebarProps) => {
  const openHandler = () => setOpen(!open);
  const { user } = useUser();
  const sidebarRef = React.useRef();

  const onClickOutside = React.useCallback(() => setOpen(false), []);

  useClickOutside(sidebarRef, onClickOutside);

  return (
    <>
      <OpenButton open={open} handler={openHandler} />
      <div ref={sidebarRef.current} className={`h-screen w-72 fixed bg-white dark:bg-gray-800 lg:border-0 border-r border-gray-300 dark:border-r-gray-700 shadow transition-all duration-300 ease-out z-10 lg:ml-0 ${open ? '' : '-ml-72'}`}>
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
                        content={l.content}
                        setOpen={setOpen}
                      />
                    </li>
                  );
                }
              })}
            </ul>
            <SidebarFooter />
          </div>
        }
      </div>
    </>
  );
};
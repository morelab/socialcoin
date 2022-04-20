import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, Transition } from '@headlessui/react';
import {
  CollectionIcon,
  FlagIcon,
  LogoutIcon,
  MoonIcon,
  ShoppingCartIcon,
  SunIcon,
  UserIcon
} from '@heroicons/react/solid';

import classNames from 'classnames';
import { useUser } from '../../context/UserContext';
import { useTheme } from '../../context/ThemeContext';
import { logout } from '../api/logout';

type TabProps = {
  url: string;
  content: 'Campaigns' | 'Actions' | 'Offers';
  active: boolean;
  setActiveTab: (index: number) => void;
};

const Tab = ({ url, content, active, setActiveTab }: TabProps) => {
  const className = active
    ? 'h-16 inline-flex items-center py-4 px-4 text-md font-medium text-center text-blue-500 rounded-t-lg border-b-2 border-blue-600 transition-colors group dark:text-blue-300 dark:border-blue-300'
    : 'h-16 inline-flex items-center py-4 px-4 text-md font-medium text-center text-gray-400 rounded-t-lg border-b-2 border-transparent transition-colors hover:text-gray-500 hover:border-gray-300 dark:hover:text-gray-300 group';

  const iconClassname = active
    ? 'h-5 w-5 text-blue-500 sm:mr-3 dark:text-blue-300 transition-colors '
    : 'h-5 w-5 text-gray-400 sm:mr-3 group-hover:text-gray-500 dark:group-hover:text-gray-300 transition-colors ';

  let icon: JSX.Element;
  let index: number;
  switch (content) {
    case 'Campaigns':
      icon = <FlagIcon className={iconClassname} />;
      index = 0;
      break;
    case 'Actions':
      icon = <CollectionIcon className={iconClassname} />;
      index = 1;
      break;
    default:
      icon = <ShoppingCartIcon className={iconClassname} />;
      index = 2;
      break;
  }

  return (
    <li className="mr-4">
      <Link to={url} className={className} onClick={() => setActiveTab(index)}>
        {icon}
        <span className='hidden sm:inline'>
          {content}
        </span>
      </Link>
    </li>
  );
};


const TabGroup = () => {
  const location = useLocation();
  let index;
  if (location.pathname === '/dashboard/campaigns') index = 0;
  else if (location.pathname === '/dashboard/actions') index = 1;
  else if (location.pathname === '/dashboard/offers') index = 2;
  else index = 0;

  const [activeTab, setActiveTab] = React.useState(index);

  return (
    <div className="border-b border-white pl-3 dark:border-gray-800">
      <ul className="flex flex-wrap -mb-px">
        <Tab
          url='/dashboard/campaigns'
          content='Campaigns'
          active={activeTab === 0}
          setActiveTab={setActiveTab}
        />
        <Tab
          url='/dashboard/actions'
          content='Actions'
          active={activeTab === 1}
          setActiveTab={setActiveTab}
        />
        <Tab
          url='/dashboard/offers'
          content='Offers'
          active={activeTab === 2}
          setActiveTab={setActiveTab}
        />
      </ul>
    </div>
  );
};

const TopbarMenu = () => {
  const { user, setUser } = useUser();

  const logoutHandler = async () => {
    await logout();
    setUser(null);
  };

  return (
    <Menu as="div" className="ml-3 relative">
      <div>
        <Menu.Button className="bg-gray-800 flex text-sm rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-white mr-4">
          <span className="sr-only">Open user menu</span>
          <img
            className="h-11 w-11 rounded-full"
            src={user !== null ? user.picture_url : 'https://www.vhv.rs/dpng/d/436-4363443_view-user-icon-png-font-awesome-user-circle.png'}
            alt="Menu"
            referrerPolicy='no-referrer'
          />
        </Menu.Button>
      </div>
      <Transition
        as={React.Fragment}
        enter="transition ease-out duration-100"
        enterFrom="transform opacity-0 scale-95"
        enterTo="transform opacity-100 scale-100"
        leave="transition ease-in duration-75"
        leaveFrom="transform opacity-100 scale-100"
        leaveTo="transform opacity-0 scale-95"
      >
        <Menu.Items className="origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg py-1 bg-white ring-1 ring-black ring-opacity-5 focus:outline-none dark:bg-gray-900">
          <Menu.Item>
            {({ active }) => (
              <Link to="/profile" className={classNames(active ? 'bg-gray-100 dark:bg-gray-600' : '', 'flex items-center justify-start px-4 py-2 text-sm text-gray-700 dark:text-gray-100')}>
                <UserIcon className='h-5 w-5 mr-2 text-gray-600 dark:text-gray-100' />
                Your Profile
              </Link>
            )}
          </Menu.Item>
          <Menu.Item>
            {({ active }) => (
              <button onClick={logoutHandler} className={classNames(active ? 'bg-gray-100 dark:bg-gray-600' : '', 'flex items-center justify-start w-full px-4 py-2 text-sm text-gray-700 dark:text-gray-100')}>
                <LogoutIcon className='h-5 w-5 mr-2 text-gray-600 dark:text-gray-100' />
                Sign out
              </button>
            )}
          </Menu.Item>
        </Menu.Items>
      </Transition>
    </Menu>
  );
};

export const TopBar = () => {
  const location = useLocation();
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

  return (
    <div className="inline-flex items-center justify-between bg-white shadow w-full h-16 pb-0 dark:bg-gray-800">
      <div>
        {location.pathname.startsWith('/dashboard') &&
          <TabGroup />
        }
      </div>
      <div className='flex items-center'>
        <button onClick={handleThemeChange} className='ml-2 transition-colors rounded-md p-1 hover:bg-gray-300 dark:hover:bg-gray-600'>
          {dark
            ? <SunIcon className='h-7 w-7 text-gray-100' />
            : <MoonIcon className='h-7 w-7' />
          }
        </button>
        <TopbarMenu />
      </div>
    </div>
  );
};
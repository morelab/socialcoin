import React, { useRef, useCallback } from 'react';
import {
  HomeIcon, FlagIcon, CollectionIcon, ShoppingCartIcon,
  SwitchHorizontalIcon, InformationCircleIcon, MenuIcon, XIcon
} from '@heroicons/react/outline';

import { SidebarHead, SidebarLink } from './SidebarItems';
import { useUser } from '../../../context/UserContext';
import useClickOutside from '../../../hooks/useClickOutside';

const iconClassname = 'h-6 w-6 text-gray-500 mr-3 dark:text-gray-300';

const links = [
  { url: '/dashboard', content: 'Dashboard', accessType: 'PM', icon: <HomeIcon className={iconClassname} /> },
  { url: '/campaigns', content: 'Campaigns', accessType: 'CB', icon: <CollectionIcon className={iconClassname} /> },
  { url: '/actions', content: 'Actions', accessType: 'CB', icon: <FlagIcon className={iconClassname} /> },
  { url: '/offers', content: 'Offers', accessType: 'CB', icon: <ShoppingCartIcon className={iconClassname} /> },
  { url: '/transaction-history', content: 'Transactions', accessType: 'ALL', icon: <SwitchHorizontalIcon className={iconClassname} /> },
  { url: '/about', content: 'About', accessType: 'ALL', icon: <InformationCircleIcon className={iconClassname} /> }
];

const OpenButton = ({ handler, open }) => (
  <button onClick={handler} className="lg:hidden fixed bottom-12 right-6 rounded-full z-50 bg-gray-900 h-14 w-14 flex items-center justify-center ring-2 ring-gray-400">
    <div className='w-full h-full flex items-center justify-center'>
      {open
        ? <XIcon className='w-7 text-sky-500' />
        : <MenuIcon className='w-6 text-sky-500' />
      }
    </div>
  </button>
);

const Sidebar = ({ open, setOpen }) => {
  const openHandler = () => setOpen(!open);
  const { user } = useUser();
  const sidebarRef = useRef();

  const onClickOutside = useCallback(() => setOpen(false), []);

  useClickOutside(sidebarRef, onClickOutside);

  return (
    <>
      <OpenButton open={open} handler={openHandler} />
      <div ref={sidebarRef} className={`h-screen w-72 fixed bg-white dark:bg-gray-800 lg:border-0 border-r border-gray-300 dark:border-r-gray-700 shadow transition-all duration-300 ease-out z-10 lg:ml-0 ${open ? '' : '-ml-72'}`}>
        <SidebarHead />
        {user &&
          <ul className='flex flex-col p-2'>
            {links.map(l => {
              if (l.accessType === 'ALL' || user.role === 'AD' || l.accessType === user.role) {
                return (
                  <li key={l.url}>
                    <SidebarLink
                      icon={l.icon}
                      url={l.url}
                      content={l.content}
                      setOpen={setOpen}
                      active={window.location.pathname.startsWith(l.url)}
                    />
                  </li>
                );
              }
            })}
          </ul>
        }
      </div>
    </>
  );
};

export default Sidebar;
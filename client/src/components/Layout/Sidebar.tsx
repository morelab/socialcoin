import React from 'react';
import { Link } from 'react-router-dom';
import {
  HomeIcon, FlagIcon, CollectionIcon, ShoppingCartIcon,
  SwitchHorizontalIcon, InformationCircleIcon, MenuIcon, XIcon
} from '@heroicons/react/outline';

import { useUser } from '../../context/UserContext';
import useClickOutside from '../../hooks/useClickOutside';
import logo from '../../../assets/deustoCoin-256.png';


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
  active: boolean;
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

const SidebarLink = ({ icon, url, content, setOpen, active }: SidebarLinkProps) => (
  <Link
    to={url}
    onClick={() => setOpen(false)}
    className={`
      flex items-center p-2 m-1 text-lg font-semibold text-gray-600 rounded-lg hover:bg-gray-200 
    hover:text-gray-800 transition-colors dark:text-gray-300 dark:hover:text-gray-200 dark:hover:bg-gray-900
      ${active ? 'bg-gray-200 text-gray-800 dark:text-gray-200 dark:bg-gray-900' : ''}
    `}
  >
    {icon}
    {content}
  </Link>
);

const Sidebar = ({ open, setOpen }: SidebarProps) => {
  const openHandler = () => setOpen(!open);
  const { user } = useUser();
  const sidebarRef = React.useRef();

  const onClickOutside = React.useCallback(() => setOpen(false), []);

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
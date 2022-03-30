import React, { Fragment, useCallback } from 'react';
import { Menu, Transition } from '@headlessui/react';
import { Link, useHistory } from 'react-router-dom';
import { LogoutIcon, UserIcon } from '@heroicons/react/solid';
import classNames from 'classnames';
import { useUser } from '../../../context/UserContext';
import userService from '../../../services/users';


const TopbarMenu = () => {
  const { user, setUser } = useUser();
  const history = useHistory();

  const logoutHandler = useCallback(() => {
    userService.logout()
      .then(() => {
        setUser(null);
        history.push('/');
      });
  }, [setUser, history]);

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
        as={Fragment}
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

export default TopbarMenu;
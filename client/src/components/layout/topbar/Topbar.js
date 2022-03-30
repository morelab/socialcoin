import React from 'react';
import { useLocation } from 'react-router-dom';
import { MoonIcon, SunIcon } from '@heroicons/react/solid';

import TabGroup from './TabGroup';
import TopbarMenu from './TopbarMenu';
import { useTheme } from '../../../context/ThemeContext';

const TopBar = () => {
  const location = useLocation();
  const { dark, setDark } = useTheme();

  const handleThemeChange = (e) => {
    e.preventDefault();
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

export default TopBar;
import React from 'react';
import { Link } from 'react-router-dom';
import logo from '../../../assets/deustoCoin-256.png';

const SidebarHead = () => (
  <Link to={'/'} className='flex items-center w-full h-20 p-1 bg-slate-100 dark:bg-gray-900'>
    <img src={logo} alt="" className='w-12 h-12 mx-3' />
    <h1 className='text-3xl text-gray-800 font-bold group-hover:w-50 dark:text-white'>DeustoCoin</h1>
  </Link>
);

const SidebarLink = ({ icon, url, content, setOpen, active }) => (
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

export { SidebarHead, SidebarLink };
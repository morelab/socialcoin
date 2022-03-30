import React from 'react';
import { Link } from 'react-router-dom';
import {
  FlagIcon, CollectionIcon, ShoppingCartIcon
} from '@heroicons/react/solid';

const Tab = ({ url, content, active, setActiveTab }) => {
  const className = active
    ? 'h-16 inline-flex items-center py-4 px-4 text-md font-medium text-center text-blue-500 rounded-t-lg border-b-2 border-blue-600 transition-colors group dark:text-blue-300 dark:border-blue-300'
    : 'h-16 inline-flex items-center py-4 px-4 text-md font-medium text-center text-gray-400 rounded-t-lg border-b-2 border-transparent transition-colors hover:text-gray-500 hover:border-gray-300 dark:hover:text-gray-300 group';

  const iconClassname = active
    ? 'h-5 w-5 text-blue-500 sm:mr-3 dark:text-blue-300 transition-colors '
    : 'h-5 w-5 text-gray-400 sm:mr-3 group-hover:text-gray-500 dark:group-hover:text-gray-300 transition-colors ';

  let icon;
  let index;
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

export default Tab;
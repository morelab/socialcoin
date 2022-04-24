import React from 'react';
import { Disclosure } from '@headlessui/react';
import { ChevronUpIcon } from '@heroicons/react/outline';
import { useTranslation } from 'react-i18next';

import { InputField } from '../../../components/Form';
import { ButtonSec } from '../../../components/Elements/Button';

import { useFilters } from '../context/FilterContext';

type SidebarProps = {
  className?: string;
}


const FilterDisclosure = () => {
  const {
    filters,
    filterHandler,
    clearFilters,
  } = useFilters();
  const { t } = useTranslation();

  return (
    <>
      <Disclosure>
        {({ open }) => (
          <>
            <Disclosure.Button
              className={`${open ? 'rounded-t-lg' : 'rounded-lg'} flex justify-between w-full px-4 py-2 text-sm font-medium text-left text-gray-200 bg-indigo-600 hover:bg-indigo-500 dark:bg-indigo-500 dark:hover:bg-indigo-400 focus:outline-none focus-visible:ring focus-visible:ring-indigo-500 focus-visible:ring-opacity-75 transition-colors shadow`}
            >
              <span>{t('transactions.showFilters')}</span>
              <ChevronUpIcon
                className={`${open ? 'transform rotate-180' : ''} w-5 h-5 text-gray-200 transition-transform`}
              />
            </Disclosure.Button>
            <Disclosure.Panel className="px-3 py-2 text-sm text-gray-700 bg-gray-100 dark:bg-gray-900 focus:outline-none focus-visible:ring focus-visible:ring-indigo-500 rounded-b-lg">
              <ButtonSec variant='inverse' size='sm' className='w-full mb-2' onClick={clearFilters}>
                {t('transactions.clearFilters')}
              </ButtonSec>
              <InputField
                label={t('transactions.sender')}
                name='sender'
                value={filters.sender}
                required
                onChange={filterHandler}
                className='mb-4'
              />
              <InputField
                label={t('transactions.receiver')}
                name='receiver'
                value={filters.receiver}
                required
                onChange={filterHandler}
                className='mb-4'
              />
              <InputField
                label={t('common.date')}
                type='date'
                name='date'
                value={filters.date}
                required
                onChange={filterHandler}
                className='mb-4'
              />
            </Disclosure.Panel>
          </>
        )}
      </Disclosure>
    </>
  );
};

export const Sidebar = ({ className }: SidebarProps) => {
  const { t } = useTranslation();

  return (
    <div className={`w-full lg:col-span-2 sm:rounded-lg p-3 shadow ${className}`}>
      <div className='flex items-center justify-between mb-3.5'>
        <h1 className='text-2xl font-medium text-gray-900 dark:text-gray-200'>{t('transactions.filters')}</h1>
      </div>
      <FilterDisclosure />
    </div>
  );
};
import React from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';

import { MiniTopbar } from '../../../components/Layout/MiniTopbar';
import { useData } from '../../../context/DataContext';

import { Action } from '../../../types';

type ActionProps = {
  action: Action;
};

const ActionCard = ({ action }: ActionProps) => {
  const { t } = useTranslation();

  return (
    <div className='flex flex-col rounded-lg shadow-md w-96 overflow-hidden'>
      <div className='flex-grow divide-y-2 divide-gray-200 dark:divide-gray-500 bg-white dark:bg-gray-800'>
        <div className='px-4 py-3 dark:bg-gray-900'>
          <h2 className='font-bold text-lg text-gray-800 dark:text-gray-50'>{action.name} - {action.reward / 100} UDC</h2>
          <span className='text-gray-600 dark:text-gray-300'>{action.company_name}</span>
        </div>
        <div className='px-4 py-3 text-gray-800 dark:text-gray-50'>
          <p>{action.description}</p>
        </div>
      </div>
      <Link to={`/actions/register/${action.id}`} className='flex items-center justify-center h-12 w-full text-xl transition-colors text-gray-200 bg-indigo-600 hover:bg-indigo-500 dark:bg-indigo-500 dark:hover:bg-indigo-400'>
        <span>{t('actions.registerAction')}</span>
      </Link>
    </div>
  );
};

export const Actions = () => {
  const { t } = useTranslation();
  const { data } = useData();

  const actions = data.actions.filter(action => action.kpi < action.kpi_target);

  return (
    <>
      <MiniTopbar title={t('main.actions')} />
      {actions.length === 0 && <h2 className='text-xl font-medium text-gray-600 dark:text-gray-200'>{t('errors.noActions')}</h2>}
      <div className='flex flex-wrap gap-6 px-2 sm:px-0'>
        {actions.map(action =>
          <ActionCard key={action.id} action={action} />
        )}
      </div>
    </>
  );
};
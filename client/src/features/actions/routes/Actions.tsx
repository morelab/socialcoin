import React from 'react';
import { Link } from 'react-router-dom';
import { MiniTopbar } from '../../../components/Layout/MiniTopbar';

import { Action } from '../../../types';
import { getActions } from '../api/getActions';

type ActionProps = {
  action: Action;
};

const ActionCard = ({ action }: ActionProps) => {
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
        <span>Register action</span>
      </Link>
    </div>
  );
};

export const Actions = () => {
  const [actions, setActions] = React.useState<Action[]>([]);

  React.useEffect(() => {
    const loadActions = async () => {
      const actions = await getActions();
      setActions(actions);
    };
    loadActions();
  }, []);

  return (
    <>
      <MiniTopbar title='Actions' />
      <div className='flex flex-wrap gap-6 px-2 sm:px-0'>
        {actions.filter(action => action.kpi < action.kpi_target).map(action =>
          <ActionCard key={action.id} action={action} />
        )}
      </div>
    </>
  );
};
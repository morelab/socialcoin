import React, { useState, useEffect } from 'react';
import { Link, Redirect } from 'react-router-dom';
import actionService from '../services/actions';
import { useUser } from '../context/UserContext';

const Action = ({ action }) => {
  return (
    <div className='flex flex-col rounded-lg shadow-md w-96 overflow-hidden'>
      <div className='flex-grow divide-y-2 divide-gray-200 dark:divide-gray-500 bg-white dark:bg-gray-800'>
        <div className='px-4 py-3 dark:bg-gray-900'>
          <h2 className='font-bold text-lg text-gray-800 dark:text-gray-50'>{action.name} - {action.reward/100} UDC</h2>
          <span className='text-gray-600 dark:text-gray-300'>{action.company}</span>
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

const Actions = () => {
  const [actions, setActions] = useState([]);
  const { user } = useUser();

  if (user.role === 'PM') {
    return <Redirect to="/dashboard/campaigns" />;
  }

  useEffect(() => {
    const loadActions = async () => {
      const actions = await actionService.getAll();
      setActions(actions);
    };
    loadActions();
  }, []);

  return (
    <div className='p-5'>
      <h1 className='text-3xl font-semibold text-gray-700 dark:text-white mb-3'>Actions</h1>
      <div className='flex flex-wrap gap-6'>
        {actions.filter(action => action.kpi < action.kpi_target).map(action =>
          <Action key={action.id} action={action} />
        )}
      </div>
    </div>
  );
};

export default Actions;
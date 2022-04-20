import { useRoutes } from 'react-router-dom';

import { publicRoutes } from './public';
import { getProtectedRoutes } from './protected';
import { useUser } from '../context/UserContext';
import { useUserRequired } from '../hooks/useUserRequired';
import { Spinner } from '../components/Elements/Spinner';

export const AppRoutes = () => {
  const { user } = useUser();
  const userLoaded = useUserRequired();

  const routes = user ? getProtectedRoutes(user.role) : publicRoutes;

  const element = useRoutes(routes);

  if (!userLoaded) {
    // TODO add logo on top
    return (
      <div className='h-screen w-screen flex flex-col items-center justify-center dark:bg-gray-900'>
        <Spinner size='xl' />
        <h1 className='mt-10 text-3xl font-light dark:text-white'>Please wait...</h1>
      </div>
    );
  }

  return <>{element}</>;
};
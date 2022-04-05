import React from 'react';
import { PencilIcon } from '@heroicons/react/solid';
import { useUser } from '../../../context/UserContext';
import userService from '../../../services/users';
import ConfirmationModal from '../../../components/overlay/ConfirmationModal';
import { RoleKey } from '../../../types';

export const Profile = () => {
  const { user, setUser } = useUser();
  const [formName, setFormName] = React.useState(user.name);
  const [openModal, setOpenModal] = React.useState(false);

  const handleFormChange = (e: React.FormEvent<HTMLInputElement>) => setFormName(e.currentTarget.value);
  const reduceAddress = (address: string) => address.slice(0, 7) + '...' + address.slice(address.length - 5);

  const handleOpenModal = (e: React.FormEvent) => {
    e.preventDefault();
    setOpenModal(true);
  };

  const handleProfileEdit = async () => {
    await userService.updateSelf(formName);
    setUser({ ...user, name: formName });
  };

  const getRoleText = (role: RoleKey) => {
    if (role === 'AD') return 'Administrator';
    else if (role === 'PM') return 'Promoter';
    else return 'Collaborator';
  };

  return (
    <>
      <ConfirmationModal
        open={openModal}
        setOpen={setOpenModal}
        title="Confirm name change"
        content={`Are you sure you want to change your name from '${user.name}' to '${formName}'?`}
        confirmHandler={handleProfileEdit}
      />
      <div className='flex items-center justify-center w-full p-3'>
        <div className='max-w-lg w-full'>
          <div>
            <div className="flex items-center justify-center text-sm p-5">
              <span className="sr-only">Open user menu</span>
              <img
                className="h-20 w-20 rounded-full border-4 border-solid border-white dark:border-gray-800 -mb-14"
                src={user !== null ? user.picture_url : 'https://www.vhv.rs/dpng/d/436-4363443_view-user-icon-png-font-awesome-user-circle.png'}
                alt="Menu"
                referrerPolicy='no-referrer'
              />
            </div>
          </div>
          <div className='p-5 pt-10 bg-white dark:bg-gray-800 rounded-lg'>
            <form action="#" method="POST" onSubmit={handleOpenModal}>
              <label htmlFor="username" className="block text-md font-medium text-gray-700 dark:text-gray-100">
                Name
              </label>
              <div className="mt-1 relative rounded-md shadow-sm">
                <input
                  type="text"
                  name="username"
                  id="username"
                  className="p-2 mt-1 border border-opacity-50 dark:bg-gray-900 dark:text-gray-300 border-gray-400 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm rounded-md"
                  value={formName}
                  onChange={handleFormChange}
                />
                <button type='submit' className="focus:ring-indigo-500 focus:border-indigo-500 absolute inset-y-0 right-0 flex items-center justify-end rounded group">
                  <PencilIcon className='h-10 p-1 mr-1 border-transparent bg-transparent text-gray-500 sm:text-sm rounded-md group-hover:text-indigo-400 border-2 hover:border-indigo-400 transition-colors' />
                </button>
              </div>
            </form>
            <div className='mt-7'>
              <span className='block text-md font-medium text-indigo-600 dark:text-indigo-300'>Email</span>
              <div className='py-2 border-2 border-b-gray-300 border-x-transparent border-t-transparent block w-full dark:text-gray-100'>
                {user.email}
              </div>
            </div>
            <div className='mt-6'>
              <span className='block text-md font-medium text-indigo-600 dark:text-indigo-300'>Role</span>
              <div className='py-2 border-2 border-b-gray-300 border-x-transparent border-t-transparent block w-full dark:text-gray-100'>
                {getRoleText(user.role)}
              </div>
            </div>
            <div className='mt-6'>
              <span className='block text-md font-medium text-indigo-600 dark:text-indigo-300'>Blockchain address</span>
              <div className='py-2 border-2 border-b-gray-300 border-x-transparent border-t-transparent block w-full dark:text-gray-100'>
                {reduceAddress(user.blockchain_public)}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
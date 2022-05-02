import React from 'react';
import { RadioGroup } from '@headlessui/react';
import { useTranslation } from 'react-i18next';

import { Button } from '../../../../components/Elements/Button';

import { useUser } from '../../../../context/UserContext';
import { Role, RoleKey, User } from '../../../../types';
import { getUsers } from '../../api/getUsers';
import { updateUserRole } from '../../api/updateUserRole';
import { SearchBar } from '../../../../components/Form/SearchBar';

type RoleValue = {
  key: RoleKey;
  value: Role;
}

const roles = [
  { key: 'AD', value: 'Administrator' },
  { key: 'PM', value: 'Promoter' },
  { key: 'CB', value: 'Collaborator' },
] as RoleValue[];

type RoleGroupProps = {
  baseRole: RoleKey;
  selected: RoleValue;
  setSelected: (role: RoleValue) => void;
};

type TableRowProps = {
  user: User;
  allUsers: User[];
  setAllUsers: (users: User[]) => void;
};


const RoleListbox = ({ baseRole, selected, setSelected }: RoleGroupProps) => {
  return (
    <RadioGroup value={selected} onChange={setSelected}>
      <RadioGroup.Label className="sr-only">Server size</RadioGroup.Label>
      <div className="flex items-center justify-start gap-2">
        {roles.map((role) => (
          <RadioGroup.Option
            key={role.key}
            value={role}
            className={({ active, checked }) => `
              ${active ? 'ring-2 ring-offset-2 ring-offset-indigo-300 ring-white ring-opacity-60' : ''}
              ${checked ? 'bg-indigo-500 dark:bg-indigo-300 bg-opacity-75 text-white' : 'bg-indigo-50 dark:bg-gray-600'}
              relative rounded-lg shadow-md px-5 py-4 cursor-pointer flex focus:outline-none
            `}
          >
            {({ active, checked }) => (
              <>
                <div className="flex items-center justify-between w-full">
                  <div className="flex items-center">
                    <div className="text-sm">
                      <RadioGroup.Label
                        as="p"
                        className={`
                          ${checked || active ? 'text-white dark:text-gray-900' : 'text-gray-900 dark:text-white'}
                          ${baseRole === role.key && 'underline'}
                          font-medium text-base
                        `}
                      >
                        {role.value}
                      </RadioGroup.Label>
                    </div>
                  </div>
                </div>
              </>
            )}
          </RadioGroup.Option>
        ))}
      </div>
    </RadioGroup>
  );
};

const TableRow = ({ user, allUsers, setAllUsers }: TableRowProps) => {
  const [selectedRole, setSelectedRole] = React.useState<RoleValue>(roles.find(r => r.key === user.role) ?? roles[0]);
  const { t } = useTranslation();

  const updateHandler = async () => {
    const updatedUser = await updateUserRole(user.id, { new_role: selectedRole.key });
    setAllUsers(allUsers.map(u => {
      if (u.id === user.id) return updatedUser;
      return u;
    }));
  };

  return (
    <tr>
      <td className="px-2 py-2 whitespace-normal">
        <div className="flex items-center">
          <div className="ml-4">
            <div className="text-md font-semibold text-gray-900 dark:text-gray-50">{user.name}</div>
            <div className="text-md text-gray-500 dark:text-gray-300">{user.email}</div>
          </div>
        </div>
      </td>
      <td className="px-2 py-2 whitespace-normal min-w-max">
        <div className="text-md text-gray-900 max-w-xl md:max-w-xl lg:max-w-2xl xl:max-w-3xl dark:text-gray-50">
          <RoleListbox baseRole={user.role} selected={selectedRole} setSelected={setSelectedRole} />
        </div>
      </td>
      <td className="px-2 py-2 whitespace-normal min-w-max">
        <Button onClick={updateHandler}>{t('dashboard.tables.saveChanges')}</Button>
      </td>
    </tr>
  );
};

export const UsersTable = () => {
  const [searchValue, setSearchValue] = React.useState('');
  const [users, setUsers] = React.useState<User[]>([]);
  const { t } = useTranslation();
  const { user } = useUser();

  if (!user) return null;

  React.useEffect(() => {
    getUsers()
      .then(result => setUsers(result))
      .catch(error => console.error(error));
  }, []);

  const handleSearch = (event: React.FormEvent<HTMLInputElement>) => {
    const value = event.currentTarget.value;
    setSearchValue(value);
  };

  const userList = searchValue === ''
    ? users
    : users.filter(user => {
      return user.email.toLowerCase().includes(searchValue.toLowerCase())
        || user.name.toLowerCase().includes(searchValue.toLowerCase());
    });

  return (
    <div className="shadow overflow-x-auto lg:border-b lg:border-gray-200 lg:rounded-lg dark:border-gray-800 bg-white dark:bg-gray-800 divide-y divide-gray-500">
      <div className='m-2 px-2 sm:px-3.5 flex items-center justify-between'>
        <h2 className='text-xl sm:text-2xl font-bold mr-5 text-gray-900 dark:text-gray-50'>{t('main.users')}</h2>
        <SearchBar value={searchValue} changeHandler={handleSearch} />
      </div>
      <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-600">
        <thead className="bg-gray-50 dark:bg-gray-900">
          <tr>
            <th
              scope="col"
              className="px-6 py-3 text-left text-md font-bold text-gray-500 uppercase tracking-wider dark:text-gray-200"
            >
              {t('dashboard.tables.user')}
            </th>
            <th
              scope="col"
              className="px-6 py-3 text-left text-md font-bold text-gray-500 uppercase tracking-wider dark:text-gray-200"
            >
              {t('dashboard.tables.role')}
            </th>
            <th scope="col" className="relative px-6 py-3">
              <span className="sr-only">{t('dashboard.tables.saveRoleChange')}</span>
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200 dark:divide-gray-600 dark:bg-gray-800">
          {userList.filter(u => u.id !== user.id).map(user => <TableRow key={user.id} user={user} allUsers={users} setAllUsers={setUsers} />)}
        </tbody>
      </table>
    </div>
  );
};
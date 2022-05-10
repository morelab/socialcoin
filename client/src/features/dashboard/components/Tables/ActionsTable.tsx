import React from 'react';
import { useTranslation } from 'react-i18next';

import { QRModal } from './QRModal';
import { EditActionMenu } from '../Menus/EditActionMenu';
import { SearchBar } from '../../../../components/Form/SearchBar';

import { Action } from '../../../../types';
import { useData } from '../../../../context/DataContext';

export const ActionsTable = () => {
  const [searchValue, setSearchValue] = React.useState('');
  const [openSlide, setOpenSlide] = React.useState(false);
  const [openQR, setOpenQR] = React.useState(false);
  const [activeID, setActiveID] = React.useState('');
  const [slideAction, setSlideAction] = React.useState<Action>({} as Action);
  const { t } = useTranslation();
  const { data } = useData();

  const handleQR = (id: string) => {
    setActiveID(id);
    setOpenQR(true);
  };

  const handleEdit = (action: Action) => {
    setSlideAction(action);
    setOpenSlide(true);
  };

  const handleSearch = (event: React.FormEvent<HTMLInputElement>) => {
    const value = event.currentTarget.value;
    setSearchValue(value);
  };

  const actions = searchValue === ''
    ? data.actions
    : data.actions.filter(action => {
      return action.name.toLowerCase().includes(searchValue.toLowerCase())
        || action.company_name.toLowerCase().includes(searchValue.toLowerCase())
        || action.description.toLowerCase().includes(searchValue.toLowerCase())
        || action.kpi_indicator.toLowerCase().includes(searchValue.toLowerCase());
    });

  return (
    <>
      <EditActionMenu action={slideAction} open={openSlide} setOpen={setOpenSlide} />
      <QRModal open={openQR} setOpen={setOpenQR} url={`${window.location.href}/register/${activeID}`} />
      <div className="shadow block whitespace-nowrap overflow-x-auto lg:border-b lg:border-gray-200 lg:rounded-lg dark:border-gray-800 bg-white dark:bg-gray-800 divide-y divide-gray-500">
        <div className='m-2 px-2 sm:px-3.5 flex items-center justify-between'>
          <h2 className='text-xl sm:text-2xl font-bold mr-5 text-gray-900 dark:text-gray-50'>{t('main.actions')}</h2>
          <SearchBar value={searchValue} changeHandler={handleSearch} />
        </div>
        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-600">
          <thead className="bg-gray-50 dark:bg-gray-900">
            <tr>
              <th
                scope="col"
                className="px-6 py-3 text-left text-md font-bold text-gray-500 uppercase tracking-wider dark:text-gray-200"
              >
                {t('dashboard.tables.name')}
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-md font-bold text-gray-500 uppercase tracking-wider dark:text-gray-200"
              >
                {t('dashboard.tables.description')}
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-md font-bold text-gray-500 uppercase tracking-wider dark:text-gray-200"
              >
                {t('dashboard.tables.reward')}
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-md font-bold text-gray-500 uppercase tracking-wider dark:text-gray-200"
              >
                {t('dashboard.tables.indicator')}
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-md font-bold text-gray-500 uppercase tracking-wider dark:text-gray-200"
              >
                {t('dashboard.tables.progress')}
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-md font-bold text-gray-500 uppercase tracking-wider dark:text-gray-200"
              >
                QR
              </th>
              <th scope="col" className="relative px-6 py-3">
                <span className="sr-only">{t('common.edit')}</span>
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200 dark:divide-gray-600 dark:bg-gray-800">
            {actions.map((action) => (
              <tr key={action.id}>
                <td className="px-2 py-2 whitespace-normal">
                  <div className="flex items-center">
                    <div className="ml-4">
                      <div className="text-md font-semibold text-gray-900 dark:text-gray-50">{action.name}</div>
                      <div className="text-md text-gray-500 dark:text-gray-300">{data.campaigns.find(c => c.id === action.campaign_id)?.name}</div>
                      <div className="text-md opacity-80 text-gray-500 dark:text-gray-300">{action.company_name}</div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-normal">
                  <div className="text-md max-w-xl text-gray-900 dark:text-gray-50">{action.description}</div>
                </td>
                <td className="px-6 py-4 whitespace-normal">
                  <div className="text-md text-gray-900 dark:text-gray-50">{action.reward / 100} UDC</div>
                </td>
                <td className="px-6 py-4 whitespace-normal">
                  <div className="text-md text-gray-900 dark:text-gray-50">{action.kpi_indicator}</div>
                </td>
                <td className="px-6 py-4 whitespace-normal">
                  <div className="text-md text-gray-900 dark:text-gray-50">{`${action.kpi}/${action.kpi_target}`}</div>
                </td>
                <td className="px-6 py-4 whitespace-normal">
                  <div onClick={() => handleQR(action.id)} className="cursor-pointer text-md text-indigo-600 hover:text-indigo-900 dark:text-indigo-300 dark:hover:text-indigo-200">
                    {t('dashboard.tables.download')}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-md font-medium">
                  <div onClick={() => handleEdit(action)} className="cursor-pointer text-indigo-600 hover:text-indigo-900 dark:text-indigo-300 dark:hover:text-indigo-200">
                    {t('common.edit')}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
};
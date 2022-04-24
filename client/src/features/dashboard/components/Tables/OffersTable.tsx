import React from 'react';
import { useTranslation } from 'react-i18next';

import { QRModal } from './QRModal';
import { SearchBar } from '../../../../components/Form/SearchBar';
import { EditOfferMenu } from '../Menus/EditOfferMenu';

import { Offer } from '../../../../types';
import { useData } from '../../../../context/DataContext';

export const OffersTable = () => {
  const [searchValue, setSearchValue] = React.useState('');
  const [openSlide, setOpenSlide] = React.useState(false);
  const [openQR, setOpenQR] = React.useState(false);
  const [activeID, setActiveID] = React.useState('');
  const [slideOffer, setSlideOffer] = React.useState<Offer>({} as Offer);
  const { t } = useTranslation();
  const { data } = useData();

  const handleQR = (id: string) => {
    setActiveID(id);
    setOpenQR(true);
  };

  const handleEdit = (offer: Offer) => {
    setSlideOffer(offer);
    setOpenSlide(true);
  };

  const handleSearch = (event: React.FormEvent<HTMLInputElement>) => {
    const value = event.currentTarget.value;
    setSearchValue(value);
  };

  const offers = searchValue === ''
    ? data.offers
    : data.offers.filter(offer => {
      return offer.name.toLowerCase().includes(searchValue.toLowerCase())
        || offer.company_name.toLowerCase().includes(searchValue.toLowerCase())
        || offer.description.toLowerCase().includes(searchValue.toLowerCase());
    });

  return (
    <>
      <EditOfferMenu offer={slideOffer} open={openSlide} setOpen={setOpenSlide} />
      <QRModal open={openQR} setOpen={setOpenQR} url={`${window.location.href}/redeem/${activeID}`} />
      <div className="shadow overflow-x-auto lg:border-b lg:border-gray-200 lg:rounded-lg dark:border-gray-800 bg-white dark:bg-gray-800 divide-y divide-gray-500">
        <div className='m-2 px-2 sm:px-3.5 flex items-center justify-between'>
          <h2 className='text-xl sm:text-2xl font-bold mr-5 text-gray-900 dark:text-gray-50'>{t('main.offers')}</h2>
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
                {t('dashboard.tables.price')}
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
            {offers.map((offer) => (
              <tr key={offer.id}>
                <td className="px-2 py-2 whitespace-nowrap">
                  <div className="flex items-center">
                    <div className="ml-4">
                      <div className="text-md font-semibold text-gray-900 dark:text-gray-50">{offer.name}</div>
                      <div className="text-md text-gray-500 dark:text-gray-300">{offer.company_name}</div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-normal">
                  <div className="text-md text-gray-900 dark:text-gray-50">{offer.description}</div>
                </td>
                <td className="px-6 py-4 whitespace-normal">
                  <div className="text-md text-gray-900 dark:text-gray-50">{offer.price / 100} UDC</div>
                </td>
                <td className="px-6 py-4 whitespace-normal">
                  <div onClick={() => handleQR(offer.id)} className="text-md cursor-pointer text-indigo-600 hover:text-indigo-900 dark:text-indigo-300 dark:hover:text-indigo-200">
                    {t('dashboard.tables.download')}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-md font-medium">
                  <div onClick={() => handleEdit(offer)} className="cursor-pointer text-indigo-600 hover:text-indigo-900 dark:text-indigo-300 dark:hover:text-indigo-200">
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
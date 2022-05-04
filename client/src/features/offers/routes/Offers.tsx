import React from 'react';
import { Link } from 'react-router-dom';
import { CreditCardIcon } from '@heroicons/react/solid';
import { useTranslation } from 'react-i18next';

import { MiniTopbar } from '../../../components/Layout/MiniTopbar';
import { useUser } from '../../../context/UserContext';
import { useData } from '../../../context/DataContext';
import { getSelfUserBalance } from '../api/getSelfUserBalance';
import { Offer } from '../../../types';
import { EmptyTableNotice } from '../../dashboard/components/EmptyTableNotice';


type OfferProps = {
  offer: Offer;
};

const OfferCard = ({ offer }: OfferProps) => {
  const { t } = useTranslation();

  return (
    <div className='flex flex-col rounded-lg shadow-md w-96 h-36 overflow-hidden'>
      <div className='flex-grow divide-x-2 divide-gray-200 grid grid-cols-5 bg-white dark:bg-gray-800'>
        <div className='col-span-3 flex flex-col justify-center p-4'>
          <h2 className='font-bold text-lg text-gray-800 dark:text-gray-50'>{offer.name}</h2>
          <span className='text-gray-600 dark:text-gray-300'>{offer.company_name}</span>
        </div>
        <div className='col-span-2 flex flex-col items-center justify-center text-gray-800 dark:text-gray-50'>
          <div>
            <span className='font-semibold text-4xl'>{offer.price / 100}</span> <span className='font-medium text-lg'>UDC</span>
          </div>
        </div>
      </div>
      <Link to={`/offers/redeem/${offer.id}`} className='flex items-center justify-center h-12 w-full text-xl transition-colors text-gray-200 bg-indigo-600 hover:bg-indigo-500 dark:bg-indigo-500 dark:hover:bg-indigo-400'>
        <CreditCardIcon className='h-7 w-7 mr-3' />
        <span>{t('offers.redeemOffer')}</span>
      </Link>
    </div>
  );
};

export const Offers = () => {
  const { user, setUser } = useUser();
  const { t } = useTranslation();
  const { data } = useData();

  React.useEffect(() => {
    getSelfUserBalance().then(balance => {
      if (user) setUser({ ...user, balance: balance });
    });
  }, []);

  return (
    <>
      <MiniTopbar title={`Offers - ${user && user.balance / 100} UDC`} />
      {data.offers.length === 0 && <EmptyTableNotice title={t('errors.noOffers')} />}
      <div className='flex flex-wrap gap-6 mx-w'>
        {data.offers.map(offer =>
          <OfferCard key={offer.id} offer={offer} />
        )}
      </div>
    </>
  );
};
import React, { useState, useEffect } from 'react';
import { CreditCardIcon } from '@heroicons/react/solid';
import offerService from '../services/offers';
import userService from '../services/users';
import { Link, Redirect } from 'react-router-dom';
import { useUser } from '../context/UserContext';

const Offer = ({ offer }) => {
  return (
    <div className='flex flex-col rounded-lg shadow-md w-96 h-36 overflow-hidden'>
      <div className='flex-grow divide-x-2 divide-gray-200 grid grid-cols-5 bg-white dark:bg-gray-800'>
        <div className='col-span-3 flex flex-col justify-center p-4'>
          <h2 className='font-bold text-lg text-gray-800 dark:text-gray-50'>{offer.name}</h2>
          <span className='text-gray-600 dark:text-gray-300'>{offer.company}</span>
        </div>
        <div className='col-span-2 flex flex-col items-center justify-center text-gray-800 dark:text-gray-50'>
          <div>
            <span className='font-semibold text-4xl'>{offer.price / 100}</span> <span className='font-medium text-lg'>UDC</span>
          </div>
        </div>
      </div>
      <Link to={`/offers/redeem/${offer.id}`} className='flex items-center justify-center h-12 w-full text-xl transition-colors text-gray-200 bg-indigo-600 hover:bg-indigo-500 dark:bg-indigo-500 dark:hover:bg-indigo-400'>
        <CreditCardIcon className='h-7 w-7 mr-3' />
        <span>Redeem offer</span>
      </Link>
    </div>
  );
};

const Offers = () => {
  const [offers, setOffers] = useState([]);
  const { user, setUser } = useUser();

  if (user.role === 'PM') {
    return <Redirect to="/dashboard/campaigns" />;
  }

  useEffect(() => {
    const loadOffers = async () => {
      const offers = await offerService.getAll();
      setOffers(offers);
    };
    loadOffers();
  }, []);

  useEffect(() => {
    userService.getSelfBalance().then(result => setUser({ ...user, balance: result.balance }));
  }, []);

  return (
    <div className='p-5'>
      <h1 className='text-3xl font-semibold text-gray-700 dark:text-white mb-3'>Offers - {user.balance / 100} UDC</h1>
      {offers.length === 0 && <h2 className='text-xl font-medium text-gray-600 dark:text-gray-200'>No offers created yet.</h2>}
      <div className='flex flex-wrap gap-6'>
        {offers.map(offer =>
          <Offer key={offer.id} offer={offer} />
        )}
      </div>
    </div>
  );
};

export default Offers;
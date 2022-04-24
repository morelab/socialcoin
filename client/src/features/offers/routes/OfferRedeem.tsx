import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ShoppingBagIcon, SwitchHorizontalIcon } from '@heroicons/react/outline';
import { useTranslation } from 'react-i18next';

import { Spinner } from '../../../components/Elements/Spinner';
import ConfirmationModal from '../../dashboard/components/ConfirmationModal';

import { Offer } from '../../../types';
import { getOffer } from '../api/getOffer';
import { redeemOffer } from '../api/redeemOffer';
import { useUser } from '../../../context/UserContext';
import { notifyError } from '../../../utils/notifications';
import { MiniTopbar } from '../../../components/Layout/MiniTopbar';


export const OfferRedeem = () => {
  const offerID = useParams<{ id: string }>().id;
  const [offer, setOffer] = React.useState<Offer>({} as Offer);
  const [openModal, setOpenModal] = React.useState(false);
  const [paymentState, setPaymentState] = React.useState('initial');
  const { user, setUser } = useUser();
  const { t } = useTranslation();
  const navigate = useNavigate();

  React.useEffect(() => {
    if (offerID) {
      getOffer(offerID).then(action => setOffer(action));
    }
  }, []);

  if (!offer) {
    return (
      <div className='px-5 flex items-center justify-center'>
        <Spinner />
      </div>
    );
  }

  const handleOpenModal = async () => {
    if (user && user.balance < offer.price) {
      notifyError('Not enough balance in your account.');
    } else {
      setOpenModal(true);
    }
  };

  const handlePayment = async () => {
    if (user) {
      setPaymentState('redeeming');
      await redeemOffer(offer.id.toString());
      setPaymentState('redeemed');
      const newUser = {
        ...user,
        balance: user.balance - offer.price
      };
      setUser(newUser);
    }
  };

  const getBottomSection = () => {
    if (paymentState === 'redeeming') {
      return (
        <div className='flex flex-col items-center justify-center'>
          <h2 className='text-xl dark:text-gray-200'>{t('common.pleaseWait')}...</h2>
          <Spinner />
        </div>
      );
    } else if (paymentState === 'redeemed') {
      return (
        <div className='flex flex-col items-center justify-center'>
          <h3 className='text-xl text-center font-semibold dark:text-gray-100 mb-4'>{t('actions.successfulPayment')}!</h3>
          <p className='text-center dark:text-gray-300 mb-5'>
            {t('offers.referToCreator')}
          </p>
          <button
            type="button"
            onClick={() => navigate('/offers')}
            className="inline-flex justify-center py-2 px-4 border border-gray-400 w-full shadow-sm text-md font-medium
                rounded-md text-gray-800 dark:text-white hover:bg-gray-200 focus:outline-none focus:ring-2 mb-3
                focus:ring-offset-2 focus:ring-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-700 transition"
          >
            {t('offers.backToOffers')}
          </button>
        </div>
      );
    } else {
      return (
        <>
          <div className='flex items-center justify-between'>
            <span className='text-lg flex-1 text-gray-800 dark:text-gray-200 flex justify-start'>{user?.name}</span>
            <SwitchHorizontalIcon className="h-10 w-10 text-gray-500 dark:text-gray-200 mx-4 md:mx-10" aria-hidden="true" />
            <span className='text-lg text-right flex-1 text-gray-800 dark:text-gray-200 flex justify-end'>{offer.company_name}</span>
          </div>
          <div className='flex flex-col sm:flex-row items-center justify-center gap-x-4 w-full'>
            <button
              type="button"
              onClick={() => navigate('/offers')}
              className="inline-flex justify-center py-2 px-4 border border-gray-400 w-full shadow-sm text-md font-medium
                rounded-md text-gray-800 dark:text-white hover:bg-gray-200 focus:outline-none focus:ring-2 mb-3
                focus:ring-offset-2 focus:ring-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-700 transition"
            >
              {t('offers.backToOffers')}
            </button>
            <button
              type="button"
              onClick={handleOpenModal}
              className="inline-flex justify-center py-2 px-4 border border-transparent w-full shadow-sm text-md font-medium
                rounded-md text-gray-200 bg-indigo-600 hover:bg-indigo-500 dark:bg-indigo-500 dark:hover:bg-indigo-400
                focus:outline-none focus:ring-2 mb-3 focus:ring-offset-2 focus:ring-indigo-500 transition"
            >
              {t('common.redeem')}
            </button>
          </div>
        </>
      );
    }
  };

  return (
    <>
      <ConfirmationModal
        open={openModal}
        setOpen={setOpenModal}
        title={t('offers.confirmRedemption')}
        content={`Do you want to redeem the offer '${offer.name}' in exchange for ${offer.price / 100} UDC?`} // TODO
        confirmHandler={handlePayment}
      />
      <MiniTopbar title={`${t('offers.offerRedemption')} - ${user && user.balance / 100} UDC`} />
      <div className='flex items-center justify-center transition'>
        <div className='shadow-lg max-w-3xl m-5 bg-gray-100 dark:bg-gray-800 rounded-lg overflow-hidden divide-y divide-gray-200 dark:divide-gray-700'>
          <div className='bg-gray-50 dark:bg-gray-900 h-full w-full px-7 sm:px-10 lg:px-20 py-7 flex flex-col items-center gap-4'>
            <div className="mx-auto flex-shrink-0 flex items-center justify-center h-14 w-14 rounded-full bg-indigo-200 dark:bg-indigo-100 sm:mx-0 sm:h-16 sm:w-16">
              <ShoppingBagIcon className="h-10 w-10 text-indigo-600 dark:text-indigo-500" aria-hidden="true" />
            </div>
            <span className='text-2xl text-center font-bold text-gray-800 dark:text-gray-100'>
              {offer.name} - {offer.price / 100} UDC
            </span>
          </div>
          <div className='h-full w-full px-7 sm:px-10 lg:px-20 py-5 flex flex-col items-center gap-6'>
            {getBottomSection()}
          </div>
        </div>
      </div>
    </>
  );
};
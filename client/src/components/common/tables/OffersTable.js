import React, { useState } from 'react';
import QRModal from './QRModal';
import SlideOver from '../../overlay/SlideOver';
import EditOfferForm from '../forms/EditOfferForm';
import { useDashboard } from '../../../context/DashboardContext';
import { useUser } from '../../../context/UserContext';

const OffersTable = () => {
  const [openSlide, setOpenSlide] = useState(false);
  const [openQR, setOpenQR] = useState(false);
  const [activeID, setActiveID] = useState(0);
  const [slideOffer, setSlideOffer] = useState({});
  const { state } = useDashboard();
  const { user } = useUser();

  const handleQR = (id) => {
    setActiveID(id);
    setOpenQR(true);
  };

  const handleEdit = (offer) => {
    setSlideOffer(offer);
    setOpenSlide(true);
  };

  const getOwnOffers = () => {
    return user.role === 'AD'
      ? state.offers
      : state.offers.filter(o => o.company_id === user.id);
  };

  return (
    <>
      <SlideOver open={openSlide} setOpen={setOpenSlide} >
        <EditOfferForm data={slideOffer} setOpen={setOpenSlide} />
      </SlideOver>
      <QRModal open={openQR} setOpen={setOpenQR} url={`${window.location.href}/redeem/${activeID}`} />
      <div className="shadow overflow-x-auto lg:border-b lg:border-gray-200 lg:rounded-lg dark:border-gray-800">
        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-600">
          <thead className="bg-gray-50 dark:bg-gray-900">
            <tr>
              <th
                scope="col"
                className="px-6 py-3 text-left text-md font-bold text-gray-500 uppercase tracking-wider dark:text-gray-200"
              >
                Name
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-md font-bold text-gray-500 uppercase tracking-wider dark:text-gray-200"
              >
                Description
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-md font-bold text-gray-500 uppercase tracking-wider dark:text-gray-200"
              >
                Price
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-md font-bold text-gray-500 uppercase tracking-wider dark:text-gray-200"
              >
                QR
              </th>
              <th scope="col" className="relative px-6 py-3">
                <span className="sr-only">Edit</span>
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200 dark:divide-gray-600 dark:bg-gray-800">
            {getOwnOffers().map((offer) => (
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
                    Download
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-md font-medium">
                  <div onClick={() => handleEdit(offer)} className="cursor-pointer text-indigo-600 hover:text-indigo-900 dark:text-indigo-300 dark:hover:text-indigo-200">
                    Edit
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

export default OffersTable;
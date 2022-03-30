import React, { useState } from 'react';
import FormPopup from './FormPopup';

import InputGroup from '../forms/InputGroup';
import TextareaGroup from '../forms/TextareaGroup';
import SubmitButton from '../forms/SubmitButton';
import { useDashboard } from '../../../context/DashboardContext';
import offerService from '../../../services/offers';
import { notifyWarning } from '../../../utils/notifications';

const NewOfferForm = ({ setOpen }) => {
  const [formState, setFormState] = useState({});
  const { dispatch } = useDashboard();

  const handleInputChange = (event) => {
    const target = event.target;
    const value = target.value;
    const name = target.name;

    setFormState({
      ...formState,
      [name]: value
    });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const newOffer = {
      name: formState.offerName,
      description: formState.offerDescription,
      price: formState.offerPrice * 100,
    };

    if (newOffer.price <= 0 || !newOffer.price) {
      notifyWarning('The price must be greater than zero.');
      return;
    }

    const createdOffer = await offerService.createNew(newOffer);
    dispatch({
      type: 'addOffer',
      payload: { 'newOffer': createdOffer }
    });
    setOpen(false);
  };

  return (
    <div className="md:grid md:grid-cols-3 md:gap-6 mt-8">
      <div className="md:col-span-1 shadow rounded-lg bg-sky-100 dark:bg-gray-900 p-4 mb-10">
        <div className="px-4 sm:px-0">
          <h3 className="mb-2 text-lg font-medium leading-6 text-gray-900 dark:text-gray-100">Create offer</h3>
          <p className="mt-1 text-sm text-gray-600 dark:text-gray-200">
          As a promoter, you can reward users that complete good deeds by offering them offers in exchange for the UDC
          earned. Offers must have a description detailing what the collaborators are paying for, and a price tag.
          </p>
        </div>
      </div>
      <div className="mt-5 md:mt-0 md:col-span-2">
        <form action="#" method="POST" onSubmit={handleSubmit}>
          <div className="bg-white dark:bg-gray-800">
            <div className="grid grid-cols-6 gap-6">
              <InputGroup
                label="Offer name"
                forName="offerName"
                type="text"
                value={formState.offerName || ''}
                handleInputChange={handleInputChange}
                required
              />
              <TextareaGroup
                label="Description"
                forName="offerDescription"
                value={formState.offerDescription || ''}
                handleInputChange={handleInputChange}
                required
              />
              <InputGroup
                label="Price"
                forName="offerPrice"
                type="number"
                value={formState.offerPrice || 0}
                handleInputChange={handleInputChange}
                required
              />
            </div>
          </div>
          <div className="px-4 py-3 text-right sm:px-6">
            <SubmitButton content="Create" />
          </div>
        </form>
      </div>
    </div>
  );
};

const NewOfferMenu = ({ open, setOpen }) => {
  return (
    <FormPopup open={open} setOpen={setOpen}>
      <NewOfferForm setOpen={setOpen} />
    </FormPopup>
  );
};

export default NewOfferMenu;
import React, { useState } from 'react';
import InputGroup from './InputGroup';
import TextareaGroup from './TextareaGroup';
import SubmitButton from './SubmitButton';
import DeleteButton from './DeleteButton';
import DeletionModal from './DeletionModal';
import { useDashboard } from '../../../context/DashboardContext';
import offerService from '../../../services/offers';
import { notifyWarning } from '../../../utils/notifications';


const EditOfferForm = ({ data, setOpen }) => {
  const [formState, setFormState] = useState({});
  const [openDelete, setOpenDelete] = useState(false);
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

  const handleOfferSubmit = async (e) => {
    e.preventDefault();

    const formOffer = {
      name: formState.offerName != undefined ? formState.offerName : data.name,
      description: formState.offerDescription != undefined ? formState.offerDescription : data.description,
      price: formState.offerPrice != undefined ? formState.offerPrice : data.price / 100,
    };

    if (formOffer.price <= 0) {
      notifyWarning('The offer price must be greater than zero.');
      return;
    }

    const editedOffer = await offerService.updateOne(data.id, formOffer);
    dispatch({
      type: 'editOffer',
      payload: { 'editedOffer': editedOffer }
    });
    setOpen(false);
  };

  const handleDelete = async () => {
    await offerService.deleteOne(data.id);
    dispatch({
      type: 'removeOffer',
      payload: { 'offerId': data.id }
    });
    setOpen(false);
  };

  return (
    <div className="mt-5 md:mt-0 md:col-span-2">
      <form action="#" method="POST" onSubmit={handleOfferSubmit}>
        <div className="bg-white dark:bg-gray-800">
          <div className="grid grid-cols-6 gap-6">
            <InputGroup
              label="Offer name"
              forName="offerName"
              type="text"
              value={formState.offerName != undefined ? formState.offerName : data.name}
              handleInputChange={handleInputChange}
              required
            />
            <TextareaGroup
              label="Description"
              forName="offerDescription"
              value={formState.offerDescription != undefined ? formState.offerDescription : data.description}
              handleInputChange={handleInputChange}
              required
            />
            <InputGroup
              label="Price"
              forName="offerPrice"
              type="number"
              value={formState.offerPrice != undefined ? formState.offerPrice : data.price / 100}
              handleInputChange={handleInputChange}
              required
            />
          </div>
        </div>
        <div className="px-4 py-3 text-right sm:px-6">
          <SubmitButton content="Save" />
          <DeleteButton content="Delete offer" clickHandler={() => setOpenDelete(true)} />
        </div>
      </form>
      <DeletionModal
        open={openDelete}
        setOpen={setOpenDelete}
        title="Delete offer"
        description={`Are you sure you want to delete the offer '${data.name}'? This action cannot be undone.`}
        buttonValue="Delete"
        confirmHandler={handleDelete}
      />
    </div>
  );
};

export default EditOfferForm;
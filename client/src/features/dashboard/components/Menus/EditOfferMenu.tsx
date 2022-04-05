import React from 'react';

import { Button } from '../../../../components/Elements/Button';
import { InputField } from '../../../../components/Form/InputField';
import { TextareaField } from '../../../../components/Form/TextareaField';
import { ContentModal } from '../../../../components/Overlay/ContentModal';
import { DeletionModal } from '../DeletionModal';

import { Offer } from '../../../../types';
import { useDashboard } from '../../../../context/DashboardContext';
import { notifyWarning } from '../../../../utils/notifications';
import offerService from '../../../services/offers';


type FormProps = {
  offer: Offer;
  close: () => void;
}

type MenuProps = {
  offer: Offer;
  open: boolean;
  setOpen: (open: boolean) => void;
};

type FormContent = {
  name: string;
  description: string;
  price: number;
};


const EditOfferForm = ({ offer, close }: FormProps) => {
  const [formState, setFormState] = React.useState<FormContent>({
    name: offer.name,
    description: offer.description,
    price: offer.price / 100
  });
  const [openDelete, setOpenDelete] = React.useState(false);
  const { dispatch } = useDashboard();

  const handleInputChange = (event: React.FormEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const target = event.currentTarget;
    const value = target.value;
    const name = target.name;

    setFormState({
      ...formState,
      [name]: value
    });
  };

  const handleOfferSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    const formOffer = {
      name: formState.name,
      description: formState.description,
      price: formState.price * 100
    };

    if (formOffer.price <= 0) {
      notifyWarning('The offer price must be greater than zero.');
      return;
    }

    const editedOffer = await offerService.updateOne(offer.id, formOffer);
    dispatch({
      type: 'editOffer',
      payload: editedOffer
    });
    close();
  };

  const handleDelete = async () => {
    await offerService.deleteOne(offer.id);
    dispatch({
      type: 'removeOffer',
      payload: offer.id
    });
    close();
  };

  return (
    <div className="mt-5 md:mt-0 md:col-span-2">
      <form action="#" method="POST" onSubmit={handleOfferSubmit}>
        <div className="bg-white dark:bg-gray-800">
          <div className="grid grid-cols-6 gap-6">
            <InputField
              label="Offer name"
              name="name"
              type="text"
              value={formState.name}
              onChange={handleInputChange}
              required
            />
            <TextareaField
              label="Description"
              name="description"
              value={formState.description}
              onChange={handleInputChange}
              required
            />
            <InputField
              label="Price"
              name="offerPrice"
              type="number"
              value={formState.price}
              onChange={handleInputChange}
              required
            />
          </div>
        </div>
        <div className="px-4 py-3 text-right sm:px-6">
          <Button type='submit' variant='submit'>Save</Button>
          <Button variant='delete' onClick={() => setOpenDelete(true)}>Delete offer</Button>
        </div>
      </form>
      <DeletionModal
        open={openDelete}
        setOpen={setOpenDelete}
        title="Delete offer"
        description={`Are you sure you want to delete the offer '${offer.name}'? This action cannot be undone.`}
        buttonValue="Delete"
        confirmHandler={handleDelete}
      />
    </div>
  );
};

export const NewOfferMenu = ({ offer, open, setOpen }: MenuProps) => {
  return (
    <ContentModal open={open} setOpen={setOpen}>
      <EditOfferForm offer={offer} close={() => setOpen(false)} />
    </ContentModal>
  );
};
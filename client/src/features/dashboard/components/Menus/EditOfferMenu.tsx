import React from 'react';

import { Button } from '../../../../components/Elements/Button';
import { InputField } from '../../../../components/Form/InputField';
import { TextareaField } from '../../../../components/Form/TextareaField';
import { DeletionModal } from '../DeletionModal';

import { Offer } from '../../../../types';
import { useDashboard } from '../../../../context/DashboardContext';
import { notifyWarning } from '../../../../utils/notifications';
import { updateOffer } from '../../api/updateOffer';
import { deleteOffer } from '../../api/deleteOffer';
import { SlideOver } from '../../../../components/Overlay/SlideOver';


type FormProps = {
  offer: Offer;
  close: () => void;
}

type MenuProps = {
  offer: Offer;
  open: boolean;
  setOpen: (open: boolean) => void;
};

export type FormContent = {
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

    const editedOffer = await updateOffer(offer.id, formOffer);
    dispatch({
      type: 'editOffer',
      payload: editedOffer
    });
    close();
  };

  const handleDelete = async () => {
    await deleteOffer(offer.id);
    dispatch({
      type: 'removeOffer',
      payload: offer.id
    });
    close();
  };

  return (
    <div className="mt-5 md:mt-0 md:col-span-2">
      <form action="#" method="POST" onSubmit={handleOfferSubmit} className='flex flex-col gap-4'>
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
        <div className="py-3 text-right">
          <Button type='submit' variant='submit'>Save</Button>
          <Button variant='delete' onClick={() => setOpenDelete(true)}>Delete offer</Button>
        </div>
      </form>
      <DeletionModal
        open={openDelete}
        setOpen={setOpenDelete}
        title="Delete offer"
        content={`Are you sure you want to delete the offer '${offer.name}'? This action cannot be undone.`}
        buttonValue="Delete"
        confirmHandler={handleDelete}
      />
    </div>
  );
};

export const EditOfferMenu = ({ offer, open, setOpen }: MenuProps) => {
  return (
    <SlideOver open={open} setOpen={setOpen}>
      <EditOfferForm offer={offer} close={() => setOpen(false)} />
    </SlideOver>
  );
};
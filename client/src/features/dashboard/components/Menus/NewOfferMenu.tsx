import React from 'react';

import { Button } from '../../../../components/Elements/Button';
import { InputField } from '../../../../components/Form/InputField';
import { TextareaField } from '../../../../components/Form/TextareaField';
import { ContentModal } from '../../../../components/Overlay/ContentModal';

import { useDashboard } from '../../../../context/DashboardContext';
import { notifyWarning } from '../../../../utils/notifications';
import { createOffer } from '../../api/createOffer';


type FormProps = {
  close: () => void;
};

type MenuProps = {
  open: boolean;
  setOpen: (open: boolean) => void;
};

export type NewOfferFormContent = {
  name: string;
  description: string;
  price: number;
};


const NewOfferForm = ({ close }: FormProps) => {
  const [formState, setFormState] = React.useState<NewOfferFormContent>({
    name: '',
    description: '',
    price: 0
  });
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

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    const newOffer = {
      name: formState.name,
      description: formState.description,
      price: formState.price * 100,
    };

    if (newOffer.price <= 0 || !newOffer.price) {
      notifyWarning('The price must be greater than zero.');
      return;
    }

    const createdOffer = await createOffer(newOffer);
    dispatch({
      type: 'addOffer',
      payload: createdOffer
    });
    close();
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
          <div className="bg-white dark:bg-gray-800 flex flex-col gap-4">
            <InputField
              label="Offer name"
              name="name"
              type="text"
              value={formState.name || ''}
              onChange={handleInputChange}
              required
            />
            <TextareaField
              label="Description"
              name="description"
              value={formState.description || ''}
              onChange={handleInputChange}
              required
            />
            <InputField
              label="Price"
              name="price"
              type="number"
              value={formState.price || 0}
              onChange={handleInputChange}
              required
            />
          </div>
          <div className="py-3 text-right">
            <Button type='submit' variant='submit'>
              Create
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export const NewOfferMenu = ({ open, setOpen }: MenuProps) => {
  return (
    <ContentModal open={open} setOpen={setOpen}>
      <NewOfferForm close={() => setOpen(false)} />
    </ContentModal>
  );
};
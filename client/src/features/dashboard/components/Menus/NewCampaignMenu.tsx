import React from 'react';
import { useTranslation } from 'react-i18next';

import { Button } from '../../../../components/Elements/Button';
import { InputField } from '../../../../components/Form/InputField';
import { TextareaField } from '../../../../components/Form/TextareaField';
import { ContentModal } from '../../../../components/Overlay/ContentModal';

import { useData } from '../../../../context/DataContext';
import { createCampaign } from '../../api/createCampaign';


type FormProps = {
  close: () => void;
};

type MenuProps = {
  open: boolean;
  setOpen: (open: boolean) => void;
};

export type NewCampaignFormContent = {
  name: string;
  description: string;
};


const NewCampaignForm = ({ close }: FormProps) => {
  const [formState, setFormState] = React.useState<NewCampaignFormContent>({ name: '', description: '' });
  const { t } = useTranslation();
  const { dispatchData } = useData();

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

    const newCampaign = {
      name: formState.name,
      description: formState.description,
    };

    const createdCampaign = await createCampaign(newCampaign);
    dispatchData({
      type: 'addCampaign',
      payload: createdCampaign
    });
    close();
  };

  return (
    <div className="md:grid md:grid-cols-3 md:gap-6 mt-8">
      <div className="md:col-span-1 shadow rounded-lg bg-sky-100 dark:bg-gray-900 p-4 mb-10">
        <div className="px-4 sm:px-0">
          <h3 className="mb-2 text-lg font-medium leading-6 text-gray-900 dark:text-gray-100">{t('dashboard.menus.createCampaign')}</h3>
          <p className="mt-1 text-sm text-gray-600 dark:text-gray-200">
            Campaigns are groups of good deeds with the objective of fulfilling the UN&apos;s Sustainable Development Goals.
          </p>
        </div>
      </div>
      <div className="mt-5 md:mt-0 md:col-span-2">
        <form action="#" method="POST" onSubmit={handleSubmit}>
          <div className="bg-white dark:bg-gray-800 flex flex-col gap-6">
            <InputField
              label={t('dashboard.menus.campaignName')}
              name="name"
              type="text"
              value={formState.name}
              onChange={handleInputChange}
              required
            />
            <TextareaField
              label={t('dashboard.tables.description')}
              name="description"
              value={formState.description}
              onChange={handleInputChange}
              required
            />
          </div>
          <div className="py-3 text-right">
            <Button type='submit' variant='submit'>
              {t('common.create')}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export const NewCampaignMenu = ({ open, setOpen }: MenuProps) => {
  return (
    <ContentModal open={open} setOpen={setOpen} className='p-4'>
      <NewCampaignForm close={() => setOpen(false)} />
    </ContentModal>
  );
};
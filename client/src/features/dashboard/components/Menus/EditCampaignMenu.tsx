import React from 'react';
import { useTranslation } from 'react-i18next';

import { Button } from '../../../../components/Elements/Button';
import { InputField } from '../../../../components/Form/InputField';
import { TextareaField } from '../../../../components/Form/TextareaField';
import { SlideOver } from '../../../../components/Overlay/SlideOver';
import { DeletionModal } from '../DeletionModal';

import { Campaign } from '../../../../types';
import { useData } from '../../../../context/DataContext';
import { updateCampaign } from '../../api/updateCampaign';
import { deleteCampagin } from '../../api/deleteCampaign';


type FormProps = {
  campaign: Campaign;
  close: () => void;
};

type MenuProps = {
  campaign: Campaign;
  open: boolean;
  setOpen: (open: boolean) => void;
};

export type FormContent = {
  name: string;
  description: string;
};


const EditCampaignForm = ({ campaign, close }: FormProps) => {
  const [formState, setFormState] = React.useState<FormContent>({
    name: campaign.name,
    description: campaign.description
  });
  const [openDelete, setOpenDelete] = React.useState(false);
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

  const handleCampaignSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    const formCampaign = {
      name: formState.name,
      description: formState.description,
    };

    const editedCampaign = await updateCampaign(campaign.id, formCampaign);
    dispatchData({
      type: 'editCampaign',
      payload: editedCampaign
    });
    close();
  };

  const handleDelete = async () => {
    await deleteCampagin(campaign.id);
    dispatchData({
      type: 'removeCampaign',
      payload: campaign.id
    });
    close();
  };

  return (
    <div className="mt-5 md:mt-0 md:col-span-2">
      <form action="#" method="POST" onSubmit={handleCampaignSubmit} className='flex flex-col gap-4'>
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
        <div className="py-3 text-right flex flex-col sm:flex-row items-center justify-center gap-2">
          <Button type='submit' variant='submit'>{t('common.save')}</Button>
          <Button variant='delete' onClick={() => setOpenDelete(true)}>{t('dashboard.menus.deleteCampaign')}</Button>
        </div>
      </form>
      <DeletionModal
        open={openDelete}
        setOpen={setOpenDelete}
        title={t('dashboard.menus.deleteCampaign')}
        content={`${t('dashboard.menus.deleteCampaignMsg')} '${campaign.name}'? ${t('common.cannotBeUndone')}.`}
        buttonValue={t('common.delete')}
        confirmHandler={handleDelete}
      />
    </div>
  );
};

export const EditCampaignMenu = ({ campaign, open, setOpen }: MenuProps) => {
  return (
    <SlideOver open={open} setOpen={setOpen} >
      <EditCampaignForm campaign={campaign} close={() => setOpen(false)} />
    </SlideOver>
  );
};
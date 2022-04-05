import React from 'react';

import { Button } from '../../../../components/Elements/Button';
import { InputField } from '../../../../components/Form/InputField';
import { TextareaField } from '../../../../components/Form/TextareaField';
import { SlideOver } from '../../../../components/Overlay/SlideOver';
import { DeletionModal } from '../DeletionModal';

import { Campaign } from '../../../../types';
import { useDashboard } from '../../../../context/DashboardContext';
import campaignService from '../../../services/campaigns';


type FormProps = {
  campaign: Campaign;
  close: () => void;
};

type MenuProps = {
  campaign: Campaign;
  open: boolean;
  setOpen: (open: boolean) => void;
};

type FormContent = {
  name: string;
  description: string;
};


const EditCampaignForm = ({ campaign, close }: FormProps) => {
  const [formState, setFormState] = React.useState<FormContent>({
    name: campaign.name,
    description: campaign.description
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

  const handleCampaignSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    const formCampaign = {
      name: formState.name,
      description: formState.description,
    };

    const editedCampaign = await campaignService.updateOne(campaign.id, formCampaign);
    dispatch({
      type: 'editCampaign',
      payload: editedCampaign
    });
    close();
  };

  const handleDelete = async () => {
    await campaignService.deleteOne(campaign.id);
    dispatch({
      type: 'removeCampaign',
      payload: campaign.id
    });
    close();
  };

  return (
    <div className="mt-5 md:mt-0 md:col-span-2">
      <form action="#" method="POST" onSubmit={handleCampaignSubmit}>
        <div className="bg-white dark:bg-gray-800">
          <div className="grid grid-cols-6 gap-6">
            <InputField
              label="Campaign name"
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
          </div>
        </div>
        <div className="px-4 py-3 text-right sm:px-6">
          <Button type='submit' variant='submit'>Save</Button>
          <Button variant='delete' onClick={() => setOpenDelete(true)}>Delete campaign</Button>
        </div>
      </form>
      <DeletionModal
        open={openDelete}
        setOpen={setOpenDelete}
        title="Delete campaign"
        description={`Are you sure you want to delete the campaign '${campaign.name}'? This action cannot be undone.`}
        buttonValue="Delete"
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
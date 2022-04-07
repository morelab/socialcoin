import React from 'react';

import { Button } from '../../../../components/Elements/Button';
import { InputField } from '../../../../components/Form/InputField';
import { SelectField } from '../../../../components/Form/SelectField';
import { SlideOver } from '../../../../components/Overlay/SlideOver';
import { DeletionModal } from '../DeletionModal';

import { Action } from '../../../../types';
import { useUser } from '../../../../context/UserContext';
import { useDashboard } from '../../../../context/DashboardContext';
import { notifyWarning } from '../../../../utils/notifications';
import { updateAction } from '../../api/updateAction';
import { deleteAction } from '../../api/deleteAction';


type FormProps = {
  action: Action;
  close: () => void;
};

type MenuProps = {
  action: Action;
  open: boolean;
  setOpen: (open: boolean) => void;
};

export type FormContent = {
  name: string;
  description: string;
  reward: number;
  kpi_target: number;
  kpi_indicator: string;
  campaign_id: string;
};


const EditActionForm = ({ action, close }: FormProps) => {
  const [formState, setFormState] = React.useState<FormContent>({
    name: action.name,
    description: action.description,
    reward: action.reward / 100,
    kpi_target: action.kpi_target,
    kpi_indicator: action.kpi_indicator,
    campaign_id: action.campaign_id
  });
  const [openDelete, setOpenDelete] = React.useState(false);
  const { state, dispatch } = useDashboard();
  const { user } = useUser();

  const handleInputChange = (event: React.FormEvent<HTMLInputElement | HTMLSelectElement>) => {
    const target = event.currentTarget;
    const value = target.value;
    const name = target.name;

    setFormState({
      ...formState,
      [name]: value
    });
  };

  const handleActionSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    const formAction = {
      name: formState.name,
      description: formState.description,
      reward: formState.reward * 100,
      kpi_target: formState.kpi_target,
      kpi_indicator: formState.kpi_indicator,
      campaign_id: formState.campaign_id  // TODO revise if this works
    };

    if (formAction.reward <= 0) {
      notifyWarning('The action reward must be greater than zero.');
      return;
    }
    if (formAction.kpi_target <= 0) {
      notifyWarning('The action target must be greater than zero.');
      return;
    }

    const editedAction = await updateAction(action.id, formAction);
    dispatch({
      type: 'editAction',
      payload: editedAction
    });
    close();
  };

  const handleDelete = async () => {
    await deleteAction(action.id);
    dispatch({
      type: 'removeAction',
      payload: action.id
    });
    close();
  };

  if (!user) return null;

  const getOwnCampaigns = () => {
    return user.role === 'AD'
      ? state.campaigns
      : state.campaigns.filter(c => c.company_id === user.id);
  };

  const campaigns = getOwnCampaigns().map(campaign => {
    return {
      label: campaign.name,
      value: campaign.id
    };
  });

  return (
    <div className="mt-5 md:mt-0 md:col-span-2">
      <form action="#" method="POST" onSubmit={handleActionSubmit} className='flex flex-col gap-4'>
        <div className="bg-white dark:bg-gray-800 flex flex-col gap-4">
          <InputField
            label="Action name"
            name="name"
            type="text"
            value={formState.name}
            onChange={handleInputChange}
            required
          />
          <InputField
            label="Description"
            name="description"
            type="text"
            value={formState.description}
            onChange={handleInputChange}
            required
          />
          <InputField
            label="Key Performance Indicator"
            name="kpi_indicator"
            type="text"
            value={formState.kpi_indicator}
            onChange={handleInputChange}
            required
          />

          <div className='flex items-center justify-between gap-2 col-span-6'>
            <InputField
              label="Reward"
              name="reward"
              type="number"
              value={formState.reward}
              onChange={handleInputChange}
              required
            />
            <InputField
              label="Target"
              name="kpi_target"
              type="number"
              value={formState.kpi_target}
              onChange={handleInputChange}
              required
            />
          </div>

          <SelectField
            label="Campaign"
            name="campaign_id"
            options={campaigns}
            value={formState.campaign_id}
            onChange={handleInputChange}
            required
          />
        </div>
        <div className="py-3 text-right">
          <Button type='submit' variant='submit'>Save</Button>
          <Button variant='delete' onClick={() => setOpenDelete(true)}>Delete action</Button>
        </div>
      </form>
      <DeletionModal
        open={openDelete}
        setOpen={setOpenDelete}
        title="Delete action"
        content={`Are you sure you want to delete the action '${action.name}'? This action cannot be undone.`}
        buttonValue="Delete"
        confirmHandler={handleDelete}
      />
    </div>
  );
};

export const EditActionMenu = ({ action, open, setOpen }: MenuProps) => {
  return (
    <SlideOver open={open} setOpen={setOpen} >
      <EditActionForm action={action} close={() => setOpen(false)} />
    </SlideOver>
  );
};
import React from 'react';

import { Button } from '../../../../components/Elements/Button';
import { InputField } from '../../../../components/Form/InputField';
import { SelectField } from '../../../../components/Form/SelectField';
import { ContentModal } from '../../../../components/Overlay/ContentModal';

import { useDashboard } from '../../../../context/DashboardContext';
import { notifyError, notifyWarning } from '../../../../utils/notifications';
import { useUser } from '../../../../context/UserContext';
import { createAction } from '../../api/createAction';


type FormProps = {
  close: () => void;
}

type MenuProps = {
  open: boolean;
  setOpen: (open: boolean) => void;
};

export type NewActionFormContent = {
  name: string;
  description: string;
  reward: number;
  kpi_target: number;
  kpi_indicator: string;
  campaign_id: number;
};


const NewActionForm = ({ close }: FormProps) => {
  const [formState, setFormState] = React.useState<NewActionFormContent>({
    name: '',
    description: '',
    reward: 0,
    kpi_target: 0,
    kpi_indicator: '',
    campaign_id: 0  // TODO use default campaign
  });
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

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (getOwnCampaigns().length === 0) {
      notifyError('You must create a campaign before creating an action.');
      return;
    }

    const newAction = {
      name: formState.name,
      description: formState.description,
      reward: formState.reward * 100,
      kpi_target: formState.kpi_target,
      kpi_indicator: formState.kpi_indicator,
      campaign_id: formState.campaign_id  // TODO check if this works properly
    };

    if (newAction.reward <= 0 || !newAction.reward) {
      notifyWarning('The reward must be greater than zero.');
      return;
    }
    if (newAction.kpi_target <= 0 || !newAction.kpi_target) {
      notifyWarning('The KPI target must be greater than zero.');
      return;
    }

    const createdAction = await createAction(newAction);
    dispatch({
      type: 'addAction',
      payload: createdAction
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
    <div className="md:grid md:grid-cols-3 md:gap-6 mt-8">
      <div className="md:col-span-1 shadow rounded-lg bg-sky-100 dark:bg-gray-900 p-4 mb-10">
        <div className="px-4 sm:px-0">
          <h3 className="mb-2 text-lg font-medium leading-6 text-gray-900 dark:text-gray-100">Create action</h3>
          <p className="mt-1 text-sm text-gray-600 dark:text-gray-200">
            Good deeds are actions that collaborators can complete to help fulfill the good deed&apos;s campaign&apos;s
            objectives. They have a reward and target for its completion.
          </p>
        </div>
      </div>
      <div className="mt-5 md:mt-0 md:col-span-2">
        <form action="#" method="POST" onSubmit={handleSubmit}>
          <div className="bg-white dark:bg-gray-800">
            <div className="grid grid-cols-6 gap-6">
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

              <div className='flex items-center gap-2 justify-between col-span-6'>
                <InputField
                  label="Reward"
                  name="reward"
                  type="number"
                  value={formState.reward}
                  onChange={handleInputChange}
                  required
                  isHalf={true}
                />
                <InputField
                  label="Target"
                  name="kpi_target"
                  type="number"
                  value={formState.kpi_target}
                  onChange={handleInputChange}
                  required
                  isHalf={true}
                />
              </div>
              <SelectField
                label="Campaign"
                name="campaign_id"
                options={campaigns}
                value={formState.campaign_id}
                onChange={handleInputChange}
              />
            </div>
          </div>
          <div className="px-4 py-3 text-right sm:px-6">
            <Button type='submit' variant='submit'>
              Create
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export const NewActionMenu = ({ open, setOpen }: MenuProps) => {
  return (
    <ContentModal open={open} setOpen={setOpen}>
      <NewActionForm close={() => setOpen(false)} />
    </ContentModal>
  );
};
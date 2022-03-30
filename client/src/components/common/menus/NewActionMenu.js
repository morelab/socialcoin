import React, { useState } from 'react';
import FormPopup from './FormPopup';

import InputGroup from '../forms/InputGroup';
import SelectGroup from '../forms/SelectGroup';
import SubmitButton from '../forms/SubmitButton';
import { useDashboard } from '../../../context/DashboardContext';
import actionService from '../../../services/actions';
import { notifyError, notifyWarning } from '../../../utils/notifications';
import { useUser } from '../../../context/UserContext';

const NewActionForm = ({ setOpen }) => {
  const [formState, setFormState] = useState({});
  const { state, dispatch } = useDashboard();
  const { user } = useUser();

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
    if (getOwnCampaigns().length === 0) {
      notifyError('You must create a campaign before creating an action.');
      return;
    }

    const newAction = {
      name: formState.actionName,
      description: formState.actionDescription,
      reward: formState.actionReward * 100,
      kpi_target: formState.actionTarget,
      kpi_indicator: formState.actionKpi,
      campaign_id: state.campaigns.find(c => c.name === formState.actionCampaign).id ?? getOwnCampaigns()[0].id
    };

    if (newAction.reward <= 0 || !newAction.reward) {
      notifyWarning('The reward must be greater than zero.');
      return;
    }
    if (newAction.kpi_target <= 0 || !newAction.kpi_target) {
      notifyWarning('The KPI target must be greater than zero.');
      return;
    }

    const createdAction = await actionService.createNew(newAction);
    dispatch({
      type: 'addAction',
      payload: { 'newAction': createdAction }
    });
    setOpen(false);
  };

  const getOwnCampaigns = () => {
    return user.role === 'AD'
      ? state.campaigns
      : state.campaigns.filter(c => c.company_id === user.id);
  };

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
              <InputGroup
                label="Action name"
                forName="actionName"
                type="text"
                value={formState.actionName || ''}
                handleInputChange={handleInputChange}
                required
              />
              <InputGroup
                label="Description"
                forName="actionDescription"
                type="text"
                value={formState.actionDescription || ''}
                handleInputChange={handleInputChange}
                required
              />
              <InputGroup
                label="Key Performance Indicator"
                forName="actionKpi"
                type="text"
                value={formState.actionKpi || ''}
                handleInputChange={handleInputChange}
                required
              />

              <div className='flex items-center gap-2 justify-between col-span-6'>
                <InputGroup
                  label="Reward"
                  forName="actionReward"
                  type="number"
                  value={formState.actionReward || 0}
                  handleInputChange={handleInputChange}
                  required
                  isHalf={true}
                />
                <InputGroup
                  label="Target"
                  forName="actionTarget"
                  type="number"
                  value={formState.actionTarget || 0}
                  handleInputChange={handleInputChange}
                  required
                  isHalf={true}
                />
              </div>

              <SelectGroup
                label="Campaign"
                forName="actionCampaign"
                options={getOwnCampaigns().map(c => c.name)}
                value={formState.actionCampaign || getOwnCampaigns()[0]?.name}
                handleInputChange={handleInputChange}
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

const NewActionMenu = ({ open, setOpen }) => {
  return (
    <FormPopup open={open} setOpen={setOpen}>
      <NewActionForm setOpen={setOpen} />
    </FormPopup>
  );
};

export default NewActionMenu;
import React, { useState } from 'react';
import FormPopup from './FormPopup';
import InputGroup from '../forms/InputGroup';
import TextareaGroup from '../forms/TextareaGroup';
import SubmitButton from '../forms/SubmitButton';
import { useDashboard } from '../../../context/DashboardContext';
import campaignService from '../../../services/campaigns';

const NewCampaignForm = ({ setOpen }) => {
  const [formState, setFormState] = useState({});
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

  const handleSubmit = async (event) => {
    event.preventDefault();

    const newCampaign = {
      name: formState.campaignName,
      description: formState.campaignDescription,
    };

    const createdCampaign = await campaignService.createNew(newCampaign);
    dispatch({
      type: 'addCampaign',
      payload: { 'newCampaign': createdCampaign }
    });
    setOpen(false);
  };

  return (
    <div className="md:grid md:grid-cols-3 md:gap-6 mt-8">
      <div className="md:col-span-1 shadow rounded-lg bg-sky-100 dark:bg-gray-900 p-4 mb-10">
        <div className="px-4 sm:px-0">
          <h3 className="mb-2 text-lg font-medium leading-6 text-gray-900 dark:text-gray-100">Create campaign</h3>
          <p className="mt-1 text-sm text-gray-600 dark:text-gray-200">
            Campaigns are groups of good deeds with the objective of fulfilling the UN&apos;s Sustainable Development Goals.
          </p>
        </div>
      </div>
      <div className="mt-5 md:mt-0 md:col-span-2">
        <form action="#" method="POST" onSubmit={handleSubmit}>
          <div className="bg-white dark:bg-gray-800">
            <div className="grid grid-cols-6 gap-6">
              <InputGroup
                label="Campaign name"
                forName="campaignName"
                type="text"
                value={formState.campaignName || ''}
                handleInputChange={handleInputChange}
                required
              />
              <TextareaGroup
                label="Description"
                forName="campaignDescription"
                value={formState.campaignDescription || ''}
                handleInputChange={handleInputChange}
                required
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

const NewCampaignMenu = ({ open, setOpen }) => {
  return (
    <FormPopup open={open} setOpen={setOpen}>
      <NewCampaignForm setOpen={setOpen} />
    </FormPopup>
  );
};

export default NewCampaignMenu;
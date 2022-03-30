import React, { useState } from 'react';
import InputGroup from './InputGroup';
import TextareaGroup from './TextareaGroup';
import SubmitButton from './SubmitButton';
import DeleteButton from './DeleteButton';
import DeletionModal from './DeletionModal';
import { useDashboard } from '../../../context/DashboardContext';
import campaignService from '../../../services/campaigns';


const EditCampaignForm = ({ data, setOpen }) => {
  const [formState, setFormState] = useState({});
  const [openDelete, setOpenDelete] = useState(false);
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

  const handleCampaignSubmit = async (e) => {
    e.preventDefault();

    const formCampaign = {
      name: formState.campaignName != undefined ? formState.campaignName : data.name,
      description: formState.campaignDescription != undefined ? formState.campaignDescription : data.description,
    };

    const editedCampaign = await campaignService.updateOne(data.id, formCampaign);
    dispatch({
      type: 'editCampaign',
      payload: { 'editedCampaign': editedCampaign }
    });
    setOpen(false);
  };

  const handleDelete = async () => {
    await campaignService.deleteOne(data.id);
    dispatch({
      type: 'removeCampaign',
      payload: { 'campaignId': data.id }
    });
    setOpen(false);
  };

  return (
    <div className="mt-5 md:mt-0 md:col-span-2">
      <form action="#" method="POST" onSubmit={handleCampaignSubmit}>
        <div className="bg-white dark:bg-gray-800">
          <div className="grid grid-cols-6 gap-6">
            <InputGroup
              label="Campaign name"
              forName="campaignName"
              type="text"
              value={formState.campaignName != undefined ? formState.campaignName : data.name}
              handleInputChange={handleInputChange}
              required
            />
            <TextareaGroup
              label="Description"
              forName="campaignDescription"
              value={formState.campaignDescription != undefined ? formState.campaignDescription : data.description}
              handleInputChange={handleInputChange}
              required
            />
          </div>
        </div>
        <div className="px-4 py-3 text-right sm:px-6">
          <SubmitButton content="Save" />
          <DeleteButton content="Delete campaign" clickHandler={() => setOpenDelete(true)} />
        </div>
      </form>
      <DeletionModal
        open={openDelete}
        setOpen={setOpenDelete}
        title="Delete campaign"
        description={`Are you sure you want to delete the campaign '${data.name}'? This action cannot be undone.`}
        buttonValue="Delete"
        confirmHandler={handleDelete}
      />
    </div>
  );
};

export default EditCampaignForm;
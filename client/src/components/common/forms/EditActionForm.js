import React, { useState } from 'react';
import InputGroup from './InputGroup';
import SelectGroup from './SelectGroup';
import SubmitButton from './SubmitButton';
import DeleteButton from './DeleteButton';
import DeletionModal from './DeletionModal';
import { useUser } from '../../../context/UserContext';
import { useDashboard } from '../../../context/DashboardContext';
import actionService from '../../../services/actions';
import { notifyWarning } from '../../../utils/notifications';


const EditActionForm = ({ data, setOpen }) => {
  const [formState, setFormState] = useState({});
  const [openDelete, setOpenDelete] = useState(false);
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

  const handleActionSubmit = async (e) => {
    e.preventDefault();

    const formAction = {
      name: formState.actionName != undefined ? formState.actionName : data.name,
      description: formState.actionDescription != undefined ? formState.actionDescription : data.description,
      reward: formState.actionReward != undefined ? formState.actionReward * 100 : data.reward,
      kpi_target: formState.actionTarget != undefined ? formState.actionTarget : data.kpi_target,
      kpi_indicator: formState.actionKpi != undefined ? formState.actionKpi : data.kpi_indicator,
      campaign_id: state.campaigns.find(c => c.name === formState.actionCampaign).id ?? getOwnCampaigns()[0]?.id,
    };

    if (formAction.reward <= 0) {
      notifyWarning('The action reward must be greater than zero.');
      return;
    }
    if (formAction.kpi_target <= 0) {
      notifyWarning('The action target must be greater than zero.');
      return;
    }

    const editedAction = await actionService.updateOne(data.id, formAction);
    dispatch({
      type: 'editAction',
      payload: { 'editedAction': editedAction }
    });
    setOpen(false);
  };

  const handleDelete = async () => {
    await actionService.deleteOne(data.id);
    dispatch({
      type: 'removeAction',
      payload: { 'actionId': data.id }
    });
    setOpen(false);
  };

  const getOwnCampaigns = () => {
    return user.role === 'AD'
      ? state.campaigns
      : state.campaigns.filter(c => c.company_id === user.id);
  };

  return (
    <div className="mt-5 md:mt-0 md:col-span-2">
      <form action="#" method="POST" onSubmit={handleActionSubmit}>
        <div className="bg-white dark:bg-gray-800">
          <div className="grid grid-cols-6 gap-6">
            <InputGroup
              label="Action name"
              forName="actionName"
              type="text"
              value={formState.actionName != undefined ? formState.actionName : data.name}
              handleInputChange={handleInputChange}
              required
            />
            <InputGroup
              label="Description"
              forName="actionDescription"
              type="text"
              value={formState.actionDescription != undefined ? formState.actionDescription : data.description}
              handleInputChange={handleInputChange}
              required
            />
            <InputGroup
              label="Key Performance Indicator"
              forName="actionKpi"
              type="text"
              value={formState.actionKpi != undefined ? formState.actionKpi : data.kpi_indicator}
              handleInputChange={handleInputChange}
              required
            />

            <div className='flex items-center justify-between gap-2 col-span-6'>
              <InputGroup
                label="Reward"
                forName="actionReward"
                type="number"
                value={formState.actionReward != undefined ? formState.actionReward : data.reward / 100}
                handleInputChange={handleInputChange}
                required
              />
              <InputGroup
                label="Target"
                forName="actionTarget"
                type="number"
                value={formState.actionTarget != undefined ? formState.actionTarget : data.kpi_target}
                handleInputChange={handleInputChange}
                required
              />
            </div>

            <SelectGroup
              label="Campaign"
              forName="actionCampaign"
              options={getOwnCampaigns().map(c => c.name)}
              value={formState.actionCampaign ?? getOwnCampaigns().find(c => c.id === data.campaign_id).name}
              handleInputChange={handleInputChange}
              required
            />
          </div>
        </div>
        <div className="px-4 py-3 text-right sm:px-6">
          <SubmitButton content="Save" />
          <DeleteButton content="Delete action" clickHandler={() => setOpenDelete(true)} />
        </div>
      </form>
      <DeletionModal
        open={openDelete}
        setOpen={setOpenDelete}
        title="Delete action"
        description={`Are you sure you want to delete the action '${data.name}'? This action cannot be undone.`}
        buttonValue="Delete"
        confirmHandler={handleDelete}
      />
    </div>
  );
};

export default EditActionForm;
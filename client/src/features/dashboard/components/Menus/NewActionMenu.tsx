import React from 'react';
import { ExclamationIcon } from '@heroicons/react/outline';

import { Button } from '../../../../components/Elements/Button';
import { InputField } from '../../../../components/Form/InputField';
import { SelectField } from '../../../../components/Form/SelectField';
import { ContentModal } from '../../../../components/Overlay/ContentModal';

import { useData } from '../../../../context/DataContext';
import { notifyError, notifyWarning } from '../../../../utils/notifications';
import { useUser } from '../../../../context/UserContext';
import { createAction } from '../../api/createAction';
import { useTranslation } from 'react-i18next';


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
  campaign_id: string;
};


const NewActionForm = ({ close }: FormProps) => {
  const { data, dispatchData } = useData();
  const [formState, setFormState] = React.useState<NewActionFormContent>({
    name: '',
    description: '',
    reward: 0,
    kpi_target: 0,
    kpi_indicator: '',
    campaign_id: data.campaigns[0].id
  });
  const { t } = useTranslation();
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
    dispatchData({
      type: 'addAction',
      payload: createdAction
    });
    close();
  };

  if (!user) return null;

  const getOwnCampaigns = () => {
    return user.role === 'AD'
      ? data.campaigns
      : data.campaigns.filter(c => c.company_id === user.id);
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
          <h3 className="mb-2 text-lg font-medium leading-6 text-gray-900 dark:text-gray-100">{t('dashboard.menus.createAction')}</h3>
          <p className="mt-1 text-sm text-gray-600 dark:text-gray-200">
            Good deeds are actions that collaborators can complete to help fulfill the good deed&apos;s campaign&apos;s
            objectives. They have a reward and target for its completion.
          </p>
        </div>
      </div>
      <div className="mt-5 md:mt-0 md:col-span-2">
        <form action="#" method="POST" onSubmit={handleSubmit}>
          <div className="bg-white dark:bg-gray-800 flex flex-col gap-4">
            <InputField
              label={t('dashboard.menus.actionName')}
              name="name"
              type="text"
              value={formState.name}
              onChange={handleInputChange}
              required
            />
            <InputField
              label={t('dashboard.tables.description')}
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
                label={t('dashboard.tables.reward')}
                name="reward"
                type="number"
                value={formState.reward}
                onChange={handleInputChange}
                required
                isHalf={true}
              />
              <InputField
                label={t('dashboard.tables.target')}
                name="kpi_target"
                type="number"
                value={formState.kpi_target}
                onChange={handleInputChange}
                required
                isHalf={true}
              />
            </div>
            <SelectField
              label={t('dashboard.main.campaign')}
              name="campaign_id"
              options={campaigns}
              value={formState.campaign_id}
              onChange={handleInputChange}
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

export const NewActionMenu = ({ open, setOpen }: MenuProps) => {
  const { t } = useTranslation();
  const { data } = useData();

  if (data.campaigns.length === 0) {
    return (
      <ContentModal open={open} setOpen={setOpen} className='p-4'>
        <div className="mb-3 flex flex-col items-center justify-center gap-4">
          <div className="mx-auto flex-shrink-0 flex items-center justify-center h-14 w-14 rounded-full bg-indigo-200 dark:bg-indigo-100 sm:mx-0 sm:h-16 sm:w-16">
            <ExclamationIcon className="h-10 w-10 text-indigo-600" aria-hidden="true" />
          </div>
          <h1 className='text-xl font-bold dark:text-gray-100'>{t('common.error')}</h1>
          <p className='text-md text-center dark:text-gray-200'>
            Please create a campaign before creating an action.
          </p>
        </div>
        <div className="px-4 py-3 flex sm:px-6 flex-col sm:flex-row gap-4">
          <button
            type="button"
            className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 text-base font-medium text-gray-200 bg-indigo-600 hover:bg-indigo-500 dark:bg-indigo-500 dark:hover:bg-indigo-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:text-sm"
            onClick={() => {
              setOpen(false);
            }}
          >
            {t('common.accept')}
          </button>
        </div>
      </ContentModal>
    );
  }

  return (
    <ContentModal open={open} setOpen={setOpen} className='p-4'>
      <NewActionForm close={() => setOpen(false)} />
    </ContentModal>
  );
};
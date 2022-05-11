import React from 'react';
import { CheckIcon, ExclamationIcon } from '@heroicons/react/solid';
import { useTranslation } from 'react-i18next';

import { Button } from '../../../../components/Elements/Button';
import { Spinner } from '../../../../components/Elements/Spinner';
import { InputField } from '../../../../components/Form/InputField';
import { SelectField } from '../../../../components/Form/SelectField';
import { SlideOver } from '../../../../components/Overlay/SlideOver';
import { DeletionModal } from '../DeletionModal';

import { Action, RequestLoadState, User } from '../../../../types';
import { useUser } from '../../../../context/UserContext';
import { useData } from '../../../../context/DataContext';
import { notifyWarning } from '../../../../utils/notifications';
import { updateAction } from '../../api/updateAction';
import { deleteAction } from '../../api/deleteAction';


type FormProps = {
  action: Action;
  close: () => void;
  setLoadState: (state: RequestLoadState) => void;
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


const EditActionForm = ({ action, close, setLoadState }: FormProps) => {
  const [formState, setFormState] = React.useState<FormContent>({
    name: action.name,
    description: action.description,
    reward: action.reward / 100,
    kpi_target: action.kpi_target,
    kpi_indicator: action.kpi_indicator,
    campaign_id: action.campaign_id
  });
  const [openDelete, setOpenDelete] = React.useState(false);
  const { data, dispatchData } = useData();
  const { t } = useTranslation();
  const { user, setUser } = useUser();

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
      notifyWarning(t('notifications.positiveReward'));
      return;
    }
    if (formAction.kpi_target <= 0) {
      notifyWarning(t('notifications.positiveTarget'));
      return;
    }

    const editedAction = await updateAction(action.id, formAction);
    dispatchData({
      type: 'editAction',
      payload: editedAction
    });
    close();
  };

  const handleDelete = async () => {
    setLoadState('loading');
    await deleteAction(action.id)
      .then(() => {
        dispatchData({
          type: 'removeAction',
          payload: action.id
        });
        if (user) {
          const newUser: User = {
            ...user,
            balance: user.balance - ((action.kpi_target - action.kpi) * action.reward)
          };
          setUser(newUser);
        }
        setLoadState('success');
      }).catch(error => {
        console.error(error);
        setLoadState('failure');
      });
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
    <div className="mt-5 md:mt-0 md:col-span-2">
      <form action="#" method="POST" onSubmit={handleActionSubmit} className='flex flex-col gap-4'>
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

          <div className='flex items-center justify-between gap-2 col-span-6'>
            <InputField
              label={t('dashboard.tables.reward')}
              name="reward"
              type="number"
              value={formState.reward}
              onChange={handleInputChange}
              required
            />
            <InputField
              label={t('dashboard.tables.target')}
              name="kpi_target"
              type="number"
              value={formState.kpi_target}
              onChange={handleInputChange}
              required
            />
          </div>

          <SelectField
            label={t('main.campaign')}
            name="campaign_id"
            options={campaigns}
            value={formState.campaign_id}
            onChange={handleInputChange}
            required
          />
        </div>
        <div className="py-3 text-right flex flex-col sm:flex-row items-center justify-center gap-2">
          <Button type='submit' variant='submit'>{t('common.save')}</Button>
          <Button variant='delete' onClick={() => setOpenDelete(true)}>{t('dashboard.menus.deleteAction')}</Button>
        </div>
      </form>
      <DeletionModal
        open={openDelete}
        setOpen={setOpenDelete}
        title={t('dashboard.menus.deleteAction')}
        content={`${t('dashboard.menus.deleteActionMsg')} '${action.name}'? ${t('common.cannotBeUndone')}. ${((action.kpi_target - action.kpi) * action.reward) / 100} UDC ${t('dashboard.menus.removedFromBalance')}.`}
        buttonValue={t('common.delete')}
        confirmHandler={handleDelete}
      />
    </div>
  );
};

export const EditActionMenu = ({ action, open, setOpen }: MenuProps) => {
  const [deletionLoadState, setDeletionLoadState] = React.useState<RequestLoadState>('unloaded');
  const { t } = useTranslation();

  const getContent = () => {
    switch (deletionLoadState) {
      case 'unloaded':
        return <EditActionForm action={action} close={() => setOpen(false)} setLoadState={setDeletionLoadState} />;
      case 'loading':
        return (
          <div className='h-full flex flex-col items-center justify-center'>
            <Spinner size='xl' className='mb-6' />
            <h2 className='text-xl text-gray-100'>{t('other.processingRequest')}...</h2>
          </div>
        );
      case 'success':
        return (
          <>
            <div className="p-4 mb-3 flex flex-col items-center justify-center gap-4">
              <div className="mx-auto flex-shrink-0 flex items-center justify-center h-14 w-14 rounded-full bg-indigo-200 dark:bg-indigo-100 sm:mx-0 sm:h-16 sm:w-16">
                <CheckIcon className="h-10 w-10 text-indigo-600" aria-hidden="true" />
              </div>
              <h1 className='text-xl font-bold dark:text-gray-100'>{t('actions.actionDeleted')}</h1>
              <p className='text-md text-center dark:text-gray-200'>
                {t('actions.actionDeletedMsg')}.
              </p>
            </div>
            <div className="px-4 py-3 flex sm:px-6 flex-col sm:flex-row gap-4">
              <button
                type="button"
                className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 text-base font-medium text-gray-200 bg-indigo-600 hover:bg-indigo-500 dark:bg-indigo-500 dark:hover:bg-indigo-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:text-sm"
                onClick={() => {
                  setOpen(false);
                  setTimeout(() => setDeletionLoadState('unloaded'), 1000);
                }}
              >
                {t('common.accept')}
              </button>
            </div>
          </>
        );
      case 'failure':
        return (
          <>
            <div className="p-4 mb-3 flex flex-col items-center justify-center gap-4">
              <div className="mx-auto flex-shrink-0 flex items-center justify-center h-14 w-14 rounded-full bg-red-200 dark:bg-red-100 sm:mx-0 sm:h-16 sm:w-16">
                <ExclamationIcon className="h-10 w-10 text-red-600" aria-hidden="true" />
              </div>
              <h1 className='text-xl font-bold dark:text-gray-100'>{t('actions.actionDeletedErr')}</h1>
              <p className='text-md text-center dark:text-gray-200'>
                {t('actions.actionDeletedMsgErr')}.
              </p>
            </div>
            <div className="px-4 py-3 flex sm:px-6 flex-col sm:flex-row gap-4">
              <button
                type="button"
                className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 text-base font-medium text-gray-200 bg-indigo-600 hover:bg-indigo-500 dark:bg-indigo-500 dark:hover:bg-indigo-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:text-sm"
                onClick={() => {
                  setOpen(false);
                  setTimeout(() => setDeletionLoadState('unloaded'), 1000);
                }}
              >
                {t('common.accept')}
              </button>
            </div>
          </>
        );
    }
  };

  return (
    <SlideOver open={open} setOpen={setOpen} >
      {getContent()}
    </SlideOver>
  );
};
import React from 'react';
import {
  CollectionIcon,
  FlagIcon,
  PlusIcon,
  ShoppingCartIcon,
  UsersIcon,
} from '@heroicons/react/solid';
import { useTranslation } from 'react-i18next';

import { NewCampaignMenu } from '../components/Menus/NewCampaignMenu';
import { NewActionMenu } from '../components/Menus/NewActionMenu';
import { NewOfferMenu } from '../components/Menus/NewOfferMenu';

import { EmptyTableNotice } from '../components/EmptyTableNotice';
import { CampaignsTable } from '../components/Tables/CampaignsTable';
import { ActionsTable } from '../components/Tables/ActionsTable';
import { OffersTable } from '../components/Tables/OffersTable';
import { UsersTable } from '../components/Tables/UsersTable';
import { MiniTopbar } from '../../../components/Layout/MiniTopbar';

import { useUser } from '../../../context/UserContext';
import { Tab } from '@headlessui/react';
import { useData } from '../../../context/DataContext';


type CreateButtonProps = {
  index: number;
  showAll?: boolean;
};

type TabProps = {
  content: 'campaigns' | 'actions' | 'offers' | 'users';
  active?: boolean;
};


const DashboardTab = ({ content, active }: TabProps) => {
  const { t } = useTranslation();

  const className = active
    ? 'h-16 inline-flex items-center px-5 sm:px-4 py-4 text-md font-medium text-center text-blue-500 rounded-t-lg border-b-2 border-blue-600 transition-colors group dark:text-blue-300 dark:border-blue-300'
    : 'h-16 inline-flex items-center px-5 sm:px-4 py-4 text-md font-medium text-center text-gray-400 rounded-t-lg border-b-2 border-transparent transition-colors hover:text-gray-500 hover:border-gray-300 dark:hover:text-gray-300 group';

  const iconClassname = active
    ? 'h-5 w-5 text-blue-500 sm:mr-3 dark:text-blue-300 transition-colors '
    : 'h-5 w-5 text-gray-400 sm:mr-3 group-hover:text-gray-500 dark:group-hover:text-gray-300 transition-colors ';

  let icon: JSX.Element;
  switch (content) {
    case 'campaigns':
      icon = <FlagIcon className={iconClassname} />;
      break;
    case 'actions':
      icon = <CollectionIcon className={iconClassname} />;
      break;
    case 'offers':
      icon = <ShoppingCartIcon className={iconClassname} />;
      break;
    default:
      icon = <UsersIcon className={iconClassname} />;
      break;
  }

  return (
    <div className={className}>
      {icon}
      <span className='hidden sm:inline'>
        {t(`main.${content}`)}
      </span>
    </div>
  );
};

const CreateButton = ({ index, showAll }: CreateButtonProps) => {
  const [open, setOpen] = React.useState(false);
  const { t } = useTranslation();

  let type: 'campaign' | 'action' | 'reward' | 'user';
  if (index === 0) type = 'campaign';
  else if (index === 1) type = 'action';
  else if (index === 2) type = 'reward';
  else type = 'user';

  let menu;
  if (type === 'campaign') {
    menu = <NewCampaignMenu open={open} setOpen={setOpen} />;
  } else if (type === 'action') {
    menu = <NewActionMenu open={open} setOpen={setOpen} />;
  } else if (type === 'reward') {
    menu = <NewOfferMenu open={open} setOpen={setOpen} />;
  } else {
    return null;
  }

  return (
    <>
      <button
        onClick={() => setOpen(!open)}
        type="button"
        className="flex rounded-lg items-center px-3 py-2 text-gray-200 bg-indigo-600 hover:bg-indigo-500 dark:bg-indigo-500 dark:hover:bg-indigo-400 transition-colors"
      >
        <span className="sr-only">{`Create new ${type}`}</span>
        <PlusIcon className="w-6 h-6 md:mr-2" aria-hidden="true" />
        <span className={`font-semibold text-lg ${showAll ? '' : 'hidden md:inline' }`}>{t('dashboard.menus.createNew')}</span>
      </button>
      {menu}
    </>
  );
};

export const Dashboard = () => {
  const [selectedIndex, setSelectedIndex] = React.useState(0);
  const { data } = useData();
  const { user } = useUser();

  if (!user) return null;

  return (
    <Tab.Group selectedIndex={selectedIndex} onChange={setSelectedIndex}>
      <Tab.List as={MiniTopbar}>
        <div>
          <Tab>{({ selected }) => <DashboardTab content="campaigns" active={selected} />}</Tab>
          <Tab>{({ selected }) => <DashboardTab content="actions" active={selected} />}</Tab>
          <Tab>{({ selected }) => <DashboardTab content="offers" active={selected} />}</Tab>
          {user.role === 'AD' && <Tab>{({ selected }) => <DashboardTab content="users" active={selected} />}</Tab>}
        </div>
        <CreateButton index={selectedIndex} />
      </Tab.List>
      <Tab.Panels>
        <Tab.Panel>
          {data.campaigns.length > 0
            ? <CampaignsTable />
            : (
              <EmptyTableNotice title='No campaigns created yet'>
                <CreateButton index={0} showAll />
              </EmptyTableNotice>
            )
          }
        </Tab.Panel>
        <Tab.Panel>
          {data.actions.length > 0
            ? <ActionsTable />
            : (
              <EmptyTableNotice title='No actions created yet'>
                <CreateButton index={1} showAll />
              </EmptyTableNotice>
            )
          }
        </Tab.Panel>
        <Tab.Panel>
          {data.offers.length > 0
            ? <OffersTable />
            : (
              <EmptyTableNotice title='No rewards created yet'>
                <CreateButton index={2} showAll />
              </EmptyTableNotice>
            )
          }
        </Tab.Panel>
        {user.role === 'AD' && (
          <Tab.Panel>
            <UsersTable />
          </Tab.Panel>
        )}
      </Tab.Panels>
    </Tab.Group>
  );
};
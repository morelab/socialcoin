import React from 'react';
import {
  CollectionIcon,
  FlagIcon,
  PlusIcon,
  ShoppingCartIcon,
} from '@heroicons/react/solid';

import { NewCampaignMenu } from '../components/Menus/NewCampaignMenu';
import { NewActionMenu } from '../components/Menus/NewActionMenu';
import { NewOfferMenu } from '../components/Menus/NewOfferMenu';

import { CampaignsTable } from '../components/Tables/CampaignsTable';
import { ActionsTable } from '../components/Tables/ActionsTable';
import { OffersTable } from '../components/Tables/OffersTable';

import { useUser } from '../../../context/UserContext';
import { getSelfUserBalance } from '../api/getSelfUserBalance';
import { Tab } from '@headlessui/react';
import { MiniTopbar } from '../../../components/Layout/MiniTopbar';


type HeaderProps = {
  index: number;
};


const CreateButton = ({ index }: HeaderProps) => {
  const [open, setOpen] = React.useState(false);

  let type: 'campaign' | 'action' | 'reward';
  if (index === 0) type = 'campaign';
  else if (index === 1) type = 'action';
  else type = 'reward';

  let menu;
  if (type === 'campaign') {
    menu = <NewCampaignMenu open={open} setOpen={setOpen} />;
  } else if (type === 'action') {
    menu = <NewActionMenu open={open} setOpen={setOpen} />;
  } else {
    menu = <NewOfferMenu open={open} setOpen={setOpen} />;
  }

  return (
    <>
      <button
        onClick={() => setOpen(!open)}
        type="button"
        className="flex rounded-lg items-center px-3 py-2 ml-5 sm:ml-7 text-gray-200 bg-indigo-600 hover:bg-indigo-500 dark:bg-indigo-500 dark:hover:bg-indigo-400 transition-colors"
      >
        <span className="sr-only">{`Create new ${type}`}</span>
        <PlusIcon className="w-6 h-6 sm:mr-2 hidden sm:inline" aria-hidden="true" />
        <span className="font-semibold text-lg">Create new</span>
      </button>
      {menu}
    </>
  );
};




type TabProps = {
  content: 'Campaigns' | 'Actions' | 'Offers';
  active?: boolean;
};

const DashboardTab = ({ content, active }: TabProps) => {
  const className = active
    ? 'h-16 inline-flex items-center py-4 px-4 text-md font-medium text-center text-blue-500 rounded-t-lg border-b-2 border-blue-600 transition-colors group dark:text-blue-300 dark:border-blue-300'
    : 'h-16 inline-flex items-center py-4 px-4 text-md font-medium text-center text-gray-400 rounded-t-lg border-b-2 border-transparent transition-colors hover:text-gray-500 hover:border-gray-300 dark:hover:text-gray-300 group';

  const iconClassname = active
    ? 'h-5 w-5 text-blue-500 sm:mr-3 dark:text-blue-300 transition-colors '
    : 'h-5 w-5 text-gray-400 sm:mr-3 group-hover:text-gray-500 dark:group-hover:text-gray-300 transition-colors ';

  let icon: JSX.Element;
  switch (content) {
    case 'Campaigns':
      icon = <FlagIcon className={iconClassname} />;
      break;
    case 'Actions':
      icon = <CollectionIcon className={iconClassname} />;
      break;
    default:
      icon = <ShoppingCartIcon className={iconClassname} />;
      break;
  }

  return (
    <div className={className}>
      {icon}
      <span className='hidden sm:inline'>
        {content}
      </span>
    </div>
  );
};



export const Dashboard = () => {
  const [selectedIndex, setSelectedIndex] = React.useState(0);
  const { user, setUser } = useUser();

  if (!user) return null;

  React.useEffect(() => {
    if (user.balance === null || user.balance === undefined) {
      getSelfUserBalance()
        .then(balance => {
          const newUser = {
            ...user,
            balance: balance
          };
          setUser(newUser);
        });
    }
  }, []);

  return (
    <>
      <Tab.Group selectedIndex={selectedIndex} onChange={setSelectedIndex}>
        <Tab.List as={MiniTopbar}>
          <div>
            <Tab>{({ selected }) => <DashboardTab content='Campaigns' active={selected} />}</Tab>
            <Tab>{({ selected }) => <DashboardTab content='Actions' active={selected} />}</Tab>
            <Tab>{({ selected }) => <DashboardTab content='Offers' active={selected} />}</Tab>
          </div>
          <CreateButton index={selectedIndex} />
        </Tab.List>
        <Tab.Panels>
          <Tab.Panel>
            <CampaignsTable />
          </Tab.Panel>
          <Tab.Panel>
            <ActionsTable />
          </Tab.Panel>
          <Tab.Panel>
            <OffersTable />
          </Tab.Panel>
        </Tab.Panels>
      </Tab.Group>
    </>
  );
};
import React, { useState, useEffect } from 'react';
import { Redirect, Route } from 'react-router-dom';
import { PlusIcon } from '@heroicons/react/solid';

import NewCampaignMenu from '../../../components/common/menus/NewCampaignMenu';
import NewActionMenu from '../../../components/common/menus/NewActionMenu';
import NewOfferMenu from '../../../components/common/menus/NewOfferMenu';

import CampaignsTable from '../../../components/common/tables/CampaignsTable';
import ActionsTable from '../../../components/common/tables/ActionsTable';
import OffersTable from '../components/Tables/OffersTable';

import { DashboardProvider } from '../../../context/DashboardContext';
import { useUser } from '../../../context/UserContext';
import { useDashboard } from '../../../context/DashboardContext';

import campaignService from '../../../services/campaigns';
import actionService from '../../../services/actions';
import offerService from '../../../services/offers';
import userService from '../../../services/users';

type HeaderProps = {
  type: 'campaign' | 'action' | 'offer';
};

const DashboardHeader = ({ type }: HeaderProps) => {
  const [open, setOpen] = useState(false);

  let menu;
  if (type === 'campaign') {
    menu = <NewCampaignMenu open={open} setOpen={setOpen} />;
  } else if (type === 'action') {
    menu = <NewActionMenu open={open} setOpen={setOpen} />;
  } else {
    menu = <NewOfferMenu open={open} setOpen={setOpen} />;
  }

  return (
    <div className="flex items-center justify-between pb-3 px-4 lg:px-0">
      <div>
        <h1 className="text-3xl font-semibold text-gray-700 dark:text-white capitalize">{`${type}s`}</h1>
      </div>
      <div>
        <button
          onClick={() => setOpen(!open)}
          type="button"
          className="flex rounded-lg items-center px-3 py-2 ml-5 sm:ml-7 text-gray-200 bg-indigo-600 hover:bg-indigo-500 dark:bg-indigo-500 dark:hover:bg-indigo-400 transition-colors"
        >
          <span className="sr-only">{`Create new ${type}`}</span>
          <PlusIcon className="w-6 h-6 sm:mr-2" aria-hidden="true" />
          <span className="font-semibold text-lg hidden sm:inline">Create new</span>
        </button>
        {menu}
      </div>
    </div>
  );
};

const DashboardContent = () => {
  const { dispatch } = useDashboard();
  const { user, setUser } = useUser();

  if (user.role === 'CB') {
    return <Redirect to="/campaigns" />;
  }

  useEffect(() => {
    let isMounted = true;
    campaignService.getAll().then(campaigns => {
      if (isMounted) {
        dispatch({
          type: 'loadCampaigns',
          payload: { campaigns }
        });
      }
    });

    return () => { isMounted = false; };
  }, []);

  useEffect(() => {
    let isMounted = true;
    actionService.getAll().then(actions => {
      if (isMounted) {
        dispatch({
          type: 'loadActions',
          payload: { actions }
        });
      }
    });

    return () => { isMounted = false; };
  }, []);

  useEffect(() => {
    let isMounted = true;
    offerService.getAll().then(offers => {
      if (isMounted) {
        dispatch({
          type: 'loadOffers',
          payload: { offers }
        });
      }
    });

    return () => { isMounted = false; };
  }, []);

  useEffect(() => {
    if (user.balance === null || user.balance === undefined) {
      userService.getSelfBalance()
        .then(result => {
          const newUser = {
            ...user,
            balance: result.balance
          };
          setUser(newUser);
        });
    }
  }, []);

  return (
    <>
      <Route path="/dashboard/campaigns">
        <div className='px-0 py-5 lg:p-5'>
          <DashboardHeader type='campaign' />
          <CampaignsTable />
        </div>
      </Route>

      <Route path="/dashboard/actions">
        <div className='px-0 py-5 lg:p-5'>
          <DashboardHeader type='action' />
          <ActionsTable />
        </div>
      </Route>

      <Route path="/dashboard/offers">
        <div className='px-0 py-5 lg:p-5'>
          <DashboardHeader type='offer' />
          <OffersTable />
        </div>
      </Route>

      <Route exact path="/dashboard">
        <Redirect to="/dashboard/campaigns" />
      </Route>
    </>
  );
};

export const Dashboard = () => (
  <DashboardProvider>
    <DashboardContent />
  </DashboardProvider>
);
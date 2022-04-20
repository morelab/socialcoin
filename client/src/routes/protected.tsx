import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';

import { Dashboard } from '../features/dashboard';
import { Actions, ActionRegister } from '../features/actions';
import { Campaigns } from '../features/campaigns';
import { Offers, OfferRedeem } from '../features/offers';
import { TransactionHistory } from '../features/transactions';
import { About, Profile } from '../features/misc';

import { MainLayout } from '../components/Layout';

import { useData } from '../context/DataContext';
import { getCampaigns } from '../api/getCampaigns';
import { getActions } from '../api/getActions';
import { getOffers } from '../api/getOffers';


type UserRole = 'CB' | 'PM' | 'AD';


const App = () => {
  const { dispatchData } = useData();

  React.useEffect(() => {
    const campaigns = getCampaigns();
    const actions = getActions();
    const offers = getOffers();

    Promise.all([campaigns, actions, offers])
      .then(result => {
        const [campaigns, actions, offers] = result;
        dispatchData({
          type: 'loadData',
          payload: {
            campaigns,
            actions,
            offers
          }
        });
      })
      .catch(err => {
        console.log(err);
        dispatchData({
          type: 'loadError',
          payload: {}
        });
      });
  }, [dispatchData]);

  return (
    <MainLayout>
      <Outlet />
    </MainLayout>
  );
};

const commonRoutes = [
  { path: '/campaigns', element: <Campaigns /> },
  { path: '/transaction-history', element: <TransactionHistory /> },
  { path: '/about', element: <About /> },
  { path: '/profile', element: <Profile /> },
  { path: '*', element: <Navigate to="." /> },
];

export const getProtectedRoutes = (role: UserRole) => {
  if (role === 'CB') {
    return [{
      path: '/',
      element: <App />,
      children: commonRoutes.concat([
        { path: '/actions/register/:id', element: <ActionRegister /> },
        { path: '/actions', element: <Actions /> },
        { path: '/offers/redeem/:id', element: <OfferRedeem /> },
        { path: '/offers', element: <Offers /> },
        { path: '/', element: <Navigate to="/campaigns" /> },
      ])
    }];
  } else if (role === 'PM') {
    return [{
      path: '/',
      element: <App />,
      children: commonRoutes.concat([
        { path: '/dashboard', element: <Dashboard /> },
        { path: '/', element: <Navigate to="/dashboard" /> },
      ])
    }];
  }
  return [{
    path: '/',
    element: <App />,
    children: commonRoutes.concat([
      { path: '/dashboard', element: <Dashboard /> },
      { path: '/actions/register/:id', element: <ActionRegister /> },
      { path: '/actions', element: <Actions /> },
      { path: '/offers/redeem/:id', element: <OfferRedeem /> },
      { path: '/offers', element: <Offers /> },
      { path: '/', element: <Navigate to="/dashboard" /> },
    ])
  }];
};
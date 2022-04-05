import React from 'react';
import { Route } from 'react-router-dom';

import Spinner from './Elements/Spinner/Spinner';
import Sidebar from './Layout/Sidebar';
import { TopBar } from './Layout';

import { Dashboard } from '../features/dashboard';
import { Actions, ActionRegister } from '../features/actions';
import { Campaigns } from '../features/campaigns';
import { Offers, OfferRedeem } from '../features/offers';
import { TransactionHistory } from '../features/transactions';
import { About, Profile } from '../features/misc';

import { useWindowDimensions } from '../hooks/useWindowDimensions';
import { useUserRequired } from '../hooks/useUserRequired';
import { useUser } from '../context/UserContext';

const Routes = () => {
  return (
    <>
      <Route path="/dashboard" component={Dashboard} />
      <Route path="/actions/register/:id" component={ActionRegister} />
      <Route exact path="/actions" component={Actions} />
      <Route path="/campaigns" component={Campaigns} />
      <Route path="/offers/redeem/:id" component={OfferRedeem} />
      <Route exact path="/offers" component={Offers} />
      <Route path="/transaction-history" component={TransactionHistory} />
      <Route path="/about" component={About} />
      <Route path="/profile" component={Profile} />
    </>
  );
};

const PagesContainer = () => {
  useUserRequired();
  const [sidebarOpen, setSidebarOpen] = React.useState(false);
  const { width } = useWindowDimensions();
  const { user } = useUser();

  const leftStyle = {
    maxWidth: width > 1024 ? 'calc(100vw - 288px)' : '100vw'
  };

  return (
    <div className='flex bg-gray-200 dark:bg-gray-700'>
      <Sidebar open={sidebarOpen} setOpen={setSidebarOpen} />
      <div className='grow min-h-screen transition-all duration-300 ease-out lg:ml-72' style={leftStyle}>
        <TopBar />
        {user ? <Routes/> : <Spinner />}
      </div>
    </div>
  );
};

export default PagesContainer;
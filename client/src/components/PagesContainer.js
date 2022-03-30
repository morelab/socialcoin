import React, { useState } from 'react';
import { Route } from 'react-router-dom';
import LoadingIcon from './common/LoadingIcon';
import Sidebar from './layout/sidebar/Sidebar';
import TopBar from './layout/topbar/Topbar';
import {
  Dashboard,
  Actions,
  ActionRegister,
  Campaigns,
  Offers,
  OfferRedeem,
  TransactionHistory,
  About,
  Profile
} from '../pages';
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
  const [sidebarOpen, setSidebarOpen] = useState(false);
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
        {user ? <Routes/> : <LoadingIcon />}
      </div>
    </div>
  );
};

export default PagesContainer;
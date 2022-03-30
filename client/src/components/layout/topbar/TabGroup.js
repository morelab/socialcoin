import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import Tab from './Tab';

const TabGroup = () => {
  const location = useLocation();
  let index;
  if (location.pathname === '/dashboard/campaigns') index = 0;
  else if (location.pathname === '/dashboard/actions') index = 1;
  else if (location.pathname === '/dashboard/offers') index = 2;
  else index = 0;

  const [activeTab, setActiveTab] = useState(index);

  return (
    <div className="border-b border-white pl-3 dark:border-gray-800">
      <ul className="flex flex-wrap -mb-px">
        <Tab
          url='/dashboard/campaigns'
          content='Campaigns'
          active={activeTab === 0}
          setActiveTab={setActiveTab}
        />
        <Tab
          url='/dashboard/actions'
          content='Actions'
          active={activeTab === 1}
          setActiveTab={setActiveTab}
        />
        <Tab
          url='/dashboard/offers'
          content='Offers'
          active={activeTab === 2}
          setActiveTab={setActiveTab}
        />
      </ul>
    </div>
  );
};

export default TabGroup;
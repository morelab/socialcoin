import React, { useState, useEffect } from 'react';
import { Dialog } from '@headlessui/react';
import { Redirect } from 'react-router-dom';
import { ChevronRightIcon } from '@heroicons/react/solid';
import campaignService from '../services/campaigns';
import ContentModal from '../components/overlay/ContentModal';
import { useUser } from '../context/UserContext';


const CampaignModal = ({ open, setOpen, title, content }) => {
  return (
    <ContentModal open={open} setOpen={setOpen}>
      <div className="inline-block align-bottom bg-white dark:bg-gray-800 rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
        <div className="bg-white dark:bg-gray-800 px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
          <div className="sm:flex sm:items-start">
            <div className="mt-3 text-center sm:mt-0 sm:text-left">
              <Dialog.Title as="h3" className="text-lg leading-6 font-medium text-gray-900 dark:text-gray-100">
                {title}
              </Dialog.Title>
              <div className="mt-2">
                <p className="text-sm text-gray-500 dark:text-gray-300">
                  {content}
                </p>
              </div>
            </div>
          </div>
        </div>
        <div className="bg-gray-50 dark:bg-gray-800 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
          <button
            type="button"
            className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 text-base font-mediumtext-gray-200 bg-indigo-600 hover:bg-indigo-500 dark:bg-indigo-500 dark:hover:bg-indigo-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:text-sm"
            onClick={() => setOpen(false)}
          >
            Close
          </button>
        </div>
      </div>
    </ContentModal>
  );
};

const CompanySection = ({ entry }) => {
  const [modalOpen, setModalOpen] = useState(false);
  const [data, setData] = useState({
    title: '',
    content: ''
  });
  const { user } = useUser();

  if (user.role === 'PM') {
    return <Redirect to="/dashboard/campaigns" />;
  }

  const handleOpenModal = (title, content) => {
    setData({
      title: title,
      content: content
    });
    setModalOpen(true);
  };

  return (
    <>
      <div className='rounded-lg shadow-md overflow-hidden w-full flex-grow divide-y-2 divide-gray-200 dark:divide-gray-500 bg-white dark:bg-gray-800'>
        <div className='px-4 py-3 dark:bg-gray-900'>
          <h1 className='font-bold text-lg text-gray-800 dark:text-gray-50'>
            By {entry.company.name}:
          </h1>
        </div>
        <div className='px-4 py-3 text-gray-800 dark:text-gray-50'>
          <li className='list-none'>
            {entry.campaigns.map(campaign =>
              <ul key={`cmp-${campaign.id}`} className="group p-2 rounded cursor-pointer hover:bg-blue-100 dark:hover:bg-gray-500" onClick={() => handleOpenModal(campaign.name, campaign.description)}>
                <div className="flex items-center justify-between">
                  {campaign.name}
                  <ChevronRightIcon className='h-6 w-6 hidden sm:group-hover:block' />
                </div>
              </ul>
            )}
          </li>
        </div>
      </div>
      <CampaignModal
        open={modalOpen}
        setOpen={setModalOpen}
        title={data.title}
        content={data.content}
      />
    </>
  );
};

const Campaigns = () => {
  const [companies, setCompanies] = useState([]);

  useEffect(() => {
    campaignService.getByCompany()
      .then(company_list => {
        setCompanies(company_list);
      });
  }, []);

  return (
    <div className='p-5'>
      <h1 className='text-3xl font-semibold text-gray-700 dark:text-white mb-3'>Campaigns</h1>
      {companies.length === 0 && <h2 className='text-xl font-medium text-gray-600 dark:text-gray-200'>No companies registered yet.</h2>}
      <div className='flex flex-wrap gap-6'>
        {companies.map(company => <CompanySection key={`c-${company.id}`} entry={company} />)}
      </div>
    </div>
  );
};

export default Campaigns;
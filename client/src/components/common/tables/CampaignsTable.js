import React, { useState } from 'react';
import ContentModal from '../../overlay/ContentModal';
import SlideOver from '../../overlay/SlideOver';
import EditCampaignForm from '../forms/EditCampaignForm';
import { useDashboard } from '../../../context/DashboardContext';
import { useUser } from '../../../context/UserContext';

const CampaignModal = ({ open, setOpen, content }) => {
  return (
    <ContentModal open={open} setOpen={setOpen}>
      <div className="inline-block align-bottom bg-white dark:bg-gray-800 rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
        <div className="bg-white dark:bg-gray-800 px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
          <div className="sm:flex sm:items-start">
            <div className="mt-3 text-center sm:mt-0 sm:text-left">
              <p className="text-sm text-gray-500 dark:text-gray-100">
                {content}
              </p>
            </div>
          </div>
        </div>
        <div className="bg-gray-50 dark:bg-gray-800 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
          <button
            type="button"
            className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 text-base text-white font-mediumtext-gray-200 bg-indigo-600 hover:bg-indigo-500 dark:bg-indigo-500 dark:hover:bg-indigo-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:text-sm"
            onClick={() => setOpen(false)}
          >
            Close
          </button>
        </div>
      </div>
    </ContentModal>
  );
};

const SeeAllLink = ({ campaign }) => {
  const [modalOpen, setModalOpen] = useState(false);
  const [modalContent, setModalContent] = useState('');

  const handleOpenModal = (content) => {
    setModalContent(content);
    setModalOpen(true);
  };

  return (
    <>
      <span
        href={`/${campaign.id}`}
        className="cursor-pointer text-indigo-600 hover:text-indigo-900 dark:text-indigo-300 dark:hover:text-indigo-200"
        onClick={() => handleOpenModal(campaign.description)}
      >
        See all
      </span>
      <CampaignModal
        open={modalOpen}
        setOpen={setModalOpen}
        content={modalContent}
      />
    </>
  );
};

const CampaignsTable = () => {
  const [openSlide, setOpenSlide] = useState(false);
  const [slideCampaign, setSlideCampaign] = useState({});
  const { state } = useDashboard();
  const { user } = useUser();

  const handleEdit = (campaign, e) => {
    e.preventDefault();
    setSlideCampaign(campaign);
    setOpenSlide(true);
  };

  const getOwnCampaigns = () => {
    return user.role === 'AD'
      ? state.campaigns
      : state.campaigns.filter(c => c.company_id === user.id);
  };

  return (
    <>
      <SlideOver open={openSlide} setOpen={setOpenSlide} >
        <EditCampaignForm data={slideCampaign} setOpen={setOpenSlide} />
      </SlideOver>
      <div className="shadow overflow-x-auto lg:border-b lg:border-gray-200 lg:rounded-lg dark:border-gray-800">
        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-600">
          <thead className="bg-gray-50 dark:bg-gray-900">
            <tr>
              <th
                scope="col"
                className="px-6 py-3 text-left text-md font-bold text-gray-500 uppercase tracking-wider dark:text-gray-200"
              >
                Name
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-md font-bold text-gray-500 uppercase tracking-wider dark:text-gray-200"
              >
                Description
              </th>
              <th scope="col" className="relative px-6 py-3">
                <span className="sr-only">Edit</span>
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200 dark:divide-gray-600 dark:bg-gray-800">
            {getOwnCampaigns().map(campaign => (
              <tr key={campaign.id}>
                <td className="px-2 py-2 whitespace-normal">
                  <div className="flex items-center">
                    <div className="ml-4">
                      <div className="text-md font-semibold text-gray-900 dark:text-gray-50">{campaign.name}</div>
                      <div className="text-md text-gray-500 dark:text-gray-300">{campaign.company_name}</div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-normal min-w-max">
                  <div className="text-md text-gray-900 max-w-xl md:max-w-xl lg:max-w-2xl xl:max-w-3xl dark:text-gray-50">
                    {`${campaign.description.substring(0, 300)}${campaign.description.length > 300 ? '...' : ''} `}
                    {campaign.description.length > 300 ? <SeeAllLink campaign={campaign} /> : ''}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-md font-medium">
                  <a href="#" onClick={(e) => handleEdit(campaign, e)} className="text-indigo-600 hover:text-indigo-900 dark:text-indigo-300 dark:hover:text-indigo-200">
                    Edit
                  </a>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
};

export default CampaignsTable;
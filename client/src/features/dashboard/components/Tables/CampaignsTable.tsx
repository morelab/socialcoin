import React from 'react';
import { useTranslation } from 'react-i18next';

import { ContentModal } from '../../../../components/Overlay/ContentModal';
import { SearchBar } from '../../../../components/Form/SearchBar';
import { EditCampaignMenu } from '../Menus/EditCampaignMenu';

import { Campaign } from '../../../../types';
import { useData } from '../../../../context/DataContext';


type CampaignModalProps = {
  open: boolean;
  setOpen: (open: boolean) => void;
  content: string;
};

type SeeAllLinksProps = {
  campaign: Campaign;
};


const CampaignModal = ({ open, setOpen, content }: CampaignModalProps) => {
  const { t } = useTranslation();

  return (
    <ContentModal open={open} setOpen={setOpen} className='p-4 sm:p-8'>
      <div className="sm:flex sm:items-start mb-4">
        <div className="mt-3 text-center sm:mt-0 sm:text-left">
          <p className="text-sm text-gray-500 dark:text-gray-100">
            {content}
          </p>
        </div>
      </div>
      <div className="bg-gray-50 dark:bg-gray-800 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
        <button
          type="button"
          className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 text-base text-white font-mediumtext-gray-200 bg-indigo-600 hover:bg-indigo-500 dark:bg-indigo-500 dark:hover:bg-indigo-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:text-sm"
          onClick={() => setOpen(false)}
        >
          {t('common.close')}
        </button>
      </div>
    </ContentModal>
  );
};

const SeeAllLink = ({ campaign }: SeeAllLinksProps) => {
  const [modalOpen, setModalOpen] = React.useState(false);
  const [modalContent, setModalContent] = React.useState('');
  const { t } = useTranslation();

  const handleOpenModal = (content: string) => {
    setModalContent(content);
    setModalOpen(true);
  };

  return (
    <>
      <span
        className="cursor-pointer text-indigo-600 hover:text-indigo-900 dark:text-indigo-300 dark:hover:text-indigo-200"
        onClick={() => handleOpenModal(campaign.description)}
      >
        {t('dashboard.seeAll')}
      </span>
      <CampaignModal
        open={modalOpen}
        setOpen={setModalOpen}
        content={modalContent}
      />
    </>
  );
};

export const CampaignsTable = () => {
  const [searchValue, setSearchValue] = React.useState('');
  const [openSlide, setOpenSlide] = React.useState(false);
  const [slideCampaign, setSlideCampaign] = React.useState<Campaign>({} as Campaign);
  const { t } = useTranslation();
  const { data } = useData();

  const handleEdit = (campaign: Campaign, event: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => {
    event.preventDefault();
    setSlideCampaign(campaign);
    setOpenSlide(true);
  };

  const handleSearch = (event: React.FormEvent<HTMLInputElement>) => {
    const value = event.currentTarget.value;
    setSearchValue(value);
  };

  const campaigns = searchValue === ''
    ? data.campaigns
    : data.campaigns.filter(campaign => {
      return campaign.name.toLowerCase().includes(searchValue.toLowerCase())
        || campaign.company_name.toLowerCase().includes(searchValue.toLowerCase())
        || campaign.description.toLowerCase().includes(searchValue.toLowerCase());
    });

  return (
    <>
      <EditCampaignMenu campaign={slideCampaign} open={openSlide} setOpen={setOpenSlide} />
      <div className="shadow overflow-x-auto lg:border-b lg:border-gray-200 lg:rounded-lg dark:border-gray-800 bg-white dark:bg-gray-800 divide-y divide-gray-500">
        <div className='m-2 px-2 sm:px-3.5 flex items-center justify-between'>
          <h2 className='text-xl sm:text-2xl font-bold mr-5 text-gray-900 dark:text-gray-50'>{t('main.campaigns')}</h2>
          <SearchBar value={searchValue} changeHandler={handleSearch} />
        </div>
        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-600">
          <thead className="bg-gray-50 dark:bg-gray-900">
            <tr>
              <th
                scope="col"
                className="px-6 py-3 text-left text-md font-bold text-gray-500 uppercase tracking-wider dark:text-gray-200"
              >
                {t('dashboard.tables.name')}
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-md font-bold text-gray-500 uppercase tracking-wider dark:text-gray-200"
              >
                {t('dashboard.tables.description')}
              </th>
              <th scope="col" className="relative px-6 py-3">
                <span className="sr-only">{t('common.edit')}</span>
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200 dark:divide-gray-600 dark:bg-gray-800">
            {campaigns.map(campaign => (
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
                    {t('common.edit')}
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
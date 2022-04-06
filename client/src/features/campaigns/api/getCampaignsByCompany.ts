import { axios } from '../../../lib/axios';
import { Campaign, User } from '../../../types';

export type CompanyCampaigns = {
  company: User;
  campaigns: Campaign[];
};

export const getCampaignsByCompany = async (): Promise<CompanyCampaigns[]> => {
  const companies = await axios.get('/api/campaigns/company');
  return companies.data;
}
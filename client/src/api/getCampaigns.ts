import { axios } from '../lib/axios';
import { Campaign } from '../types';

export const getCampaigns = async (): Promise<Campaign[]> => {
  const result = await axios.get('/api/campaigns');
  return result.data;
};
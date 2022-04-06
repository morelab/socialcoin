import { axios } from '../../../lib/axios';

export const deleteCampagin = async (campaignID: string) => {
  const result = await axios.delete(`/api/campaigns/${campaignID}`);
  return result;
};
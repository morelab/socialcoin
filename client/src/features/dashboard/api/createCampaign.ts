import { axios } from '../../../lib/axios';
import { NewCampaignFormContent } from '../components/Menus/NewCampaignMenu';

export const createCampaign = async (newCampaign: NewCampaignFormContent) => {
  const result = await axios.post('/api/campaigns', newCampaign);
  return result.data;
};
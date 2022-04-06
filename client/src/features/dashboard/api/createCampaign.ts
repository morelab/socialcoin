import { axios } from "../../../lib/axios";
import { NewCampaignFormContent } from "../components/Menus/NewCampaignMenu";

export const createCampaign = async (newCampaign: NewCampaignFormContent) => {
  console.log('campaignService.createNew');
  const result = await axios.post('/api/campaigns', newCampaign);
  return result.data;
};
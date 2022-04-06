import { axios } from "../../../lib/axios";
import { Campaign } from "../../../types";
import { FormContent } from "../components/Menus/EditCampaignMenu";

export const updateCampaign = async (campaignID: number, newCampaign: FormContent): Promise<Campaign> => {
  const result = await axios.put(`/api/campaigns/${campaignID}`, newCampaign);
  return result.data;
};
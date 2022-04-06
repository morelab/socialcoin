import { axios } from "../../../lib/axios";

export const deleteCampagin = async (campaignID: number) => {
  const result = await axios.delete(`/api/campaigns/${campaignID}`);
  return result;
};
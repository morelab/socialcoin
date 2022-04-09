import { axios } from '../../../lib/axios';

export const redeemOffer = async (offerID: string) => {
  const result = await axios.post(`/api/offers/${offerID}/redeem`);
  return result;
};
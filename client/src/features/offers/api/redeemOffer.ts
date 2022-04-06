import { axios } from "../../../lib/axios";

export const redeemOffer = async (offerID: string) => {
  console.log('offerService.redeemOne');
  const result = await axios.post(`/api/offers/${offerID}/redeem`);
  return result;
};
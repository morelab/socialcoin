import { axios } from '../../../lib/axios';

export const deleteOffer = async (offerID: string) => {
  const result = await axios.delete(`/api/offers/${offerID}`);
  return result;
};
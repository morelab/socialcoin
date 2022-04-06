import { axios } from '../../../lib/axios';
import { Offer } from '../../../types';

export const getOffer = async (offerId: string): Promise<Offer> => {
  const result = await axios.get(`/api/offers/${offerId}`);
  return result.data;
};
import { axios } from '../../../lib/axios';
import { Offer } from '../../../types';

export const getOffers = async (): Promise<Offer[]> => {
  const result = await axios.get('/api/offers');
  return result.data;
}
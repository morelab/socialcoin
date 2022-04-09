import { axios } from '../../../lib/axios';
import { NewOfferFormContent } from '../components/Menus/NewOfferMenu';

export const createOffer = async (newOffer: NewOfferFormContent) => {
  const createdOffer = await axios.post('/api/offers', newOffer);
  return createdOffer.data;
};
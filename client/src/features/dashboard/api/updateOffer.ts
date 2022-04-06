import { axios } from '../../../lib/axios';
import { Offer } from '../../../types';
import { FormContent } from '../components/Menus/EditOfferMenu';

export const updateOffer = async (offerID: string, newOffer: FormContent): Promise<Offer> => {
  const result = await axios.put(`/api/offers/${offerID}`, newOffer);
  return result.data;
};
import { axios } from "../../../lib/axios";

export const deleteOffer = async (offerID: number) => {
  const result = await axios.delete(`/api/offers/${offerID}`);
  return result;
};
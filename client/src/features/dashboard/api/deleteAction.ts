import { axios } from "../../../lib/axios";

export const deleteAction = async (actionID: number) => {
  const result = await axios.delete(`/api/actions/${actionID}`);
  return result;
};
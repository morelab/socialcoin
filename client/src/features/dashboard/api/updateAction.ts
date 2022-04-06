import { axios } from "../../../lib/axios";
import { Action } from "../../../types";
import { FormContent } from "../components/Menus/EditActionMenu";

export const updateAction = async (actionID: number, newAction: FormContent): Promise<Action> => {
  const result = await axios.put(`/api/actions/${actionID}`, newAction);
  return result.data;
};
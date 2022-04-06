import { axios } from '../../../lib/axios';
import { Action } from '../../../types';

export const getAction = async (actionId: string): Promise<Action> => {
  const result = await axios.get(`/api/actions/${actionId}`);
  return result.data;
};
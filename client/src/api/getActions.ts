import { axios } from '../lib/axios';
import { Action } from '../types';

export const getActions = async (): Promise<Action[]> => {
  const result = await axios.get('/api/actions');
  return result.data;
};
import { axios } from '../../../lib/axios';
import { User } from '../../../types';

export const getUsers = async (): Promise<User[]> => {
  const result = await axios.get('/api/users/admin');
  return result.data;
};
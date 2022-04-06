import { axios } from '../../../lib/axios';

export const getSelfUserBalance = async (): Promise<number> => {
  const result = await axios.get('/api/users/balance');
  return result.data.balance;
};
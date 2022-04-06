import { axios } from '../../lib/axios';

export const logout = async () => {
  return axios.post('/api/logout');
};
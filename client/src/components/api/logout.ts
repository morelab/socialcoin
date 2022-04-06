import { axios } from '../../lib/axios';

export const logout = async (): Promise<any> => {
  return axios.post('/api/logout');
}
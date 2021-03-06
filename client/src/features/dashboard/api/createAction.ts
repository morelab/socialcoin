import { axios } from '../../../lib/axios';
import { NewActionFormContent } from '../components/Menus/NewActionMenu';

export const createAction = async (newAction: NewActionFormContent) => {
  const result = await axios.post('/api/actions', newAction);
  return result.data;
};
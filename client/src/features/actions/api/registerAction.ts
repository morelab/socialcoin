import { axios } from '../../../lib/axios';

export const registerAction = async (actionId: number, formData: FormData): Promise<any> => {
  const result = await axios.post(
    `/api/actions/${actionId}/register`,
    formData,
    {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    }
  );
  return result.data;
}
import { axios } from "../../../lib/axios";
import { User } from "../../../types";

export const updateUserSelf = async (name: string): Promise<User> => {
  const result = await axios.put('/api/users/self', { name: name });
  return result.data;
};
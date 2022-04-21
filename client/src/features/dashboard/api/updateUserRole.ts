import { axios } from '../../../lib/axios';
import { RoleKey, User } from '../../../types';


type UpdateUserDTO = {
  new_role: RoleKey;
};

export const updateUserRole = async (userID: string, newUserData: UpdateUserDTO): Promise<User> => {
  const result = await axios.put(`/api/users/admin/${userID}`, newUserData);
  return result.data;
};
import React from 'react';
import { axios } from '../lib/axios';

import { useUser } from '../context/UserContext';
import { User } from '../types';

type UserResponse = {
  data: User;
};

export const getSelf = (): Promise<UserResponse> => {
  return axios.get('/api/users/self');
};

export const useUserRequired = (): boolean => {
  const [loaded, setLoaded] = React.useState<boolean>(false);
  const { user, setUser } = useUser();

  React.useEffect(() => {
    if (user === null) {
      getSelf()
        .then(result => {
          setUser(result.data);
          setLoaded(true);
        }).catch(err => {
          console.log(err);
          setLoaded(true);
        });
    }
  }, [user, setUser]);

  return loaded;
};
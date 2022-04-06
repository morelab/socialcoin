import React from 'react';
import { useHistory } from 'react-router-dom';
import { axios } from '../lib/axios';

import { useUser } from '../context/UserContext';
import { User } from '../types';

const getSelf = async (): Promise<User> => {
  const result = await axios.get('/api/users/self');
  return result.data;
};

export const useUserRequired = () => {
  const { user, setUser } = useUser();
  const history = useHistory();

  React.useEffect(() => {
    if (user == null) {
      getSelf()
        .then(result => {
          setUser(result);
          console.log(result);
        }).catch(err => {
          console.log(err);
          history.push('/');
        });
    }
  }, [user, setUser]);
};
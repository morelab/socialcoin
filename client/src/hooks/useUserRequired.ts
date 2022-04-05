import React from 'react';
import { useHistory } from 'react-router-dom';
import axios from 'axios';

import { useUser } from '../context/UserContext';

export const useUserRequired = () => {
  const { user, setUser } = useUser();
  const history = useHistory();

  React.useEffect(() => {
    if (user == null) {
      axios.get('/api/users/self')
        .then(result => {
          setUser(result.data);
          console.log(result.data);
        }).catch(err => {
          history.push('/');
        });
    }
  }, [user, setUser]);
};
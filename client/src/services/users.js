import axios from 'axios';

const serializeResponse = response => {
  return response
    .text()
    .then(text => {
      return text ? JSON.parse(text) : {};
    })
    .then(data => ({ status: response.status, ok: response.ok, data }));
};

const handle4xx = resp => {
  if (resp.status === 401) {
    history.push('/');
    // notifyError('Unauthenticated.');
  } else if (resp.status === 403) {
    // notifyError('Unauthorized)
  }

  return resp;
};

const getSelf = () => {
  console.log('userService.getSelf');
  axios.get('/api/users/self')
    .then(serializeResponse)
    .then(handle4xx);
};

const updateSelf = async (name) => {
  console.log('userService.updateOne');
  const result = await axios.put('/api/users/self', { name: name });
  return result.data;
};

const getSelfBalance = async () => {
  console.log('userService.getSelfBalance');
  const result = await axios.get('/api/users/balance');
  return result.data;
};

const logout = () => {
  console.log('userService.logout');
  const result = axios.post('/api/logout');
  return result;
};

export default {
  getSelf,
  updateSelf,
  getSelfBalance,
  logout
};
import axios from 'axios';

axios.defaults.headers.post['Content-Type'] = 'application/json';

const getAll = async () => {
  console.log('actionService.getAll');
  const actions = await axios.get('/api/actions');
  return actions.data;
};

const getOne = async (actionID) => {
  console.log('actionService.getOne');
  const action = await axios.get(`/api/actions/${actionID}`);
  return action.data;
};

const createNew = async (newObject) => {
  console.log('actionService.createNew');
  const result = await axios.post('/api/actions', newObject);
  return result.data;
};

const updateOne = async (actionID, newObject) => {
  console.log('actionService.updateOne');
  const result = await axios.put(`/api/actions/${actionID}`, newObject);
  return result.data;
};

const deleteOne = async (actionID) => {
  console.log('actionService.deleteOne');
  const result = await axios.delete(`/api/actions/${actionID}`);
  return result;
};

const registerAction = async (actionID, actionData) => {
  console.log('actionService.registerAction');
  const result = await axios.post(
    `/api/actions/${actionID}/register`,
    actionData,
    {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    }
  );
  return result;
};

const exportObj = {
  getAll,
  getOne,
  createNew,
  updateOne,
  deleteOne,
  registerAction
};

export default exportObj;
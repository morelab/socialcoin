import axios from 'axios';

axios.defaults.headers.post['Content-Type'] = 'application/json';

const getAll = async () => {
  console.log('campaignService.getAll');
  const campaigns = await axios.get('/api/campaigns');
  return campaigns.data;
};

const getByCompany = async () => {
  console.log('campaignService.getByCompany');
  const companies = await axios.get('/api/campaigns/company');
  return companies.data;
};

const createNew = async (newObject) => {
  console.log('campaignService.createNew');
  const result = await axios.post('/api/campaigns', newObject);
  return result.data;
};

const updateOne = async (campaignID, newObject) => {
  console.log('campaignService.updateOne');
  const result = await axios.put(`/api/campaigns/${campaignID}`, newObject);
  return result.data;
};

const deleteOne = async (campaignID) => {
  console.log('campaignService.deleteOne');
  const result = await axios.delete(`/api/campaigns/${campaignID}`);
  return result;
};

const exportObj = {
  getAll,
  getByCompany,
  createNew,
  updateOne,
  deleteOne,
};

export default exportObj;
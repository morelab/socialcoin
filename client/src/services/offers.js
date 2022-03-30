import axios from 'axios';

axios.defaults.headers.post['Content-Type'] = 'application/json';

const getAll = async () => {
  console.log('offerService.getAll');
  const offers = await axios.get('/api/offers');
  return offers.data;
};

const getOne = async (offerID) => {
  console.log('offerService.getOne');
  const offers = await axios.get(`/api/offers/${offerID}`);
  return offers.data;
};

const createNew = async (newOffer) => {
  console.log('offerService.createNew');
  const createdOffer = await axios.post('/api/offers', newOffer);
  return createdOffer.data;
};

const updateOne = async (offerID, newObject) => {
  console.log('offerService.updateOne');
  const result = await axios.put(`/api/offers/${offerID}`, newObject);
  return result.data;
};

const deleteOne = async (offerID) => {
  console.log('offerService.deleteOne');
  const result = await axios.delete(`/api/offers/${offerID}`);
  return result;
};

const redeemOne = async (offerID) => {
  console.log('offerService.redeemOne');
  const result = await axios.post(`/api/offers/${offerID}/redeem`);
  return result;
};

const exportObj = {
  getAll,
  getOne,
  createNew,
  updateOne,
  deleteOne,
  redeemOne,
};

export default exportObj;
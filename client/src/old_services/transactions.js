import axios from 'axios';

axios.defaults.headers.post['Content-Type'] = 'application/json';

const getAll = async () => {
  console.log('transactionService.getAll');
  const result = await axios.get('/api/transactions');
  return result.data;
};

const exportObj = {
  getAll,
};

export default exportObj;
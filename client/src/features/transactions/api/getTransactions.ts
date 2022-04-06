import { axios } from "../../../lib/axios";
import { Transaction } from "../../../types";

export const getTransactions = async (): Promise<Transaction[]> => {
  const result = await axios.get('/api/transactions');
  return result.data;
};
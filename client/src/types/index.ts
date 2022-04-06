export type RoleKey = 'AD' | 'PM' | 'CB';
export type Role = 'Administrator' | ' Promoter' | 'Collaborator';

export type User = {
  id: string;
  name: string;
  email: string;
  role: RoleKey;
  blockchain_public: string;
  picture_url: string;
  balance: number;
};

export type Campaign = {
  id: string;
  name: string;
  description: string;
  company_id: string;
  company_name: string;
};

export type Action = {
  id: string;
  name: string;
  description: string;
  reward: number;
  kpi: number;
  kpi_target: number;
  kpi_indicator: string;
  company_id: string;
  company_name: string;
  campaign_id: string;
};

export type Offer = {
  id: string;
  name: string;
  description: string;
  price: number;
  company_name: string;
  company_id: string;
};

export type Transaction = {
  id: string;
  date: string;
  transaction_hash: string;
  sender_address: string;
  sender_email: string;
  sender_name: string;
  receiver_address: string;
  receiver_email: string;
  receiver_name: string;
  quantity: number;
  transaction_info: string;
  img_ipfs_hash: string;
  external_proof_url: string;
};
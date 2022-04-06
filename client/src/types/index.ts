export type RoleKey = 'AD' | 'PM' | 'CB';
export type Role = 'Administrator' | ' Promoter' | 'Collaborator';

export type User = {
  id: number;
  name: string;
  email: string;
  role: RoleKey;
  blockchain_public: string;
  picture_url: string;
};

export type Campaign = {
  id: number;
  name: string;
  description: string;
  company_id: number;
  company_name: string;
};

export type Action = {
  id: number;
  name: string;
  description: string;
  reward: number;
  kpi: number;
  kpi_target: number;
  kpi_indicator: string;
  company_id: number;
  company_name: string;
  campaign_id: number;
};

export type Offer = {
  id: number;
  name: string;
  description: string;
  price: number;
  company_name: string;
  company_id: number;
};

export type Transaction = {
  id: number;
  date: string;
  transaction_hash: string;
  sender_address: string;
  receiver_address: string;
  quantity: number;
  transaction_info: string;
  img_ipfs_hash: string;
  external_proof_url: string;
};
export type UserRole = 'CUSTOMER' | 'SALES_AGENT' | 'RELATIONSHIP_MANAGER' | 'CREDIT_ANALYST' | 'OPERATIONS' | 'ADMIN';

export interface User {
  id: number;
  email: string;
  name: string;
  role: UserRole;
}

export type LeadStatus = 
  | 'NEW' 
  | 'ASSIGNED' 
  | 'IN_REVIEW' 
  | 'DOCS_PENDING' 
  | 'DOCS_VERIFIED' 
  | 'CREDIT_APPROVED' 
  | 'SANCTIONED' 
  | 'DISBURSED' 
  | 'REJECTED';

export interface Lead {
  id: number;
  customer_id: number;
  name: string;
  phone: string;
  email: string;
  pan: string;
  aadhar: string;
  income: number;
  property_value: number;
  loan_amount: number;
  tenure: number;
  status: LeadStatus;
  assigned_to?: number;
  rm_id?: number;
  created_at: string;
  updated_at: string;
}

export interface BankOffer {
  id: number;
  bank_name: string;
  roi: number;
  processing_fee: number;
  max_tenure: number;
  min_income: number;
}

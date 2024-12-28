export type XenditCallback = {
  id: string;
  amount: number;
  status: string;
  created: string;
  is_high: boolean;
  paid_at: string;
  updated: string;
  user_id: string;
  currency: string;
  payment_id: string;
  description: string;
  external_id: string;
  paid_amount: number;
  ewallet_type: string;
  merchant_name: string;
  payment_method: string;
  payment_channel: string;
  payment_method_id: string;
  failure_redirect_url: string;
  success_redirect_url: string;
};

export type UserProfile = {
  sub: string;
  role: string;
  email: string;
  lastname: string;
  firstname: string;
  mobile_number: string;
  email_verified: boolean;
  phone_verified: boolean;
  avatar_link: string;
};

export class PaddleUser {
  subscription_id: number;
  plan_id: number;
  user_id: number;
  user_email: string;
  marketing_consent: boolean;
  update_url: string;
  cancel_url: string;
  state: string;
  signup_date: string;
  quantity: number;
  last_payment: PaddlePayment;
  payment_information: PaddlePaymentInformation;
  next_payment: PaddlePayment;
}

export class PaddlePayment {
  amount: number;
  currency: string;
  date: string;
}

export class PaddlePaymentInformation {
  payment_method: string;
  card_type: string;
  last_four_digits: string;
  expiry_date: string;
}

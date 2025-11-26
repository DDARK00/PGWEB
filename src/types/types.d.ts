export type Merchant = {
  bizType: string;
  mchtCode: string;
  status?: Number;
  mchtName?: string;
};

export interface ApiError {
  message: string;
  original: any;
  code: number;
}

export type ApiResponse<T> = {
  success: true | false;
  data?: {
    status: number;
    data?: T;
    message?: string;
  };
  error?: ApiError;
};

export type Payment = {
  paymentCode: string;
  mchtCode: string;
  amount: string;
  currency: string;
  payType: string;
  status: string;
  paymentAt: string;
};

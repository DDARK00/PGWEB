export type Merchant = {
  bizType: string;
  mchtCode: string;
  status?: Number;
  mchtName?: string;
};

export type MerchantDetail = {
  mchtCode: string;
  mchtName: string;
  status: string;
  bizType: string;
  bizNo: string;
  address: string;
  phone: string;
  email: string;
  registeredAt: string;
  updatedAt: string;
};

export interface ApiError {
  message: string;
  // `original`은 서버 또는 라이브러리(예: axios)가 던진 원본 에러 객체입니다.
  // 다양한 형태(문자열, Error 인스턴스, axios 에러 객체 등)가 올 수 있으므로
  // 구체적인 타입을 보장할 수 없습니다. 가능한 경우 `unknown`을 사용하여
  // 호출부에서 안전하게 좁혀서 처리하도록 유도합니다.
  original: unknown;
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

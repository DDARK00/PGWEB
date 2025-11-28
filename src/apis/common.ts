import { createAxiosInstance } from "./base";
import { ApiHandler } from "./apiHandler";
import type { ApiResponse } from "../types/types";

type MchtStatusItem = { code: string; description: string };
type PaymentTypeItem = { type: string; description: string };
type PaymentStatusItem = { code: string; description: string };
type ServerPayload<T> = { status: number; data?: T; message?: string };

// 가맹점 상태 코드 조회
export async function getMchtStatus(
  client = createAxiosInstance()
): Promise<ApiResponse<MchtStatusItem[]>> {
  return ApiHandler(() =>
    client.get<ServerPayload<MchtStatusItem[]>>("/common/mcht-status/all")
  );
}

// 결제 수단 코드 조회
export async function getPaymentType(
  client = createAxiosInstance()
): Promise<ApiResponse<PaymentTypeItem[]>> {
  return ApiHandler(() =>
    client.get<ServerPayload<PaymentTypeItem[]>>("/common/payment-type/all")
  );
}

// 결제 상태 코드 조회
export async function getPaymentStatus(
  client = createAxiosInstance()
): Promise<ApiResponse<PaymentStatusItem[]>> {
  return ApiHandler(() =>
    client.get<ServerPayload<PaymentStatusItem[]>>("/common/payment-status/all")
  );
}

export default { getMchtStatus, getPaymentType, getPaymentStatus };

import { createAxiosInstance, BASE_URL } from "./base";
import axios from "axios";
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

// health check
export async function ping(
  _client = createAxiosInstance()
): Promise<ApiResponse<Record<string, any>>> {
  // The health endpoint lives at the API origin (no /api/v1 prefix).
  const origin = String(BASE_URL).replace(/\/api\/v1\/?$/i, "");
  const url = `${origin}/health`;

  try {
    const res = await axios.get<Record<string, any>>(url);
    // Healthy only when HTTP 200
    if (res.status === 200) {
      return { success: true, data: { status: res.status, data: res.data } };
    }
    return {
      success: false,
      error: {
        message: `Health check returned ${res.status}`,
        original: res,
        code: res.status,
      },
    };
  } catch (err: any) {
    const apiError = {
      message: err?.message ?? "Unknown error",
      original: err,
      code: err?.response?.status ?? err?.code ?? -1,
    } as const;
    return { success: false, error: apiError };
  }
}

export default { ping, getMchtStatus, getPaymentType, getPaymentStatus };

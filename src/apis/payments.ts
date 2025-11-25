import { createAxiosInstance } from "./base";
import { ApiHandler } from "./apiHandler";
import type { Payment } from "../types/types";

/**
 * Payments API
 * - `getPayments`은 `GET /payments` 형태의 엔드포인트를 호출합니다.
 * - 내부적으로 `createAxiosInstance()`를 사용하며 `ApiHandler`로 에러를 일관되게 처리합니다.
 */
export async function getPayments(
  params: string,
  client = createAxiosInstance()
): Promise<Payment[]> {
  // ApiHandler를 사용하여, 응답 객체에서 data 필드를 추출해 반환
  const response = await ApiHandler(() =>
    client.get<{ status: number; data?: Payment[]; message?: string }>(
      `/payments/${params}`
    )
  );

  // 응답이 성공적이고, data가 존재하면 data.data를 반환
  if (response.success && response.data) {
    return response.data.data ?? [];
  }

  // 실패했을 경우 빈 배열을 반환하거나 에러 처리
  throw new Error("Failed to fetch merchants");
}

export default { getPayments };

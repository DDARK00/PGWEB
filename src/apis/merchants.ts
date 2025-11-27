import { createAxiosInstance } from "./base";
import ApiHandler from "./apiHandler";
import type { Merchant, MerchantDetail } from "../types/types";

/**
 * Merchants API
 * - `getMerchant`은 `GET /merchants/{params}` 형태의 엔드포인트를 호출합니다.
 * - 내부적으로 `createAxiosInstance()`를 사용하며 `ApiHandler`로 에러를 일관되게 처리합니다.
 */
export async function getMerchant(
  params: string,
  client = createAxiosInstance()
): Promise<Merchant[]> {
  // ApiHandler를 사용하여, 응답 객체에서 data 필드를 추출해 반환
  const response = await ApiHandler<Merchant[]>(() =>
    client.get<{ status: number; data?: Merchant[]; message?: string }>(
      `/merchants/${params}`
    )
  );

  // 응답이 성공적이고, data가 존재하면 data.data를 반환
  if (response.success && response.data) {
    return response.data.data ?? []; // data 필드가 있으면 반환, 없으면 빈 배열 반환
  }

  // 실패했을 경우 빈 배열을 반환하거나 에러 처리
  throw new Error("Failed to fetch merchants");
}

export async function getDetailMerchant(
  mchtCode: string,
  client = createAxiosInstance()
): Promise<MerchantDetail | null> {
  // ApiHandler를 사용하여, 응답 객체에서 data 필드를 추출해 반환
  const response = await ApiHandler<MerchantDetail>(() =>
    client.get<{ status: number; data?: MerchantDetail; message?: string }>(
      `/merchants/details/${mchtCode}`
    )
  );
  // 응답이 성공적이고, data가 존재하면 data.data를 반환
  if (response.success && response.data) {
    return response.data.data ?? null; // data 필드가 있으면 반환, 없으면 null 반환
  }
  // 실패했을 경우 null을 반환하거나 에러 처리
  throw new Error("Failed to fetch merchant details");
}

export default { getMerchant, getDetailMerchant };

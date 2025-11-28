import type { AxiosResponse } from "axios";
import type { ApiError, ApiResponse as ApiResponseType } from "../types/types";

type ServerPayload<T> = {
  status: number;
  data?: T;
  message?: string;
};

/**
 * ApiHandler: axios 요청을 안전하게 래핑해 일관된 응답 객체를 반환합니다.
 * - 서버가 응답 본문을 반환하면(`res.data`), 이를 `success: true`로 간주합니다.
 * - 네트워크/타임아웃 등의 이유로 응답이 전혀 없는 경우에는 `success: false`와 `error`를 반환합니다.
 */
export async function ApiHandler<T>(
  fn: () => Promise<AxiosResponse<ServerPayload<T>>>
): Promise<ApiResponseType<T>> {
  try {
    const res = await fn();
    const payload = res.data;
    return { success: true, data: payload };
  } catch (err: unknown) {
    // 에러 객체는 axios 또는 네트워크/런타임에서 온 다양한 형태를 가질 수 있습니다.
    // catch 파라미터는 `unknown`으로 받아야 더 안전합니다. 다만 아래에서
    // 라이브러리 특정 필드(`response`, `message`, `code`)에 접근해야 하므로
    // 로컬에서 필요한 경우에만 `any`로 캐스트하여 참조합니다.
    const anyErr = err as any; // axios 등 외부 라이브러리 에러가 대부분 구조화되어 있어 로컬 캐스트.

    // axios가 에러 응답 본문을 포함한 경우, 서버가 보낸 페이로드를 success로 처리합니다.
    if (anyErr?.response?.data) {
      const payload = anyErr.response.data as ServerPayload<T>;
      return { success: true, data: payload };
    }

    const apiError: ApiError = {
      message: anyErr?.message ?? "Unknown error",
      original: err,
      code: anyErr?.response?.status ?? anyErr?.code ?? -1,
    };
    return { success: false, error: apiError };
  }
}

export default ApiHandler;

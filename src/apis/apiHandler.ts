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
  } catch (err: any) {
    // axios는 기본적으로 non-2xx 응답에 대해 예외를 던집니다.
    // 하지만 서버가 본문을 응답으로 보내면(예: 비즈니스 에러 메세지),
    // 사용자는 "서버가 요청을 처리했다"고 간주할 수 있으므로 success: true 로 반환합니다.
    if (err?.response?.data) {
      const payload = err.response.data as ServerPayload<T>;
      return { success: true, data: payload };
    }

    const apiError: ApiError = {
      message: err?.message ?? "Unknown error",
      original: err,
      code: err?.response?.status ?? err?.code ?? -1,
    };
    return { success: false, error: apiError };
  }
}

export default ApiHandler;

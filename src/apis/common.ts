import { createAxiosInstance } from "./base";
import { ApiHandler } from "./apiHandler";
import type { ApiResponse } from "./apiHandler";

export async function ping(
  client = createAxiosInstance()
): Promise<ApiResponse<{ ok: boolean }>> {
  return ApiHandler(() => client.get<{ ok: boolean }>("/ping"));
}

export async function getConfig(
  client = createAxiosInstance()
): Promise<ApiResponse<Record<string, any>>> {
  return ApiHandler(() => client.get<Record<string, any>>("/config"));
}

export default { ping, getConfig };

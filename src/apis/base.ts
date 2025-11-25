import axios from "axios";
import type { AxiosInstance } from "axios";

let instance: AxiosInstance | null = null;

const BASE_URL = "https://recruit.paysbypays.com/api/v1";

export const createAxiosInstance = (): AxiosInstance => {
  if (instance) return instance;

  instance = axios.create({
    // baseURL: import.meta.env?.VITE_API_BASE_URL ?? "",
    baseURL: BASE_URL,
    timeout: 10000,
    headers: {
      "Content-Type": "application/json",
    },
  });

  // 기본 응답/요청 인터셉터 — 확장 또는 로깅을 위해 유지
  instance.interceptors.response.use(
    (res) => res,
    (err) => Promise.reject(err)
  );

  return instance;
};

export default createAxiosInstance;

import type {
  AxiosError,
  AxiosInstance,
  AxiosRequestConfig,
  AxiosResponse,
} from "axios";
import axios from "axios";

export let axiosInstance: AxiosInstance | null = null;

export const setInstance = (instance: AxiosInstance): void => {
  axiosInstance = instance;
};

export const createInstance = (apiURL: string): void => {
  setInstance(axios.create({ baseURL: apiURL }));
};

export const customInstance = async <T>(
  config: AxiosRequestConfig,
  options?: AxiosRequestConfig,
): Promise<AxiosResponse<T>> => {
  if (!axiosInstance) {
    throw new Error("Axios instance has not been initialised.");
  }
  const promise = axiosInstance({
    ...config,
    ...options,
  }).then((response) => response);
  return promise;
};

export type ErrorType<Error> = AxiosError<Error>;

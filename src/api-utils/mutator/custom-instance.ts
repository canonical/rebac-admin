import type {
  AxiosError,
  AxiosInstance,
  AxiosRequestConfig,
  AxiosResponse,
} from "axios";
import axios from "axios";

export let axiosInstance: AxiosInstance;

export const setInstance = (instance: AxiosInstance) => {
  axiosInstance = instance;
};

export const createInstance = (apiURL: string) => {
  setInstance(axios.create({ baseURL: apiURL }));
};

export const customInstance = <T>(
  config: AxiosRequestConfig,
  options?: AxiosRequestConfig,
): Promise<AxiosResponse<T>> => {
  const promise = axiosInstance({
    ...config,
    ...options,
  }).then((response) => response);
  return promise;
};

export type ErrorType<Error> = AxiosError<Error>;

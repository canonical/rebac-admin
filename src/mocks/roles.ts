import { HttpResponse, delay, http } from "msw";

import { Endpoint } from "types/api";

export const getGetRolesErrorMockHandler = (status: number = 404) => {
  return http.get(`*${Endpoint.ROLES}`, async () => {
    await delay(Number(import.meta.env.VITE_MOCK_API_DELAY));
    return new HttpResponse(undefined, {
      status,
      headers: {
        "Content-Type": "application/json",
      },
    });
  });
};

export const getPostRolesErrorMockHandler = (
  status = 500,
  response?: string,
) => {
  return http.post(`*${Endpoint.ROLES}`, async () => {
    await delay(Number(import.meta.env.VITE_MOCK_API_DELAY));
    return new HttpResponse(
      response ? JSON.stringify({ message: response }) : null,
      {
        status,
        headers: {
          "Content-Type": "application/json",
        },
      },
    );
  });
};

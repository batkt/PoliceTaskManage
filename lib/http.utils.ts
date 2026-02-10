"use client";

import { BASE_URL, TOKEN_KEY } from "./config";
import { CustomResponse } from "./types/global.types";

const API_URL = BASE_URL + '/api';

const reponseChecker = async (response: Response) => {
  const data = await response.json();

  if (data.code === 401) {
    // localStorage.removeItem(TOKEN_KEY);
    console.log("401");
  }
  return {
    isOk: data.code !== 401,
    ...data
  };
};

const getRequest = async <T>(
  url: string,
  token?: string,
  config?: ResponseInit & {
    baseUrl?: string;
  }
): Promise<CustomResponse<T>> => {
  try {
    const { headers, ...otherConfig } = config || {};

    const response = await fetch(`${config?.baseUrl || API_URL}${url}`, {
      method: "GET",
      headers: {
        ...getAuthHeaders(token),
        "Content-Type": "application/json",
        ...headers,
      },
      ...otherConfig,
    });

    if (!response.ok) {
      return {
        isOk: false,
        code: response.status,
        message: response.statusText,
      };
    }

    return reponseChecker(response);
  } catch (error) {
    console.error("Error in getRequest:", error);
    return {
      isOk: false,
      code: 500,
      message: "Internal Server Error",
    };
  }
};

const postRequest = async <T>(
  url: string,
  data?: any,
  token?: string,
  config?: ResponseInit & {
    baseUrl?: string;
  }
): Promise<CustomResponse<T>> => {
  try {
    const { headers, ...otherConfig } = config || {};
    const response = await fetch(`${config?.baseUrl || API_URL}${url}`, {
      method: "POST",
      headers: {
        ...getAuthHeaders(token),
        "Content-Type": "application/json",
        ...headers,
      },
      ...otherConfig,
      body: data ? JSON.stringify(data) : undefined,
    });

    if (!response.ok) {
      return {
        isOk: false,
        code: response.status,
        message: response.statusText,
      };
    }

    return reponseChecker(response);
  } catch (error) {
    console.error("Error in getRequest:", error);
    return {
      isOk: false,
      code: 500,
      message: "Internal Server Error",
    };
  }
};

const postFormDataRequest = async <T>(
  url: string,
  data?: FormData,
  token?: string,
  config?: ResponseInit & {
    baseUrl?: string;
  }
): Promise<CustomResponse<T>> => {
  try {
    const { headers, ...otherConfig } = config || {};
    const response = await fetch(`${config?.baseUrl || API_URL}${url}`, {
      method: "POST",
      headers: {
        ...getAuthHeaders(token),
        ...headers,
      },
      ...otherConfig,
      body: data,
    });

    if (!response.ok) {
      return {
        isOk: false,
        code: response.status,
        message: response.statusText,
      };
    }

    return reponseChecker(response);
  } catch (error) {
    console.error("Error in getRequest:", error);
    return {
      isOk: false,
      code: 500,
      message: "Internal Server Error",
    };
  }
};

export function getAuthHeaders(token?: string): Record<string, string> {
  const headers: Record<string, string> = {};
  let currentToken = token;

  if (!currentToken && typeof document !== "undefined") {
    const name = TOKEN_KEY + "=";
    const decodedCookie = decodeURIComponent(document.cookie);
    const ca = decodedCookie.split(";");
    for (let i = 0; i < ca.length; i++) {
      let c = ca[i];
      while (c.charAt(0) === " ") {
        c = c.substring(1);
      }
      if (c.indexOf(name) === 0) {
        currentToken = c.substring(name.length, c.length);
      }
    }
  }

  if (currentToken) {
    headers.Authorization = `Bearer ${currentToken}`;
  }
  return headers;
}

export const httpRequest = {
  post: postRequest,
  postFormData: postFormDataRequest,
  get: getRequest,
};

"use client";

import { BASE_URL } from "./config";
import { CustomResponse } from "./types/global.types";

const API_URL = BASE_URL;

const reponseChecker = async (response: Response) => {
  const data = await response.json();

  if (data.code === 401) {
    // localStorage.removeItem(TOKEN_KEY);
    console.log("401");
  }
  return data;
};

const getRequest = async <T>(
  url: string,
  token?: string,
  config?: ResponseInit
): Promise<CustomResponse<T>> => {
  try {
    const { headers, ...otherConfig } = config || {};

    const response = await fetch(`${API_URL}/api${url}`, {
      method: "GET",
      headers: {
        ...getAuthHeaders(token),
        "Content-Type": "application/json",
        ...headers,
      },
      ...otherConfig,
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return reponseChecker(response);
  } catch (error) {
    console.error("Error in getRequest:", error);
    throw error;
  }
};

const postRequest = async <T>(
  url: string,
  data?: any,
  token?: string,
  config?: ResponseInit
): Promise<CustomResponse<T>> => {
  try {
    const { headers, ...otherConfig } = config || {};
    const response = await fetch(`${API_URL}/api${url}`, {
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
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return reponseChecker(response);
  } catch (error) {
    console.error("Error in getRequest:", error);
    throw error;
  }
};

const postFormDataRequest = async <T>(
  url: string,
  data?: FormData,
  token?: string,
  config?: ResponseInit
): Promise<CustomResponse<T>> => {
  try {
    const { headers, ...otherConfig } = config || {};
    const response = await fetch(`${API_URL}/api${url}`, {
      method: "POST",
      headers: {
        ...getAuthHeaders(token),
        ...headers,
      },
      ...otherConfig,
      body: data,
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return reponseChecker(response);
  } catch (error) {
    console.error("Error in getRequest:", error);
    throw error;
  }
};

export function getAuthHeaders(token?: string): Record<string, string> {
  return {
    Authorization: token ? `Bearer ${token}` : "",
  };
}

export const httpRequest = {
  post: postRequest,
  postFormData: postFormDataRequest,
  get: getRequest,
};

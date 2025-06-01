'use client';

import { CustomResponse } from './types/global.types';

const API_URL = '/custom-api';
export const TOKEN_KEY = 'atok';

const reponseChecker = async (response: Response) => {
  const data = await response.json();

  if (data.code === 401) {
    localStorage.removeItem(TOKEN_KEY);
  }
  return data;
};

const getRequest = async <T>(
  url: string,
  config?: ResponseInit
): Promise<CustomResponse<T>> => {
  try {
    const { headers, ...otherConfig } = config || {};

    const response = await fetch(`${API_URL}/${url}`, {
      method: 'GET',
      headers: {
        ...getAuthHeaders(),
        'Content-Type': 'application/json',
        ...headers,
      },
      ...otherConfig,
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return reponseChecker(response);
  } catch (error) {
    console.error('Error in getRequest:', error);
    throw error;
  }
};

const postRequest = async <T>(
  url: string,
  data?: any,
  config?: ResponseInit
): Promise<CustomResponse<T>> => {
  try {
    const { headers, ...otherConfig } = config || {};
    const response = await fetch(`${API_URL}/${url}`, {
      method: 'POST',
      headers: {
        ...getAuthHeaders(),
        'Content-Type': 'application/json',
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
    console.error('Error in getRequest:', error);
    throw error;
  }
};

export function getAuthHeaders(): Record<string, string> {
  const token = getToken();
  return {
    Authorization: token ? `Bearer ${token}` : '',
  };
}

export function getToken(): string | null {
  if (typeof window === 'undefined') {
    return null;
  }

  return localStorage.getItem(TOKEN_KEY);
}

export const httpRequest = {
  post: postRequest,
  get: getRequest,
};

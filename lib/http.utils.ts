'use server';
import { cookies } from 'next/headers';
import { CustomResponse } from './types/global.types';

export const reponseChecker = async (response: Response) => {
  const data = await response.json();

  if (data.code === 401) {
    const cookie = await cookies();
    cookie.delete('accessToken');
  }
  return data;
};

export const getRequest = async <T>(
  url: string,
  config?: ResponseInit
): Promise<CustomResponse<T>> => {
  try {
    const { headers, ...otherConfig } = config || {};
    const cookie = await cookies();
    const token = cookie.get('accessToken')?.value;

    let authHeaders = {};
    if (token) {
      authHeaders = {
        Authorization: `Bearer ${token}`,
      };
    }
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        ...headers,
        ...authHeaders,
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

export const postRequest = async <T>(
  url: string,
  data?: any,
  config?: ResponseInit
): Promise<CustomResponse<T>> => {
  try {
    const { headers, ...otherConfig } = config || {};
    const response = await fetch(url, {
      method: 'POST',
      headers: {
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

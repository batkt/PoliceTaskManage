import { CustomResponse } from '@/lib/types/global.types';
import { getAuthHeaders, reponseChecker } from './util';

export const postRequest = async <T>(
  url: string,
  data?: any,
  config?: RequestInit
): Promise<CustomResponse<T>> => {
  try {
    const { headers, ...otherConfig } = config || {};
    const authHeaders = await getAuthHeaders();

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...headers,
        ...authHeaders,
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

const getRequest = async <T>(
  url: string,
  config?: ResponseInit
): Promise<CustomResponse<T>> => {
  try {
    const { headers, ...otherConfig } = config || {};

    const authHeaders = await getAuthHeaders();
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

export const ssrClient = {
  get: getRequest,
  post: postRequest,
};

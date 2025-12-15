import { CustomResponse } from '@/lib/types/global.types';
import { getAuthHeaders, reponseChecker } from './util';

export const postRequest = async <T>(
  url: string,
  data?: any,
  token?: string,
  config?: RequestInit
): Promise<CustomResponse<T>> => {
  try {
    const { headers, ...otherConfig } = config || {};
    const authHeaders = await getAuthHeaders(token);

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
      return {
        isOk: false,
        code: response.status,
        message: response.statusText,
      };
    }

    return reponseChecker(response);
  } catch (error) {
    console.error('Error in getRequest:', error);
    return {
      isOk: false,
      code: 500,
      message: 'Internal Server Error',
    };
  }
};

const getRequest = async <T>(
  url: string,
  token?: string,
  config?: ResponseInit
): Promise<CustomResponse<T>> => {
  try {
    const { headers, ...otherConfig } = config || {};

    const authHeaders = await getAuthHeaders(token);
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
      return {
        isOk: false,
        code: response.status,
        message: response.statusText,
      };
    }

    return reponseChecker(response);
  } catch (error) {
    console.error('Error in getRequest:', error);
    return {
      isOk: false,
      code: 500,
      message: 'Internal Server Error',
    };
  }
};

export const ssrClient = {
  get: getRequest,
  post: postRequest,
};

import { useCallback } from 'react';

export type Fetch<T> = (url: RequestInfo, options?: RequestInit) => Promise<T>;

export const HTTP = {
  METHODS: {
    POST: 'POST',
    PUT: 'PUT',
    DELETE: 'DELETE',
  },
  HEADERS: {
    CONTENT_TYPE: 'Content-Type',
    APPLICATION_JSON: 'application/json',
  },
} as const;

const defaultOptions: RequestInit = {
  headers: [[HTTP.HEADERS.CONTENT_TYPE, HTTP.HEADERS.APPLICATION_JSON]],
};

export function useFetch() {
  return useCallback(async (url: RequestInfo, options: RequestInit = {}) => {
    try {
      const response = await fetch(url, { ...defaultOptions, ...options });
      if (!response.ok) {
        throw new Error(useFetch.UNAUTHORIZED);
      }

      return await response.json();
    } catch (e) {
      console.error(e);
    }
  }, []);
}

useFetch.UNAUTHORIZED = 'Unauthorized';

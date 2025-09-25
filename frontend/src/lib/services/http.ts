import axios from 'axios';

export const httpClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3000',
  withCredentials: true,
});

httpClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const normalizedError =
      error instanceof Error
        ? error
        : new Error('Unexpected HTTP error', { cause: error });
    return Promise.reject(normalizedError);
  },
);

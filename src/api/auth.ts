import { apiClient, USE_MOCK_DB } from './client';
import { UserRole } from '../types';

export const loginUserWP = async (email: string, password: string):Promise<{token: string, user_email: string, user_display_name: string}> => {
  if (USE_MOCK_DB) {
    throw new Error('Using mock DB');
  }
  // This endpoint requires the JWT Authentication for WP-API plugin
  return apiClient('/jwt-auth/v1/token', {
    method: 'POST',
    body: JSON.stringify({ username: email, password }),
  });
};

export const registerUserWP = async (data: { email: string, password: string, name: string, role: UserRole, phone: string, businessName?: string }) => {
  if (USE_MOCK_DB) {
    throw new Error('Using mock DB');
  }
  // This calls the standard WordPress REST API user creation endpoint
  // Note: By default WP doesn't allow unauthenticated user creation via REST, 
  // you will need a custom endpoint or a plugin to allow public registration.
  return apiClient('/wp/v2/users', {
    method: 'POST',
    body: JSON.stringify({
      username: data.email,
      email: data.email,
      password: data.password,
      name: data.name,
      roles: [data.role],
      // Store extra info like phone in ACF meta fields
      meta: {
        phone: data.phone,
        business_name: data.businessName,
      }
    }),
  });
};

export const validateTokenWP = async () => {
  if (USE_MOCK_DB) {
    throw new Error('Using mock DB');
  }
  return apiClient('/jwt-auth/v1/token/validate', {
    method: 'POST',
  });
};

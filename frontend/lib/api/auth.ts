import { apiRequest, ApiResponse } from '../request';

export type AuthParams = { email: string; password: string };
export type AuthData = { token: string };

export async function login(
  params: AuthParams,
): Promise<ApiResponse<AuthData>> {
  return apiRequest<AuthData>('/auth/login', {
    method: 'POST',
    body: JSON.stringify(params),
  });
}

export async function signup(
  params: AuthParams,
): Promise<ApiResponse<AuthData>> {
  return apiRequest<AuthData>('/auth/signup', {
    method: 'POST',
    body: JSON.stringify(params),
  });
}

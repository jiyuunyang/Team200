import { apiRequest, ApiResponse } from '../request';

export type LoginParams = { email: string; password: string };
export type LoginData = { token: string };

export type SignupParams = { name: string } & LoginParams;
export type SignupData = { userId: string };

export async function login(
  params: LoginParams,
): Promise<ApiResponse<LoginData>> {
  return apiRequest<LoginData>('/auth/login', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(params),
  });
}

export async function signup(
  params: SignupParams,
): Promise<ApiResponse<SignupData>> {
  return apiRequest<SignupData>('/auth/signup', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(params),
  });
}

export type MeData = { email: string; user_id: string };

export async function getMe(token: string): Promise<ApiResponse<MeData>> {
  return apiRequest<MeData>('/auth/me', {
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  });
}

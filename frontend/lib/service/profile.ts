// lib/api/profile.ts
import { apiRequest, ApiResponse } from '../request';

export type ProfileData = { email: string; name: string; createdAt: string };

export async function getProfile(
  token: string,
): Promise<ApiResponse<ProfileData>> {
  return apiRequest<ProfileData>('/profile', {
    headers: { Authorization: `Bearer ${token}` },
  });
}

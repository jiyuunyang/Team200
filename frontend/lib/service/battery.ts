import { apiRequest, ApiResponse } from '../request';

export type BatteryFormData = FormData;

//TODO: 배터리 이름, 마지막 측정일, RUL 데이터로 변경 필요
export type BatteryData = {
  id: number;
  battery_name: string;
  has_data: boolean;
};

export async function addBattery(
  // 실제로 formData를 받아야하지만 현재는 params로 대체
  // formData: BatteryFormData,
  params: { battery_name: string | null },
  token: string | undefined,
): Promise<ApiResponse<BatteryData>> {
  return apiRequest<BatteryData>('/batteries', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(params),
    // body: formData,
  });
}

export async function getBattery(
  token: string,
): Promise<ApiResponse<BatteryData[]>> {
  return apiRequest<BatteryData[]>('/batteries', {
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  });
}

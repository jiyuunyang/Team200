import { NextResponse } from 'next/server';
import { addBattery } from '@/lib/service/battery';
import { cookies } from 'next/headers';

export async function POST(req: Request) {
  const token = (await cookies()).get('accessToken')?.value;
  const formData = await req.formData();

  // const result = await addBattery(formData, token);
  // 실제로는 formData를 보내야하지만 구현 상태로 인해 배터리 이름만 추출
  // 임시로 battery_name만 params로 보내는 상태
  const batteryName = formData.get('battery_name');
  const params = {
    battery_name: typeof batteryName === 'string' ? batteryName : null,
  };
  const result = await addBattery(params, token);
  return NextResponse.json(result, { status: result.success ? 200 : 400 });
}

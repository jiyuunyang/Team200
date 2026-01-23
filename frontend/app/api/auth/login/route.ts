import { NextRequest, NextResponse } from 'next/server';
import { login as loginServer } from '@/lib/api/auth';

export async function POST(req: NextRequest) {
  const { email, password } = await req.json();
  const result = await loginServer({ email, password });

  const accessToken = (result?.data as { access_token?: string })?.access_token;

  if (!accessToken) {
    return NextResponse.json(
      { success: false, message: result.message || '로그인 실패' },
      { status: 401 },
    );
  }

  const response = NextResponse.json({ success: true, message: '로그인 성공' });
  response.cookies.set('accessToken', accessToken, {
    httpOnly: true,
    path: '/',
    maxAge: 7 * 24 * 60 * 60, // 7일
    sameSite: 'strict',
    secure: true,
  });

  return response;
}

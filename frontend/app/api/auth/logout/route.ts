import { NextResponse } from 'next/server';

export async function POST() {
  const response = NextResponse.json({
    success: true,
    message: '로그아웃 완료',
  });

  // HttpOnly 쿠키 삭제
  response.cookies.set('accessToken', '', {
    httpOnly: true,
    path: '/',
    expires: new Date(0), // 과거 날짜로 만료
    sameSite: 'strict',
    secure: true,
  });

  return response;
}

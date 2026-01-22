import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

export default async function RootPage() {
  const cookieStore = cookies();
  const token = (await cookieStore).get('accessToken')?.value;

  if (token) {
    redirect('/dashboard');
  }

  redirect('/login');
}

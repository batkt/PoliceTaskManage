import { decode } from 'jsonwebtoken';
import { BACKEND_URL } from '@/lib/config';
import { NextResponse } from 'next/server';
import { ssrClient } from '@/ssr/client';

export async function POST(request: Request) {
  const body = await request.json();

  const res = await ssrClient.post<{
    accessToken: string;
  }>(`${BACKEND_URL}/api/auth/login`, body);

  if (res.code === 200) {
    const decoded = decode(res.data.accessToken) as { exp: number } | null;

    return NextResponse.json({
      code: res.code,
      data: {
        ...res.data,
        exp: decoded?.exp,
      },
    });
  }
  return NextResponse.json(res);
}

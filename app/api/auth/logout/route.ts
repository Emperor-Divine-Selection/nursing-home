import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'

export async function POST() {
  const cookieStore = await cookies()
  
  // 方法 1：尝试 delete
  cookieStore.delete({
    name: 'session_id',
    path: '/'
  })
  
  // 方法 2：同时用 set 覆盖（双重保险）
  cookieStore.set('session_id', '', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: 0,
    expires: new Date(0)
  })

  return NextResponse.json({ success: true })
}
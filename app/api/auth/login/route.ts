// app/api/auth/login/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { users, sessions } from '@/lib/schema'
import { eq } from 'drizzle-orm'
import bcrypt from 'bcryptjs'

export async function POST(req: NextRequest) {
  try {
    const { email, password } = await req.json()

    // 查找用户
    const user = await db.query.users.findFirst({
      where: eq(users.email, email)
    })

    if (!user) {
      return NextResponse.json(
        { error: '邮箱或密码错误' },
        { status: 401 }
      )
    }

    // 验证密码
    const valid = await bcrypt.compare(password, user.password)
    if (!valid) {
      return NextResponse.json(
        { error: '邮箱或密码错误' },
        { status: 401 }
      )
    }

    // 生成 session ID
    const sessionId = crypto.randomUUID()
    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString() // 7 天
    const createdAt = new Date().toISOString()

    // 存 sessions 表
    await db.insert(sessions).values({
      id: sessionId,
      userId: user.id,
      expiresAt,
      createdAt
    })

  // 设置 HTTP-only Cookie
    const response = NextResponse.json({
      user: {
        id: user.id,
        email: user.email,
        role: user.role
      }
    })

    response.cookies.set('session_id', sessionId, {
      httpOnly: true,
      secure: false,
      sameSite: 'lax',
      path: '/',
      maxAge: 7 * 24 * 60 * 60
    })

    return response
  } catch (error) {
    console.error('Login error:', error)
    return NextResponse.json(
      { error: '登录失败' },
      { status: 500 }
    )
  }
}
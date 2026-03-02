import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { users } from '@/lib/schema'
import bcrypt from 'bcryptjs'
import { eq } from 'drizzle-orm'

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json()

    // 验证必填字段
    if (!email || !password) {
      return NextResponse.json(
        { error: '邮箱和密码不能为空' },
        { status: 400 }
      )
    }

    // 验证邮箱格式
    const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: '邮箱格式不正确' },
        { status: 400 }
      )
    }

    // 验证密码长度
    if (password.length < 6) {
      return NextResponse.json(
        { error: '密码至少 6 位' },
        { status: 400 }
      )
    }

    // 检查邮箱是否已存在
    const existingUser = await db.query.users.findFirst({
      where: eq(users.email, email)
    })

    if (existingUser) {
      return NextResponse.json(
        { error: '该邮箱已被注册' },
        { status: 400 }
      )
    }

    // 密码加密
    const hashedPassword = await bcrypt.hash(password, 10)

    // 生成 ID（用 crypto.randomUUID）
    const userId = crypto.randomUUID()
    const now = new Date().toISOString()

    // 创建用户
    await db.insert(users).values({
      id: userId,
      email,
      password: hashedPassword,
      role: 'caregiver',
      createdAt: now,
      updatedAt: now,
    })

    return NextResponse.json({
      message: '注册成功',
      user: {
        id: userId,
        email,
        role: 'caregiver'
      }
    })

  } catch (error) {
    console.error('注册失败:', error)
    return NextResponse.json(
      { error: '服务器错误，请稍后重试' },
      { status: 500 }
    )
  }
}
'use server'

import { db } from "@/lib/db"
import { sessions, users } from "@/lib/schema"
import { eq } from "drizzle-orm"
import { redirect } from "next/navigation"
import { cookies } from "next/headers"


// 获取当前登录用户信息
export async function getCurrentUserSessionId() {
  try {
    const cookieStore = await cookies()
    const sessionId = cookieStore.get("session_id")?.value
    if (!sessionId || sessionId === null) {
      redirect("/")
    }else {
    return { success: true, data: sessionId }
    }
  }catch (error) {
    console.log(error)
    return { success: false, error: '获取会话失败' }
  }
}

//通过sessionId获取用户Id
export async function getUserIdBySessionId(sessionId: string | undefined) {
  
  try {
    // console.log('获取用户ID的SessionId:', sessionId);
    if (sessionId === undefined) {
      return { success: false, error: '会话不存在' }
    }
    const result = await db.select({ userId: sessions.userId })
                           .from(sessions)
                           .where(eq(sessions.id, sessionId))
                           .limit(1)         
    if (!result || result.length === 0) {
      return { success: false, error: '会话不存在123' }
    }
    return { success: true, data: result[0].userId }
  } catch (error) {
    console.error('获取用户信息失败:', error);
    return { success: false, error: '获取用户信息失败' }
  }
}


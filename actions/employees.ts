'use server'

import { users } from '@/lib/schema'
import { eq } from 'drizzle-orm'
import { db } from '@/lib/db'
import { success } from 'zod'

// 辅助函数：获取角色
export async function getUserRoleByUserId(userId: string | null) {
  try {
    if (!userId) {
      return { success: false, error: '用户ID不能为空' }
    }
    const user = await db
      .select({ role: users.role })
      .from(users)
      .where(eq(users.id, userId))
      .then(res => res[0])

    if (!user) {
      return { success: false, error: '用户不存在' }
    }
    return { success: true, data: { role: user.role } }
  } catch (error) {
    console.error('获取用户角色失败:', error)
    return { success: false, error: error instanceof Error ? error.message : String(error) }
  }
}

// 获取员工列表
export async function getEmployees() {
  try {
    const employeeList = await db.select().from(users)
    return { success: true, data: employeeList }
  } catch (error) {
    console.error('获取员工列表失败:', error)
    return { success: false, error: error instanceof Error ? error.message : String(error) }
  }
}

// 更新员工角色
export async function updateUserRole(
  authId: string,
  userId: string,
  newRole: 'admin' | 'department_head' | 'caregiver'
) {
  try {
    const auth = await getUserRoleByUserId(authId)
    if (!auth.success || auth.data?.role !== 'admin') {
      return { success: false, error: auth.error || '验证用户失败' }
    }

    const result = await db.update(users).set({ role: newRole }).where(eq(users.id, userId))
    if (result.changes === 0) {
      return { success: false, error: '用户不存在或更新失败' }
    }

    return { success: true, data: { message: '员工角色更新成功' } }
  } catch (error) {
    console.error('更新员工角色失败:', error)
    return { success: false, error: error instanceof Error ? error.message : String(error) }
  }
}

//更新员工信息
export async function updateUserInfo(formDare:FormData){

  try{
    const result = await db.update(users)
                           .set({role: formDare.get('role') as string,
                                 name: formDare.get('username') as string})
                           .where(eq(users.email, formDare.get('email') as string))
    if (result.changes === 0) {
      return { success: false, error: '用户不存在或更新失败' }
    }
    return { success: true, data: { message: '员工信息更新成功' } }                       
  }catch(error){
    console.log('更新员工信息失败:',error)
    return { success:false, error: error instanceof Error ? error.message : String(error)}
  }

}

// 删除员工
export async function deleteUser(authId: string, userId: string) {
  try {
    const auth = await getUserRoleByUserId(authId)
    if (!auth.success || auth.data?.role !== 'admin') {
      return { success: false, error: auth.error || '验证用户失败' }
    }

    const result = await db.delete(users).where(eq(users.id, userId))
    if (result.changes === 0) {
      return { success: false, error: '用户不存在或删除失败' }
    }

    return { success: true, data: { message: '员工删除成功' } }
  } catch (error) {
    console.error('删除员工失败:', error)
    return { success: false, error: error instanceof Error ? error.message : String(error) }
  }
}

// 找到用户
export async function getUserById(userId: string) {
  try {
    const user = await db.select().from(users).where(eq(users.id, userId))
    if (user.length === 0) {
      return { success: false, error: '用户不存在' }
    }
    return { success: true, data: user[0] }
  } catch (error) {
    console.error('搜索用户失败:', error)
    return { success: false, error: error instanceof Error ? error.message : String(error) }
  }
}

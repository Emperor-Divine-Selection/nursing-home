'use server'

import { users,healthRecords,careRecords } from '@/lib/schema'
import { eq } from 'drizzle-orm'
import { db } from '@/lib/db'
import { count } from 'drizzle-orm'

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
export async function getEmployeesList() {
  try {
    const employeeList = await db.select(
      {
        id: users.id,
        name: users.name,
        role: users.role,
        email: users.email,
        createdAt: users.createdAt,
        careRecordCount: count(careRecords.id).as('careRecordCount'),
        healthRecordCount: count(healthRecords.id).as('healthRecordCount'),
      }
    ).from(users)
     .leftJoin(healthRecords, eq(users.id, healthRecords.caregiverId))
     .leftJoin(careRecords, eq(users.id, careRecords.caregiverId))
     .groupBy(users.id)
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
export async function updateUserInfo(formDare:FormData,useId:string){

  try{
    const authCheck = await getUserRoleByUserId(useId)
    if (!authCheck.success || authCheck.data?.role !== 'admin') {
      return { success: false, error: authCheck.error || '用户无此权限' }
    }
    const result = await db.update(users)
                           .set({role: formDare.get('role') as string})
                           .where(eq(users.id, formDare.get('id') as string))
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
export async function deleteUser(userId: string,authId: string) {
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

//找到所有护工
export async function getAllCaregivers() {
  try {
    const caregivers = await db.select().from(users).where(eq(users.role, 'caregiver'))
    return { success: true, data: caregivers }
  } catch (error) {
    console.error('搜索所有护工失败:', error)
    return { success: false, error: error instanceof Error ? error.message : String(error) }
  }
}

'use server'

import { db } from "@/lib/db"
import { elders, beds, rooms } from "@/lib/schema"
import { eq } from "drizzle-orm"
import { revalidatePath } from "next/cache"

// 添加老人
export async function addElder(formData: FormData) {
  try {
    const values = {
      name: formData.get('name') as string,
      age: Number(formData.get('age')),
      gender: (formData.get('gender') as 'male' | 'female' | 'unknown') || 'unknown',
      roomId: formData.get('room') as string || null,
      bedId: (formData.get('bedId') as string) || null,
      phone: formData.get('phone') as string || null,
      emergencyContact: formData.get('emergencyContact') as string,
      medicalHistory: formData.get('medicalHistory') as string || null,
      status: 'active' as const,
      admittedAt: new Date().toISOString(),
    }

    // 如果选择了床位 → 占用床位
    if (values.bedId) {
      await db.update(beds)
        .set({ status: 'occupied' })
        .where(eq(beds.id, values.bedId))
    }

    await db.insert(elders).values(values)

    // 页面刷新
    revalidatePath('/dashboard/elders')
    revalidatePath('/dashboard/beds')

    return { success: true, message: '添加成功' }
  } catch (error) {
    console.error('添加失败:', error)
    return { success: false, error: '添加失败' }
  }
}

// 删除老人
export async function deleteElder(id: string) {
  try {
    await db.delete(elders).where(eq(elders.id, id))

    // 页面刷新
    revalidatePath('/dashboard/elders')
    revalidatePath('/dashboard/beds')

    return { success: true, message: '删除成功' }
  } catch (error) {
    console.error('删除失败:', error)
    return { success: false, error: '删除失败' }
  }
}

// 更新老人
export async function updateElder(
  id: string,
  data: {
    name?: string
    age?: number
    gender?: 'male' | 'female' | 'unknown'
    roomId?: string | null
    bedId?: string | null
    phone?: string | null
    emergencyContact?: string
    medicalHistory?: string | null
    status?: 'active' | 'discharged'
    dischargedAt?: string | null
  }
) {
  try {
    db.transaction((tx) => {
      // 当前老人
      const [currentElder] = tx
        .select()
        .from(elders)
        .where(eq(elders.id, id))
        .all()

      const updatedData = {
        ...data,
        updatedAt: new Date().toISOString(),
      }

      // 出院逻辑
      if (data.status === 'discharged' && !data.dischargedAt) {
        updatedData.dischargedAt = new Date().toISOString()
      } else if (data.status === 'active') {
        updatedData.dischargedAt = null
      }

      // 新床位 → 占用
      if (data.bedId) {
        tx.update(beds)
          .set({ status: 'occupied' })
          .where(eq(beds.id, data.bedId))
          .run()
      }

      // 原床位 → 释放
      if (currentElder?.bedId && currentElder.bedId !== data.bedId) {
        tx.update(beds)
          .set({ status: 'available' })
          .where(eq(beds.id, currentElder.bedId))
          .run()
      }

      // 更新老人
      tx.update(elders)
        .set(updatedData)
        .where(eq(elders.id, id))
        .run()
    })

    // 页面刷新
    revalidatePath('/dashboard/elders')
    revalidatePath('/dashboard/beds')

    return { success: true, message: '更新成功' }
  } catch (error) {
    console.error('更新失败:', error)
    return { success: false, error: '更新失败' }
  }
}

// 获取单个老人（无缓存）
export async function getElder(id: string) {
  try {
    const result = await db
      .select({
        id: elders.id,
        name: elders.name,
        age: elders.age,
        gender: elders.gender,
        phone: elders.phone,
        status: elders.status,
        room: rooms.roomNumber,
        bed: beds.bedNumber,
        admittedAt: elders.admittedAt,
        medicalHistory: elders.medicalHistory,
        emergencyContact: elders.emergencyContact,
        dischargedAt: elders.dischargedAt,
      })
      .from(elders)
      .leftJoin(beds, eq(elders.bedId, beds.id))
      .leftJoin(rooms, eq(beds.roomId, rooms.id))
      .where(eq(elders.id, id))

    const elder = result[0]

    if (!elder) return { success: false, error: '老人不存在' }
    return { success: true, data: elder }
  } catch (error) {
    console.error('查询失败:', error)
    return { success: false, error: '查询失败' }
  }
}

// 获取所有老人（无缓存）
export async function getAllElders() {
  try {
    const result = await db
      .select({
        id: elders.id,
        name: elders.name,
        age: elders.age,
        gender: elders.gender,
        phone: elders.phone,
        status: elders.status,
        roomNumber: rooms.roomNumber,
        bedNumber: beds.bedNumber,
        admittedAt: elders.admittedAt,
        medicalHistory: elders.medicalHistory,
        emergencyContact: elders.emergencyContact,
        dischargedAt: elders.dischargedAt,
      })
      .from(elders)
      .leftJoin(beds, eq(elders.bedId, beds.id))
      .leftJoin(rooms, eq(beds.roomId, rooms.id))
      .orderBy(elders.createdAt)

    return { success: true, data: result }
  } catch (error) {
    console.error('查询失败:', error)
    return { success: false, error: '查询失败' }
  }
}
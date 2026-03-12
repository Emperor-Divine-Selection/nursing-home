'use server'

import { db } from "@/lib/db"
import { beds, rooms,elders } from "@/lib/schema"
import { and, eq } from "drizzle-orm"
import { revalidatePath } from "next/cache"

// 获取所有床位
export async function getAllBeds() {
  try {
    const Beds = await db
      .select({
        id: beds.id,
        roomNumber: rooms.roomNumber,
        bedNumber: beds.bedNumber,
        status: beds.status,
        updatedAt: beds.updatedAt
      })
      .from(beds)
      .leftJoin(rooms, and(eq(beds.roomId, rooms.id)))

    if (!Beds) return { success: false, error: '床位不存在' }
    return { success: true, data: Beds }
  } catch (error) {
    console.error('查询失败:', error)
    return { success: false, error: '查询失败' }
  }
}

// 获取单个床位详情
export async function getBedById(id: string) {
  try {
    const bedList = await db.select().from(beds).where(eq(beds.id, id)).limit(1)
    const bed = bedList[0] || null

    if (!bed) return { success: false, error: '床位不存在' }
    return { success: true, data: bed }
  } catch (error) {
    console.error('查询失败:', error)
    return { success: false, error: '查询失败' }
  }
}

// 获取房间的床位
export async function getbedsByRoomId(id: string) {
  try {
    const bedList = await db.select().from(beds).where(eq(beds.roomId, id))

    if (!bedList) return { success: false, error: '床位不存在' }
    return { success: true, data: bedList }
  } catch (error) {
    console.error('查询失败:', error)
    return { success: false, error: '查询失败' }
  }
}

// 获取所有空床位
export async function getAvailableBeds() {
  try {
    const bedList = await db.select().from(beds).where(eq(beds.status, 'available'))
    return { success: true, data: bedList }
  } catch (error) {
    console.error('查询失败:', error)
    return { success: false, error: '查询失败' }
  }
}

// 添加床位
export async function addBed(data: {
  roomNumber: string
  bedNumber: string
  status: string
}) {
  try {
    db.transaction((tx) => {
      const roomsFound = tx
        .select({ id: rooms.id })
        .from(rooms)
        .where(eq(rooms.roomNumber, data.roomNumber))
        .limit(1)
        .get()

      if (roomsFound) {
        const roomId = roomsFound.id
        tx.insert(beds).values({
          roomId,
          bedNumber: data.bedNumber,
          status: (data.status ?? 'available') as
            | 'available'
            | 'occupied'
            | 'maintenance'
            | 'reserved'
        }).run()
      } else {
        const roomId = crypto.randomUUID()

        tx.insert(rooms).values({
          id: roomId,
          roomNumber: data.roomNumber
        }).run()

        tx.insert(beds).values({
          roomId,
          bedNumber: data.bedNumber,
          status: (data.status ?? 'available') as
            | 'available'
            | 'occupied'
            | 'maintenance'
            | 'reserved'
        }).run()
      }
    })

    // 页面刷新
    revalidatePath('/dashboard/beds')

    return { success: true, message: '添加成功' }
  } catch (error) {
    console.error('添加失败:', error)
    return { success: false, error: '添加失败' }
  }
}

// 更新床位
export async function updateBed(
  id: string,
  data: {
    roomId?: string
    bedNumber?: string
    status?: 'available' | 'occupied' | 'maintenance' | 'reserved'
    updatedAt?: string
  }
) {
  try {
    await db
      .update(beds)
      .set({
        ...data,
        updatedAt: new Date().toISOString()
      })
      .where(eq(beds.id, id))

    return { success: true, message: '更新成功' }
  } catch (error) {
    console.error('更新失败:', error)
    return { success: false, error: '更新失败' }
  }
}

// 删除床位
export async function deleteBed(id: string) {
  try {
    await db.delete(beds).where(eq(beds.id, id))

    // 保留页面刷新
    revalidatePath('/dashboard/beds')

    return { success: true, message: '删除成功' }
  } catch (error) {
    console.error('删除失败:', error)
    return { success: false, error: '删除失败' }
  }
}

//修改床位状态或房号
export async function updateBedStatusOrRoom(formData: FormData,bedId: string) {
    try {
      //
      const roomId = formData.get('roomId') as string;
      const bedStatus = formData.get('bedStatus') as 'available' | 'occupied' | 'maintenance' | 'reserved';
      const elderOccupied = await db.select().from(elders).leftJoin(beds, eq(elders.bedId, beds.id)).where(and(eq(elders.bedId, bedId), eq(beds.status, 'occupied')))
      //如果已经有老人占用，就不能修改状态为占用以外的状态
      if (elderOccupied.length > 0) {
        return { success: false, error: '该床位已经被老人占用' }
      }
      if (roomId && bedStatus) {
        await db.update(beds).set({
          roomId,
          status: bedStatus,
          updatedAt: new Date().toISOString()
        }).where(eq(beds.id, bedId))
      }
      
      revalidatePath('/dashboard/beds')
      return { success: true, message: '更新成功' }
    } catch (error) {
      console.error('更新失败:', error)
      return { success: false, error: '更新失败' }
    }
  }
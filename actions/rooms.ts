'use server'

import { db } from "@/lib/db"
import { beds, rooms, elders } from "@/lib/schema"
import { eq, and } from "drizzle-orm"
import { revalidatePath } from "next/cache"

// 获取所有房间 - 无缓存
export async function getAllRooms() {
  try {
    const allRoom = await db.select().from(rooms).orderBy(rooms.roomNumber)
    return { success: true, data: allRoom }
  } catch (error) {
    console.error('查询失败:', error)
    return { success: false, error: '查询失败' }
  }
}

// 获取房间内可用床位
export async function getAvailableBedsInRoom(roomId: string) {
  console.log('获取房间内可用床位参数:', roomId)
  try {
    const availableBedInRoom = await db
      .select({
        id: beds.id,
        bedNumber: beds.bedNumber
      })
      .from(rooms)
      .innerJoin(beds, eq(beds.roomId, rooms.id))
      .where(and(eq(rooms.id, roomId), eq(beds.status, 'available')))
    return { success: true, data: availableBedInRoom }
  } catch (error) {
    console.error('查询失败:', error)
    return { success: false, error: '查询失败' }
  }
}

// 通过 elderId 获取房号
export async function getRoomNumberByElderId(id: string) {
  try {
    const roomNumber = await db
      .select({
        roomNumber: rooms.roomNumber
      })
      .from(rooms)
      .innerJoin(elders, eq(rooms.id, elders.roomId))
      .where(eq(elders.id, id))

    return { success: true, data: roomNumber }
  } catch (error) {
    console.error('查询失败:', error)
    return { success: false, error: '查询失败' }
  }
}

// 删除房间或床位 - 保留 revalidatePath
export async function deleteRoomOrBed(roomId: string, bedId: string | null) {
  try {
    console.log('删除参数:', roomId, bedId)

    if (bedId) {
      await db.delete(beds).where(eq(beds.id, bedId))

      // 保留页面刷新
      revalidatePath('/dashboard/rooms')
      revalidatePath('/dashboard/beds')

      return { success: true, message: '床位删除成功' }
    } else {
      await db.delete(rooms).where(eq(rooms.id, roomId))

      // 保留页面刷新
      revalidatePath('/dashboard/rooms')
      revalidatePath('/dashboard/beds')

      return { success: true, message: '房间删除成功' }
    }
  } catch (error) {
    console.error('删除失败:', error)
    return { success: false, error: '删除失败' }
  }
}
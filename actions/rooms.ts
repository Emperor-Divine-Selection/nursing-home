'use server'

import { db } from "@/lib/db"
import { beds,rooms } from "@/lib/schema"
import { eq,and } from "drizzle-orm"
import { unstable_cache } from "next/cache"

//获取所有房间
export const getAllRooms = unstable_cache(async () => { 

  try{
      const allRoom = await db.select().from(rooms).orderBy(rooms.roomNumber)
      return { success: true, data: allRoom }
    } catch(error){ 
      console.error('查询失败:', error);
      return { success: false, error: '查询失败' };
  }
 },['rooms'],
   { revalidate: 60 * 60 * 24 }
)

//从房间中获取可用床位
export async function getAvailableBedsInRoom(roomNumber: string) { 
  
  try {
    const availableBedInRoom = await db.select().from(rooms).innerJoin(beds, eq(beds.roomId, rooms.id))
      .where(and(
        eq(rooms.roomNumber, roomNumber),
        eq(beds.status, 'available')
      ));          

    return { success: true, data: availableBedInRoom.map(item => item.beds) }
  }catch(error){ 
    console.error('查询失败:', error);
    return { success: false, error: '查询失败' };
  }

}
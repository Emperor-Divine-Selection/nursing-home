'use server'

import { db } from "@/lib/db"
import { beds } from "@/lib/schema"
import { eq,and } from "drizzle-orm"
import { unstable_cache } from "next/cache"

//获取所有房间
export const getAllRooms = unstable_cache(async () => { 

  try{
      const rooms = await db.select().from(beds).orderBy(beds.roomNumber)
      return { success: true, data: rooms }
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
    const availableBeds = await db.select().from(beds)
                .where(and(eq(beds.roomNumber, roomNumber),eq(beds.status, 'available')))
    return { success: true, data: availableBeds }
  }catch(error){ 
    console.error('查询失败:', error);
    return { success: false, error: '查询失败' };
  }

}
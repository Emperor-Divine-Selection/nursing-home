'use server'

import { db } from "@/lib/db"
import { beds,rooms,elders } from "@/lib/schema"
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
  
    const availableBedInRoom = await db.select(
      { 
        id: beds.id,
        bedNumber: beds.bedNumber 
      }
    ).from(rooms).innerJoin(beds, eq(beds.roomId, rooms.id))
      .where(and(
        eq(rooms.roomNumber, roomNumber),
        eq(beds.status, 'available')
      ));          
    return { success: true, data: availableBedInRoom }
  
  }catch(error){ 
    console.error('查询失败:', error);
    return { success: false, error: '查询失败' };
  
  }

}

//通过elderId获取房号
export async function getRoomNumberByElderId(id: string) { 
  
  try{

    const roomNumber = await db.select({
      roomNumber: rooms.roomNumber
    }).from(rooms).innerJoin(elders, eq(rooms.id, elders.roomId)).where(eq(elders.id, id))
    return {success:true,data:roomNumber}

  }catch(error){ 
    
    console.error('查询失败:', error);
    return { success: false, error: '查询失败' };
  
  }

}
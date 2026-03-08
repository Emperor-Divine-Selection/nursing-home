'use server'

import { db } from "@/lib/db"
import { beds } from "@/lib/schema"
import { eq } from "drizzle-orm"
import { revalidateTag, unstable_cache } from "next/cache"

//获取所有床位
export const getAllBeds = unstable_cache( async () => {
   
  try{
      const Beds = await db.select().from(beds)
      return { success: true, data: Beds }
    } catch(error){ 
      console.error('查询失败:', error);
      return { success: false, error: '查询失败' };
    }

 },
  ['beds'],
  {revalidate:60}
)
//获取单个床位详情
export const getBedById = unstable_cache(async(id: string ) => {

  try{
      const bedList = (await db.select().from(beds).where(eq(beds.id, id)).limit(1))
      const bed = bedList[0] || null
      if(!bed) return { success: false, error: '床位不存在' };
    return { success: true, data: bed };
  } catch(error){ 
      console.error('查询失败:', error);
      return { success: false, error: '查询失败' };
    }
  },
    ['bed']

)

export const bedByUUID = async (uuid: string) => { 
  try{
    const bedList = await db.select().from(beds).where(eq(beds.id, uuid))
    if(!bedList) return { success: false, error: '床位不存在' };
    return { success: true, data: bedList };
  } catch(error){ 
    console.error('查询失败:', error);
    return { success: false, error: '查询失败' };
  }
}

//选空床位
export async function getAvailableBeds(){

  try{
    const bedList = await db.select().from(beds).where(eq(beds.status, 'available'))
    return { success: true, data: bedList };
  }catch(error){ 
    console.error('查询失败:', error);
    return { success: false, error: '查询失败' };
  }

}

//添加床位
export async function addBed(data: {
  roomNumber: string
  bedNumber: string
  type: string
  status?: string  // 可选，默认 'available'
}) {
  try {
    await db.insert(beds).values({
      id: crypto.randomUUID(),
      roomNumber: data.roomNumber,
      bedNumber: data.bedNumber,
      type: data.type,
      status: data.status || 'available',  // 默认值
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    })
    
    revalidateTag('beds','default')  // 重要：清除缓存
    return { success: true, message: '添加成功' }
  } catch (error) {
    console.error('添加失败:', error)
    return { success: false, error: '添加失败' }
  }
}

// 2. 同时保留旧的 FormData 版本（兼容性）
export async function addBedViaForm(formData: FormData) {
  const data = {
    roomNumber: formData.get('roomNumber') as string,
    bedNumber: formData.get('bedNumber') as string,
    type: formData.get('type') as string,
    status: formData.get('status') as string
  }
  return addBed(data)
}

//更新床位
export async function updateBed(id: string, data: {
  roomNumber?: string;
  bedNumber?: string;
  type?: string;
  status?: string;
  updatedAt?: string;
}) { 
  try{
    await db.update(beds)
    .set({ ...data, updatedAt: new Date().toISOString() })
    .where(eq(beds.id, id))
    return { success: true, message: '更新成功' };
  }catch(error){ 
    console.error('更新失败:', error);
    return { success: false, error: '更新失败' };
  }

}

//删除床位
export async function deleteBed(id: string) { 
  
  try{
    await db.delete(beds).where(eq(beds.id, id))
    revalidateTag('bed','default')
    revalidateTag('beds','default')
    return { success: true, message: '删除成功' };
  }catch(error){
    console.error('删除失败:', error);
    return { success: false, error: '删除失败' };
  }

}


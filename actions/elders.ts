'use server'

import { db } from "@/lib/db"
import { elders } from "@/lib/schema"
import { eq } from "drizzle-orm"


// 添加老人
export async function addElder(formData: FormData) { 

  try{
    await db.insert(elders).values({
    id: crypto.randomUUID(),
    name: formData.get('name') as string,  // ✅ 断言为 string
    age: Number(formData.get('age')),      // ✅ 转 number
    gender: (formData.get('gender') as string) || 'unknown',  // ✅ 默认值
    room: formData.get('room') as string,  // ✅ 断言
    bedId: formData.get('bedId') as string || null,  // ✅ 可 null
    phone: formData.get('phone') as string || null,  // ✅ 可 null
    emergencyContact: formData.get('emergencyContact') as string,  // ✅ 断言
    medicalHistory: formData.get('medicalHistory') as string || null,  // ✅ 可 null
    status: 'active',
    admittedAt: new Date().toISOString(),  // ✅ 转 string
    dischargedAt: null,  // ✅ 明确 null
    createdAt: new Date().toISOString(),   // ✅ 转 string
    updatedAt: new Date().toISOString(),   // ✅ 转 string
  })
    return {success: true,message: '添加成功'}
  }catch (error) {
    console.error('添加失败:', error);
    return { success: false, error: '添加失败' };
  }

}
  

// 删除老人
export async function deleteElder(id: string) { 

  try {
    await db.delete(elders).where(eq(elders.id, id));
    return { success: true,message:'删除成功' };
  } catch (error) {
    console.error('删除失败:', error);
    return { success: false, error: '删除失败' };
  }

}

// 更新老人
export async function updateElder(id: string, data: {
  name?: string;
  age?: number;
  gender?: string;
  room?: string;
  bedId?: string;
  phone?: string;
  emergencyContact?: string;
  medicalHistory?: string;
  status?: string;
  dischargedAt?: string;
}){

  // 只更新传入的字段
 try{
  await db.update(elders)
    .set({ ...data, updatedAt: new Date().toISOString() })
    .where(eq(elders.id, id));
    return { success: true,message:'更新成功' };
  }catch(error){
    console.error('更新失败:', error);
    return { success: false, error: '更新失败' };
  }

}

// 查询老人
export async function getElder(id: string) {
  
  try {
    const result = await db.select().from(elders).where(eq(elders.id, id));
    const elder = result[0];
    
    if (!elder) {
      return { success: false, error: '老人不存在' };
    }
    
    return { success: true, data: elder };
  } catch (error) {
    console.error('查询失败:', error);
    return { success: false, error: '查询失败' };
  }

}

// 查询所有老人
export async function getAllElders() { 

  try {
    const result = await db.select().from(elders);
    return { success: true, data: result };
  } catch (error) {
    console.error('查询失败:', error);
    return { success: false, error: '查询失败' };
  }

}
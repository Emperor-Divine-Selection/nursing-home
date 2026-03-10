'use server'

import { db } from "@/lib/db"
import { elders, beds } from "@/lib/schema"
import { and, eq } from "drizzle-orm"

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
    } as const;  // 加上 as const

    await db.insert(elders).values(values);

    return { success: true, message: '添加成功' };
  } catch (error) {
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
export async function updateElder(
  id: string, 
  data: {
    name?: string;
    age?: number;
    gender?: 'male' | 'female' | 'unknown';
    roomId?: string | null;  
    bedId?: string | null;   
    phone?: string | null;   
    emergencyContact?: string;
    medicalHistory?: string | null;  
    status?: 'active' | 'discharged';  
    dischargedAt?: string | null;      
    updatedAt?: string;
  }
){
  
  try {
    await db.update(elders)
      .set({...data,updatedAt: new Date().toISOString()  }).where(eq(elders.id, id));
    return { success: true, message: '更新成功' };
  } catch (error) {
    console.error('更新失败:', error);
    return { success: false, error: '更新失败' };
  }

}

// 查询老人
export async function getElder(id: string) {
  
  try {
    const result = await db.select({
        id: elders.id,
        name: elders.name,
        age: elders.age,
        gender: elders.gender,
        phone: elders.phone,
        status: elders.status,
        room: beds.bedNumber,
        bed: beds.bedNumber,
        admittedAt: elders.admittedAt,
        medicalHistory: elders.medicalHistory,
        emergencyContact: elders.emergencyContact,
        dischargedAt: elders.dischargedAt

      }).from(elders).leftJoin(beds, and(eq(elders.bedId, beds.id))).where(eq(elders.id, id));
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
    const result = await db.select({
        id: elders.id,
        name: elders.name,
        age: elders.age,
        gender: elders.gender,
        phone: elders.phone,
        status: elders.status,
        room: beds.bedNumber,
        bed: beds.bedNumber,
        admittedAt: elders.admittedAt,
        dischargedAt: elders.dischargedAt
      }).from(elders).leftJoin(beds, and(eq(elders.bedId, beds.id)));
    return { success: true, data: result };
  } catch (error) {
    console.error('查询失败:', error);
    return { success: false, error: '查询失败' };
  }

}
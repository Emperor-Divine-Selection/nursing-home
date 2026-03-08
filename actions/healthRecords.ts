'use server'

import { healthRecords } from "@/lib/schema"
import { db } from "@/lib/db"
import { eq } from "drizzle-orm"

interface ActionResult {
  success: boolean;
  message?: string;
  error?: string;
}

//创建健康记录
export async function createHealthRecord(formData: FormData): Promise<ActionResult> { 

  try{
    await db.insert(healthRecords).values({
      id: crypto.randomUUID(),
      elderId: formData.get('elderId') as string,
      caregiverId: formData.get('caregiverId') as string,
      bloodPressure: formData.get('bloodPressure') as string || null,
      bloodSugar: formData.get('bloodSugar') ? Number(formData.get('bloodSugar')) : null,
      heartRate: formData.get('heartRate') ? Number(formData.get('heartRate')) : null,
      temperature: formData.get('temperature') ? Number(formData.get('temperature')) : null,
      weight: formData.get('weight') ? Number(formData.get('weight')) : null,
      notes: formData.get('notes') as string || null,
      alert: Number(formData.get('alert')) ?? 0,
      createdAt: new Date().toISOString(),
    })
    return { success: true, message: '添加成功' };
  }catch(error){ 
    console.error('添加失败:', error);
    return { success: false, error: '添加失败' };
  }

}

//获取某个老人健康记录
export async function getHealthRecordsByElder(elderId: string) { 

  try{
    const result = await db.select().from(healthRecords).where(eq(healthRecords.elderId, elderId))
    return { success: true, data: result };
  }catch(error){ 
    console.error('查询失败:', error);
    return { success: false, error: '查询失败' };
  }
}

//获取今日待处理健康记录
export async function getAlertRecords(){
  
  try{
    const result = await db.select().from(healthRecords)
      .where(eq(healthRecords.alert, 1))
    return { success: true, data: result };
  }catch(error){ 
    console.error('查询失败:', error);
    return { success: false, error: '查询失败' };
  }

}
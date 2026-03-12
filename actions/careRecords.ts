'use server'

import { careRecords } from "@/lib/schema";
import { db } from "@/lib/db";
import { and, desc, eq, gte, lte } from "drizzle-orm";

interface ActionResult {
  success: boolean;
  message?: string;
  error?: string;
}

// 创建护理记录
export async function createCareRecord(formatData: FormData): Promise<ActionResult> {
 
  try { 
    await db.insert(careRecords).values({
      id: crypto.randomUUID(),
      content: formatData.get('content') as string,
      type: formatData.get('type') as string || 'normal',
      status: 'pending',
      scheduledAt: formatData.get('scheduledAt') as string || null,
      completedAt: formatData.get('completedAt') as string || null,
      notes: formatData.get('notes') as string || '',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      elderId: formatData.get('elderId') as string,
      caregiverId: formatData.get('caregiverId') as string
  })
    return { success: true, message: '创建成功' };
  } catch (error) { 
    console.error('创建失败:', error);
    return { success: false, error: '创建失败' };
  } 

}

//查询列表(按老人 ID 查询所有护理记录)
export async function getCareRecordsByElder(elderId: string){

  try {
    const records = await db.select().from(careRecords)
        .where(eq(careRecords.elderId, elderId)).orderBy(desc(careRecords.createdAt))
    return { success: true, data: records };
  } catch (error) {
    console.error('查询失败:', error);
    return { success: false, error: '查询失败' };
  }

}

//查询今日待处理
export async function getTodayPendingCareRecords(){
  
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    const records = await db.select().from(careRecords)
      .where(and(
        eq(careRecords.status, 'pending'),
        gte(careRecords.scheduledAt, today.toISOString()),
        lte(careRecords.scheduledAt, tomorrow.toISOString())
      )).orderBy(desc(careRecords.createdAt))
    return { success: true, data: records };
  } catch (error) {
    console.error('查询失败:', error);
    return { success: false, error: '查询失败' };
  }

}

//更新状态
export async function updateCareRecordStatus(id: string, status: string) { 
  
  try{
    await db.update(careRecords)
    .set({ status,
           completedAt: status === 'completed' ? new Date().toISOString() : null,
           updatedAt: new Date().toISOString() })
    .where(eq(careRecords.id, id))
    return { success: true, message: '更新成功' };
  }catch(error){ 
    console.error('更新失败:', error);
    return { success: false, error: '更新失败' };
  }
}

//删除护理记录
export async function deleteCareRecord(id: string) { 
  
  try{
    await db.delete(careRecords).where(eq(careRecords.id, id))
    return { success: true, message: '删除成功' };
  }catch(error){ 
    console.error('删除失败:', error);
    return { success: false, error: '删除失败' };
  }

}
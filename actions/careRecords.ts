'use server'

import { careRecords } from "@/lib/schema";
import { db } from "@/lib/db";
import { and, desc, eq, gte, lte, sql } from "drizzle-orm";
import { revalidatePath } from "next/cache";

interface ActionResult {
  success: boolean;
  message?: string;
  error?: string;
}

//查找所有护理记录
export async function getAllCareRecords() { 
  try {
    const records = await db.select().from(careRecords).orderBy(desc(careRecords.createdAt))
    return { success: true, data: records };
  } catch (error) {
    console.error('查询失败:', error);
    return { success: false, error: '查询失败' };
  }
}

// 创建护理记录
export async function createCareRecord(formatData: FormData): Promise<ActionResult> {
 
  try { 
    await db.insert(careRecords).values({
      id: crypto.randomUUID(),
      content: formatData.get('content') as string,
      type: formatData.get('type') as 'normal' || 'advanced',
      status: formatData.get('status') as 'pending' || 'completed' || 'cancelled',
      scheduledAt: formatData.get('scheduledAt') as string || null,
      completedAt: formatData.get('completedAt') as string || null,
      notes: formatData.get('notes') as string || '',
      elderId: formatData.get('elderId') as string,
      caregiverId: formatData.get('caregiverId') as string
  })
    revalidatePath('/dashboard/care') // 重新验证护理记录页面
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
export async function updateCareRecordStatus(id: string, status: 'pending' | 'completed' | 'cancelled') { 
  
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


interface careRecordProps {
  page?: number;
  limit?: number;
  elderId?: string;
  caregiverId?: string;
  status?: string;
  type?: string;
  startDate?: string;
  endDate?: string;
}
//分页获取护理记录
export async function getCareRecordsByPage(params: careRecordProps) {

  try { 
    const { page = 1, limit = 10, elderId, caregiverId, status, type, startDate, endDate } = params;
    //计算偏移量
    const offset = (page - 1) * limit;
    //构建查询条件
    const conditions = [];
    if (elderId) conditions.push(eq(careRecords.elderId, elderId));
    if (caregiverId) conditions.push(eq(careRecords.caregiverId, caregiverId));
    if (status) conditions.push(eq(careRecords.status, status as 'pending' | 'completed' | 'cancelled'));
    if (type) conditions.push(eq(careRecords.type, type as 'normal' | 'advanced'));
    if (startDate) conditions.push(gte(careRecords.createdAt, new Date(startDate).toISOString()));
    if (endDate) conditions.push(lte(careRecords.createdAt, new Date(endDate).toISOString()));
    
    //查询总数
    let countQuery
    if (conditions.length > 0) {
      countQuery = await db.select({ count: sql<number>`count(*)` }).from(careRecords).where(and(...conditions));
    } else {
      countQuery = await db.select({ count: sql<number>`count(*)` }).from(careRecords);
    }

    //获取总数并处理undefined情况
    const countResult = countQuery;
    const totalCount = countResult[0]?.count ?? 0;

    //查询当前页面的数据
    let records
    if (conditions.length > 0) { 
      records = await db.select().from(careRecords)
                        .where(and(...conditions))
                        .orderBy(desc(careRecords.createdAt))
                        .limit(limit)
                        .offset(offset);
    }else{
      records = await db.select().from(careRecords)
                        .orderBy(desc(careRecords.createdAt))
                        .limit(limit)
                        .offset(offset);
    }

    //计算总页数
    const totalPages = Math.ceil(totalCount / limit);

    return { success: true, 
             data: { records, //当前页数据
                     pagination: {
                                   currentPage:page, //当前页
                                   totalPages, //总页数
                                   totalRecords: totalCount, //总记录数
                                   recordsPerPage: limit, //每页记录数
                                   hasNextPage:page < totalPages, //是否有下一页
                                   hasPreviousPage: page > 1 //是否有上一页
                                  } 
                    } 
            };
  }  
    catch (error) { 
    console.error('查询失败:', error);
    return { success: false, error: '查询失败' };
  }

}



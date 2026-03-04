import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { elders,beds,careRecords,healthRecords } from "@/lib/schema";
import { eq,sql,and,gte,lte } from "drizzle-orm";

export async function GET(req: Request) { 

  try {

    // 获取日期
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const todayStart = today.toISOString();

    today.setHours(23, 59, 59, 999);
    const todayEnd = today.toISOString();
    
    // 获取在住老人
    const activeEldersResult = await db
     .select({count: sql<number>`count(*)`})
     .from(elders)
     .where(eq(elders.status, 'active'))

    // 获取总床位数
    const totalBedsResult = await db
     .select({count: sql<number>`count(*)`})
     .from(beds)

    // 空余床位
    const availableBedsResult = await db
     .select({count: sql<number>`count(*)`})
     .from(beds)
     .where(eq(beds.status, 'available'))

    // 今日入住
    const newAdmissionsResult = await db
     .select({count: sql<number>`count(*)`})
     .from(elders)
     .where(and(
        eq(elders.status, 'active'),
        gte(elders.admittedAt, todayStart),
        lte(elders.admittedAt, todayEnd)
     )
    )

    // 今日出院
    const dischargesResult = await db
     .select({count: sql<number>`count(*)`})
     .from(elders)
     .where(and(
        eq(elders.status, 'discharged'),
        gte(elders.dischargedAt, todayStart),
        lte(elders.dischargedAt, todayEnd)
      )
    )
    
    // 健康预警
    const healthAlertsResult = await db
     .select({count: sql<number>`count(*)`})
     .from(healthRecords)
     .where(and(
        eq(healthRecords.alert, 1),
        gte(healthRecords.createdAt, todayStart),
        lte(healthRecords.createdAt, todayEnd)
     ))

     // 护理记录
     const pendingTasksResult = await db
      .select({ count: sql<number>`count(*)` })
      .from(careRecords)
      .where(eq(careRecords.status, 'pending'))
    
      // 护理完成
       const completedTasksResult = await db
      .select({ count: sql<number>`count(*)` })
      .from(careRecords)
      .where(
        and(
          eq(careRecords.status, 'completed'),
          gte(careRecords.completedAt, todayStart),
          lte(careRecords.completedAt, todayEnd)
        )
      )

       return NextResponse.json({
      residentCount: activeEldersResult[0]?.count || 0,
      totalBeds: totalBedsResult[0]?.count || 0,
      availableBeds: availableBedsResult[0]?.count || 0,
      newAdmissionsToday: newAdmissionsResult[0]?.count || 0,
      dischargesToday: dischargesResult[0]?.count || 0,
      healthAlerts: healthAlertsResult[0]?.count || 0,
      pendingTasks: pendingTasksResult[0]?.count || 0,
      completedTasks: completedTasksResult[0]?.count || 0,
    })


  } catch (error) {
    
    console.error('Dashboard stats error',error);
    return NextResponse.json(
      { error: 'Failed to fetch dashboard stats' },
      { status: 500 }
    )
  }
}
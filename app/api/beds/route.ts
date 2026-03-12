import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { beds } from "@/lib/schema";
import { eq } from "drizzle-orm";

// GET请求：通过uuid查询床位
export async function GET(request: NextRequest) {
  try {
    // 从查询参数获取uuid
    const { searchParams } = new URL(request.url);
    const uuid = searchParams.get('uuid');
    
    if (!uuid) {
      return NextResponse.json(
        { success: false, error: '缺少uuid参数' },
        { status: 400 }
      );
    }
    
    // 查询数据库
    const bedResult = await db
      .select({
        id: beds.id,
        roomNumber: beds.roomId,
        bedNumber: beds.bedNumber,
        status: beds.status,
        createdAt: beds.createdAt,
        updatedAt: beds.updatedAt,
      })
      .from(beds)
      .where(eq(beds.id, uuid));
    
    if (bedResult.length === 0) {
      return NextResponse.json(
        { success: false, error: '床位不存在' },
        { status: 404 }
      );
    }
    
    return NextResponse.json({
      success: true,
      data: bedResult[0]
    });
    
  } catch (error) {
    console.error('获取床位失败:', error);
    return NextResponse.json(
      { success: false, error: '服务器内部错误' },
      { status: 500 }
    );
  }
}
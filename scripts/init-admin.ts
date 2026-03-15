import { db } from '../lib/db'; 
import { users } from '../lib/schema'; 
import { eq } from 'drizzle-orm';
import { hash } from 'bcryptjs';

async function initializeAdmin() {
  try {
    const adminEmail = process.env.ADMIN_EMAIL || '';
    const adminPassword = await hash(process.env.ADMIN_PASSWORD || '', 10);
    const adminUsername = process.env.ADMIN_USERNAME || 'admin';
    
    const existingAdmin = await db
      .select()
      .from(users)
      .where(eq(users.email, adminEmail));
    
    if (existingAdmin.length === 0) {
      await db.insert(users).values({
        id: crypto.randomUUID(),
        name: adminUsername,
        email: adminEmail,
        password: adminPassword,
        role: 'admin',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      });
      console.log('管理员账号创建成功');
    } else {
      console.log('管理员账号已存在');
    }
  } catch (error) {
    console.error('初始化失败:', error);
  }
}

initializeAdmin();

export { initializeAdmin };
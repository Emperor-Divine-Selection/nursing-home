
import { sqliteTable, text, integer,unique } from 'drizzle-orm/sqlite-core'

// 房间表
export const rooms = sqliteTable('rooms', {
  id: text('id').primaryKey().$defaultFn(() => crypto.randomUUID()),
  roomNumber: text('room_number').notNull().unique(),
  createdAt: text('created_at').notNull().$defaultFn(() => new Date().toISOString()),
  updatedAt: text('updated_at').notNull().$defaultFn(() => new Date().toISOString()),
})

// 病床表
export const beds = sqliteTable('beds', {
  id: text('id').primaryKey().$defaultFn(() => crypto.randomUUID()),
  roomId: text('room_id').notNull().references(() => rooms.id, { onDelete: 'cascade',onUpdate: 'cascade' }),
  bedNumber: text('bed_number').notNull(),
  status: text('status',{enum: ['available', 'occupied', 'maintenance','reserved']}).notNull().default('available'),
  createdAt: text('created_at').notNull().$defaultFn(() => new Date().toISOString()),
  updatedAt: text('updated_at').notNull().$defaultFn(() => new Date().toISOString()),
},(table) => ({
  uniqueRoomBed: unique('unique_room_bed').on(table.roomId, table.bedNumber),
}))
 
// 老人表
export const elders = sqliteTable('elders', {
  id: text('id').primaryKey().$defaultFn(() => crypto.randomUUID()),
  name: text('name').notNull(),
  age: integer('age').notNull(),
  gender: text('gender',{enum: ['male', 'female', 'unknown']}).notNull().default('unknown'),
  roomId: text('room_id').references(() => rooms.id, { onDelete: 'set null', onUpdate: 'cascade' }).$type<string | null>(),
  bedId: text('bed_id').references(() => beds.id, { onDelete: 'set null', onUpdate: 'cascade' }).$type<string | null>().unique(),
  phone: text('phone'),
  emergencyContact: text('emergency_contact').notNull(),
  medicalHistory: text('medical_history'),
  status: text('status',{enum: ['active', 'discharged']}).notNull().default('active'),
  admittedAt: text('admitted_at').notNull(), //入院时间
  dischargedAt: text('discharged_at'), //出院时间
  createdAt: text('created_at').notNull().$defaultFn(() => new Date().toISOString()),
  updatedAt: text('updated_at').notNull().$defaultFn(() => new Date().toISOString()),
})

// 健康记录表
export const healthRecords = sqliteTable('health_records', {
  id: text('id').primaryKey(),
  elderId: text('elder_id').notNull().references(() => elders.id, { onDelete: 'cascade'}),
  caregiverId: text('caregiver_id').notNull().references(() => users.id, { onDelete: 'cascade' }), //护理人员ID
  bloodPressure: text('blood_pressure'), //血压
  bloodSugar: integer('blood_sugar'), //血糖
  heartRate: integer('heart_rate'), //心率
  temperature: integer('temperature'), //体温
  weight: integer('weight'),
  notes: text('notes'), //健康记录备注
  alert: integer('alert').default(0), //是否需要提醒
  createdAt: text('created_at').notNull().$defaultFn(() => new Date().toISOString()),
  }
)

// Session 表
export const sessions = sqliteTable('sessions', {
  id: text('id').primaryKey(),
  userId: text('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  expiresAt: text('expires_at').notNull(),
  createdAt: text('created_at').notNull(),
})

// 用户表
export const users = sqliteTable('users', {
  id: text('id').primaryKey(),
  email: text('email').notNull().unique(),
  password: text('password').notNull(),
  role: text('role').notNull().default('caregiver'),
  name: text('name').notNull(), //可选：护理人员姓名
  createdAt: text('created_at').notNull(),
  updatedAt: text('updated_at').notNull(),
})

// 护理记录表
export const careRecords = sqliteTable('care_records', {
  id: text('id').primaryKey().$defaultFn(() => crypto.randomUUID()),
  content: text('content').notNull(),
  type: text('type',{enum: ['normal', 'advanced']}).notNull().default('normal'),
  status: text('status',{enum: ['pending', 'completed', 'cancelled']}).notNull().default('pending'), //状态
  scheduledAt: text('scheduled_at'), //计划时间
  completedAt: text('completed_at'), //完成时间
  notes: text('notes'), //护理备注
  createdAt: text('created_at').notNull().$defaultFn(() => new Date().toISOString()),
  updatedAt: text('updated_at').notNull().$defaultFn(() => new Date().toISOString()),
  elderId: text('elder_id').notNull().references(() => elders.id, { onDelete: 'cascade' }),
  caregiverId: text('caregiver_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
})



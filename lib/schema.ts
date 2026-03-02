import { sqliteTable, text, integer } from 'drizzle-orm/sqlite-core'

// 用户表
export const users = sqliteTable('users', {
  id: text('id').primaryKey(),
  email: text('email').notNull().unique(),
  password: text('password').notNull(),
  role: text('role').notNull().default('caregiver'),
  createdAt: text('created_at').notNull(),
  updatedAt: text('updated_at').notNull(),
})

// 老人表
export const elders = sqliteTable('elders', {
  id: text('id').primaryKey(),
  name: text('name').notNull(),
  age: integer('age').notNull(),
  gender: text('gender').notNull().default('unknown'),
  room: text('room').notNull(),
  phone: text('phone'),
  emergencyContact: text('emergency_contact').notNull(),
  medicalHistory: text('medical_history'),
  status: text('status').notNull().default('active'),
  createdAt: text('created_at').notNull(),
  updatedAt: text('updated_at').notNull(),
})

// 护理记录表
export const careRecords = sqliteTable('care_records', {
  id: text('id').primaryKey(),
  content: text('content').notNull(),
  type: text('type').notNull().default('normal'),
  createdAt: text('created_at').notNull(),
  elderId: text('elder_id').notNull().references(() => elders.id, { onDelete: 'cascade' }),
  caregiverId: text('caregiver_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
})
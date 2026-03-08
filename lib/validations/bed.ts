import { z } from 'zod'

export const bedSchema = z.object({
  roomNumber: z.string()
    .min(1, '房间号必填')
    .regex(/^[0-9]{3}$/, '必须是3位数字'),
  
  bedNumber: z.string()
    .min(1, '床位号必填')
    .regex(/^[A-Z][0-9]{2}$/, '格式：字母+2位数字，如A01'),
  
  type: z.enum(['standard', 'vip']),
  
  status: z.enum(['available', 'occupied', 'maintenance'])
})

export type BedFormData = z.infer<typeof bedSchema>
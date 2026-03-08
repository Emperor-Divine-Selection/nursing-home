'use client'
import { useForm } from 'react-hook-form'
import { useEffect } from 'react'
import { addBed } from '@/actions/beds'

type BedFormData = {
  roomNumber: string
  bedNumber: string
  type: 'standard' | 'vip'
  status: 'available' | 'occupied' | 'maintenance'
}

export default function BedForm({ 
  onSuccess, 
  onCancel 
}: { 
  onSuccess?: () => void, 
  onCancel?: () => void 
}) {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    watch,
    setValue,
    reset
  } = useForm<BedFormData>({
    defaultValues: {
      roomNumber: '',
      bedNumber: '',
      type: 'standard',
      status: 'available'
    }
  })

  // 监听 type 字段变化
  const bedType = watch('type')
  const bedStatus = watch('status')

  // VIP床位自动设为可用
  useEffect(() => {
    if (bedType === 'vip') {
      setValue('status', 'available', {
        shouldValidate: true,
        shouldDirty: true,
        shouldTouch: true
      })
    }
  }, [bedType, setValue])

  const onSubmit = async (data: BedFormData) => {
    try {
      // 确保VIP床位状态正确
      const finalData = {
        ...data,
        status: data.type === 'vip' && data.status !== 'available' 
          ? 'available'
          : data.status
      }
      
      await addBed(finalData)
      reset()
      onSuccess?.()
    } catch (error) {
      console.error('添加失败:', error)
    }
  }

  return (
    <form 
      onSubmit={handleSubmit(onSubmit)} 
      className="space-y-6 p-6 bg-white rounded-xl shadow-lg border border-gray-200"
    >
      {/* 表单标题 */}
      <div className="border-b pb-4">
        <h2 className="text-2xl font-bold text-gray-800">添加新床位</h2>
        <p className="text-gray-600 mt-1">填写床位信息</p>
      </div>

      {/* 房间号 */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          房间号 *
        </label>
        <input
          {...register('roomNumber', { 
            required: '房间号必填',
            pattern: {
              value: /^[0-9]{3}$/,
              message: '必须是3位数字'
            }
          })}
          className={`
            w-full px-4 py-3 border rounded-lg 
            focus:ring-2 focus:ring-blue-500 focus:border-blue-500 
            transition-all duration-200
            ${errors.roomNumber 
              ? 'border-red-500 bg-red-50' 
              : 'border-gray-300 hover:border-gray-400'
            }
          `}
          placeholder="例如：101"
        />
        {errors.roomNumber && (
          <p className="mt-2 text-sm text-red-600 flex items-center">
            <span className="mr-1">⚠️</span>
            {errors.roomNumber.message}
          </p>
        )}
      </div>

      {/* 床位号 */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          床位号 *
        </label>
        <input
          {...register('bedNumber', { 
            required: '床位号必填',
            pattern: {
              value: /^[A-Z][0-9]{2}$/,
              message: '格式：字母+2位数字，如A01'
            }
          })}
          className={`
            w-full px-4 py-3 border rounded-lg 
            focus:ring-2 focus:ring-blue-500 focus:border-blue-500 
            transition-all duration-200
            ${errors.bedNumber 
              ? 'border-red-500 bg-red-50' 
              : 'border-gray-300 hover:border-gray-400'
            }
          `}
          placeholder="例如：A01"
        />
        {errors.bedNumber && (
          <p className="mt-2 text-sm text-red-600 flex items-center">
            <span className="mr-1">⚠️</span>
            {errors.bedNumber.message}
          </p>
        )}
      </div>

      {/* 床位类型 */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          床位类型
        </label>
        <select
          {...register('type')}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg 
                   focus:ring-2 focus:ring-blue-500 focus:border-blue-500 
                   transition-all duration-200 hover:border-gray-400"
        >
          <option value="standard">标准床位</option>
          <option value="vip">VIP床位</option>
        </select>
      </div>

      {/* 床位状态 */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          状态
        </label>
        <select
          {...register('status')}
          disabled={bedType === 'vip'}
          className={`
            w-full px-4 py-3 border rounded-lg 
            focus:ring-2 focus:ring-blue-500 focus:border-blue-500 
            transition-all duration-200
            ${bedType === 'vip' 
              ? 'bg-gray-100 border-gray-300 text-gray-500 cursor-not-allowed' 
              : 'border-gray-300 hover:border-gray-400'
            }
          `}
        >
          <option value="available">空闲</option>
          <option value="occupied">占用</option>
          <option value="maintenance">维护中</option>
        </select>
        
        {bedType === 'vip' && (
          <div className="mt-2 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
            <p className="text-sm text-yellow-800 flex items-center">
              {/* <span className='mb-1 text-xl'>👑</span> */}
                <span className='w-full text-center'>专属服务 · 优先护理</span>
            </p>
          </div>
        )}
      </div>

      {/* 按钮组 */}
      <div className="flex gap-3 pt-6 border-t">
        <button
          type="submit"
          disabled={isSubmitting}
          className={`
            flex-1 py-3 px-6 rounded-lg font-medium 
            transition-all duration-200
            ${isSubmitting
              ? 'bg-blue-400 cursor-not-allowed'
              : 'bg-blue-600 hover:bg-blue-700 active:bg-blue-800'
            }
            text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2
            disabled:opacity-70
          `}
        >
          {isSubmitting ? (
            <span className="flex items-center justify-center">
              <svg className="animate-spin h-5 w-5 mr-2" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
              </svg>
              添加中...
            </span>
          ) : (
            '添加床位'
          )}
        </button>

        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="px-6 py-3 border border-gray-300 rounded-lg font-medium 
                     text-gray-700 hover:bg-gray-50 active:bg-gray-100 
                     focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2
                     transition-all duration-200"
          >
            取消
          </button>
        )}
      </div>

      {/* 表单状态提示 */}
      <div className="text-sm text-gray-500 space-y-1 pt-2">
        {isSubmitting && (
          <p className="flex items-center">
            <span className="mr-2 animate-pulse">⏳</span>
            正在提交数据...
          </p>
        )}
        <p className="text-xs">
          提示：VIP床位有特殊标识和优先服务
        </p>
      </div>
    </form>
  )
}
'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { getElder, updateElder } from '@/actions/elders'

interface Elder {

    id: string;
    name: string;
    age: number;
    gender: "male" | "female" | "unknown";
    phone: string | null;
    status: "active" | "discharged";
    room: string | null;
    bed: string | null;
    admittedAt: string;
    dischargedAt: string | null;
    emergencyContact:string;
    medicalHistory: string | null;
}

export default function ElderEditPage() {
  const params = useParams()
  const router = useRouter()
  const id = params.id as string
  
  const [elder, setElder] = useState<Elder | null>(null)
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)

  useEffect(() => {
    const loadElder = async () => {
      const result = await getElder(id)
      if (result.success && result.data) {
        setElder(result.data)
      }
      setLoading(false)
    }
    loadElder()
  }, [id])

  const handleSubmit = async (formData: FormData) => {
    setSubmitting(true)
    setError('')
    
    const data = {
      name: formData.get('name') as string,
      age: Number(formData.get('age')),
      gender: (formData.get('gender') as 'male' | 'female' | 'unknown') || 'unknown',
      roomId: formData.get('room') as string || null,
      bedId: (formData.get('bedId') as string) || null,
      phone: formData.get('phone') as string || null,
      emergencyContact: formData.get('emergencyContact') as string,
      medicalHistory: formData.get('medicalHistory') as string || null,
      status: formData.get('status') as 'active' | 'discharged',
      admittedAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }
    
    const result = await updateElder(id, data)
    
    if (result.success) {
      setSuccess(true)
      router.push('/dashboard/elders')
    } else {
      setError(result.error || '更新失败')
      setSubmitting(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-gray-500">加载中...</p>
      </div>
    )
  }

  if (!elder) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-gray-500">老人不存在</p>
      </div>
    )
  }

  return (
    <div className="max-w-2xl mx-auto p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-900">编辑老人信息</h1>
        <button
          onClick={() => router.back()}
          className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400"
        >
          返回
        </button>
      </div>

      {error && (
        <div className="p-4 bg-red-50 text-red-800 rounded-md">
          {error}
        </div>
      )}

      {success && (
        <div className="p-4 bg-green-50 text-green-800 rounded-md">
          更新成功，跳转中...
        </div>
      )}

      <div className="bg-white rounded-lg shadow-md p-6">
        <form action={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
              姓名
            </label>
            <input
              id="name"
              name="name"
              type="text"
              defaultValue={elder.name}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="age" className="block text-sm font-medium text-gray-700 mb-1">
                年龄
              </label>
              <input
                id="age"
                name="age"
                type="number"
                defaultValue={elder.age}
                required
                min="0"
                max="150"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <div>
              <label htmlFor="gender" className="block text-sm font-medium text-gray-700 mb-1">
                性别
              </label>
              <select
                id="gender"
                name="gender"
                defaultValue={elder.gender}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white"
              >
                <option value="male">男</option>
                <option value="female">女</option>
                <option value="unknown">未知</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="room" className="block text-sm font-medium text-gray-700 mb-1">
                房间
              </label>
              <input
                id="room"
                name="room"
                type="text"
                defaultValue={elder.room? elder.room : ''}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <div>
              <label htmlFor="bedId" className="block text-sm font-medium text-gray-700 mb-1">
                床号（可选）
              </label>
              <input
                id="bedId"
                name="bedId"
                type="text"
                defaultValue={elder.bed || ''}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
                电话
              </label>
              <input
                id="phone"
                name="phone"
                type="text"
                defaultValue={elder.phone || ''}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <div>
              <label htmlFor="emergencyContact" className="block text-sm font-medium text-gray-700 mb-1">
                紧急联系人
              </label>
              <input
                id="emergencyContact"
                name="emergencyContact"
                type="text"
                defaultValue={elder.emergencyContact}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
          </div>

          <div>
            <label htmlFor="medicalHistory" className="block text-sm font-medium text-gray-700 mb-1">
              医疗历史
            </label>
            <textarea
              id="medicalHistory"
              name="medicalHistory"
              rows= {4}
              defaultValue={elder.medicalHistory || ''}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-y"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-1">
                状态
              </label>
              <select
                id="status"
                name="status"
                defaultValue={elder.status}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white"
              >
                <option value="active">在院</option>
                <option value="discharged">已出院</option>
              </select>
            </div>

            <div>
              <label htmlFor="dischargedAt" className="block text-sm font-medium text-gray-700 mb-1">
                出院时间（可选）
              </label>
              <input
                id="dischargedAt"
                name="dischargedAt"
                type="date"
                defaultValue={elder.dischargedAt ? elder.dischargedAt.split('T')[0] : ''}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
          </div>

          <div className="flex gap-4 pt-4">
            <button
              type="submit"
              disabled={submitting}
              className="flex-1 px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 disabled:opacity-50"
            >
              {submitting ? '保存中...' : '保存'}
            </button>
            <button
              type="button"
              onClick={() => router.back()}
              className="flex-1 px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400"
            >
              取消
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
'use client'

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { getAllElders, deleteElder } from "../../../actions/elders"

// 简化类型定义
interface Elder {
  id: string;
  name: string;
  age: number;
  gender: "male" | "female" | "unknown";
  phone: string | null;
  status: "active" | "discharged";
  roomNumber: string | null;  // 直接来自数据库的房间号
  bedNumber: string | null;   // 直接来自数据库的床位号
  admittedAt: string;
  dischargedAt: string | null;
}

export default function EldersPage() {
  const router = useRouter()
  const [elders, setElders] = useState<Elder[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  // 获取所有老人数据 - 简化版
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true)
      setError('')
      
      try {
        const result = await getAllElders()
        
        if (!result.success || !result.data) {
          setError(result.error || '获取老人数据失败')
          setLoading(false)
          return
        }
        
        setElders(result.data)
        
      } catch (error) {
        console.error('加载数据失败:', error)
        setError('加载数据失败，请稍后重试')
      } finally {
        setLoading(false)
      }
    }
    
    fetchData()
  }, [])

  // 状态样式辅助函数 - 保持原样
  const getStatusStyle = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800'
      case 'discharged': return 'bg-gray-100 text-gray-800'
      case 'critical': return 'bg-red-100 text-red-800'
      default: return 'bg-blue-100 text-blue-800'
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case 'active': return '在院'
      case 'discharged': return '已出院'
      case 'critical': return '危重'
      default: return status
    }
  }

  // 性别显示 - 简化
  const getGenderText = (gender: string) => {
    switch (gender) {
      case 'male': return '男'
      case 'female': return '女'
      default: return '未知'
    }
  }

  // 床位显示 - 简化版
  const getBedDisplayText = (elder: Elder): string => {
    if (!elder.bedNumber) return '-'
    return `${elder.bedNumber}号床`
  }

  // 删除处理 - 保持原样
  const handleDelete = async (id: string) => {
    const confirmed = window.confirm('确定要删除吗？')
    if (!confirmed) return
    
    try {
      const result = await deleteElder(id)
      if (result.success) {
        setElders(elders.filter((elder) => elder.id !== id))
      } else {
        alert('删除失败: ' + (result.error || '未知错误'))
      }
    } catch (error) {
      console.error('删除失败:', error)
      alert('删除失败，请稍后重试')
    }
  }

  // 加载状态 - 保持原样
  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-lg">加载中...</div>
      </div>
    )
  }

  // 错误状态 - 保持原样
  if (error) {
    return (
      <div className="p-4">
        <div className="bg-red-100 text-red-700 p-4 rounded">
          {error}
        </div>
        <button 
          onClick={() => window.location.reload()}
          className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          重试
        </button>
      </div>
    )
  }

  return (
    <div className="p-4">
      <h1 className="text-3xl font-bold text-gray-900 mb-6 text-center">
        老人管理目录
      </h1>
      
      <div className="flex justify-between items-center mb-6">
        <div className="text-sm text-gray-500">
          共 {elders.length} 位老人
        </div>
        <button 
          onClick={() => router.push('/dashboard/elders/new')}
          className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition"
        >
          新增老人
        </button>
      </div>

      {elders.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          暂无老人数据
        </div>
      ) : (
        <div className="overflow-x-auto bg-white shadow-md rounded-lg">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  姓名
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  年龄
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  性别
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  房间
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  床位
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  电话
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  状态
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  入院时间
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  操作
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {elders.map((elder) => (
                <tr key={elder.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap font-medium">
                    {elder.name}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {elder.age}岁
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {getGenderText(elder.gender)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {elder.roomNumber || '-'}  {/* ← 直接显示房间号 */}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {getBedDisplayText(elder)}  {/* ← 直接显示床位号 */}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {elder.phone || '-'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 text-xs font-semibold rounded-full ${getStatusStyle(elder.status)}`}>
                      {getStatusText(elder.status)}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {new Date(elder.admittedAt).toLocaleDateString('zh-CN')}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                    <button 
                      onClick={() => router.push(`/dashboard/elders/${elder.id}`)}
                      className="text-indigo-600 hover:text-indigo-900"
                    >
                      查看
                    </button>
                    <button 
                      onClick={() => router.push(`/dashboard/elders/${elder.id}/edit`)}
                      className="text-blue-600 hover:text-blue-900"
                    >
                      编辑
                    </button>
                    <button 
                      onClick={() => handleDelete(elder.id)}
                      className="text-red-600 hover:text-red-900"
                    >
                      删除
                    </button>
                  </td>
                </tr>
              ))}
              </tbody>
            </table>
        </div>
        )}
      </div>   
  )
}
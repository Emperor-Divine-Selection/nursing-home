
'use client'

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { getAllElders, getElder, addElder, deleteElder, updateElder } from "../../../actions/elders"

interface Elder {
    id: string
    name: string
    age: number
    gender: string
    room: string
    bedId: string | null
    phone: string | null
    emergencyContact: string
    medicalHistory: string | null
    status: string
    admittedAt: string
    dischargedAt: string | null
    createdAt: string
    updatedAt: string
  } 
export default function EldersPage() {
  
  const router = useRouter()
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

  const handleDelete = async (id: string) => {
    const confirmed = window.confirm('确定要删除吗？')
    if (confirmed) {
      const result = await deleteElder(id)
      if (result.success) {
        setElders(elders.filter((elder) => elder.id !== id))
      }else{
        alert('删除失败')
      }
    }
  }

  const [elders, setElders] = useState<Elder[]>([])
  useEffect(() => {
    const fetchElders = async () => {
      const result = await getAllElders()
      if (result.success && result.data){
        setElders(result.data)
      }
    }
    fetchElders()
  }, [])

  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-900 mt-4 text-center">老人管理目录</h1>
      <div className="flex flex-wrap justify-end"> 
        <button
        onClick={() => router.push('/dashboard/elders/new')}
        className="px-3 py-1 bg-indigo-700 text-white rounded-md hover:bg-indigo-300"
      >新增老人
      </button>
      </div>
      <div className="overflow-x-auto bg-white shadow-md rounded-lg">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">编号</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">姓名</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">年龄</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">性别</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">房间</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">床号</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">电话</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">紧急联系人</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">医疗历史</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">状态</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">操作</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">出院时间</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">入院时间</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">最近更新</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200"> 
              {
                elders.map((elder) => (
                  <tr key={elder.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">{elder.id}</td>
                    <td className="px-6 py-4 whitespace-nowrap">{elder.name}</td>
                    <td className="px-6 py-4 whitespace-nowrap">{elder.age}</td>
                    <td className="px-6 py-4 whitespace-nowrap">{
                        elder.gender === "male" ? "男" : elder.gender === "female" ? "女" : "未知"                      
                                                                }</td>
                    <td className="px-6 py-4 whitespace-nowrap">{elder.room}</td>
                    <td className="px-6 py-4 whitespace-nowrap">{elder.bedId || '-'}</td>
                    <td className="px-6 py-4 whitespace-nowrap">{elder.phone || '-'}</td>
                    <td className="px-6 py-4 whitespace-nowrap">{elder.emergencyContact}</td>
                    <td className="px-6 py-4 whitespace-nowrap">{elder.medicalHistory || '-'}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 text-xs font-semibold rounded-full ${getStatusStyle(elder.status)}`}>
                        {getStatusText(elder.status)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">{new Date(elder.admittedAt).toLocaleDateString('zh-CN')}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {elder.dischargedAt ? new Date(elder.dischargedAt).toLocaleDateString('zh-CN') : '-'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">{new Date(elder.createdAt).toLocaleDateString('zh-CN')}</td>
                    <td className="px-6 py-4 whitespace-nowrap">{new Date(elder.updatedAt).toLocaleDateString('zh-CN')}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <button onClick={() => router.push(`/dashboard/elders/${elder.id}`)}
                      className="text-indigo-600 hover:text-indigo-900 mr-3">查看</button>
                    <button  onClick={() => router.push(`/dashboard/elders/${elder.id}/edit`)}
                      className="text-blue-600 hover:text-blue-900 mr-3">编辑</button>
                    <button  onClick={() => handleDelete(elder.id)}
                      className="text-red-600 hover:text-red-900">删除</button>
                  </td>
                  </tr>
                )) 
              }
          </tbody>
        </table>
      </div>
    </div>
  )
}
import { getElder } from "@/actions/elders"
import Link from "next/link"

export default async function ElderDetailPage({ 
  params 
}: { 
  params: Promise<{ id: string }> 
}) {
  const { id } = await params
  const result = await getElder(id)
  console.log(result)
  
  if (!result.success || !result.data) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-gray-500">老人不存在</p>
      </div>
    )
  }
  
  const elder = result.data
  
  const getGenderText = (gender: string) => {
    if (gender === 'male') return '男'
    if (gender === 'female') return '女'
    return '未知'
  }
  
  const getStatusStyle = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800'
      case 'discharged': return 'bg-gray-100 text-gray-800'
      default: return 'bg-blue-100 text-blue-800'
    }
  }
  
  const getStatusText = (status: string) => {
    switch (status) {
      case 'active': return '在院'
      case 'discharged': return '已出院'
      default: return status
    }
  }
  
  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      {/* 标题 */}
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-900">{elder.name}</h1>
        <div className="flex gap-4">
          <Link 
            href="/dashboard/elders" 
            className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400"
          >
            返回
          </Link>
          <Link 
            href={`/dashboard/elders/${elder.id}/edit`} 
            className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
          >
            编辑
          </Link>
        </div>
      </div>
      
      {/* 信息卡片 */}
      <div className="bg-white rounded-lg shadow-md p-6 space-y-6">
        {/* 基本信息 */}
        <div>
          <h2 className="text-lg font-semibold text-gray-900 mb-4">基本信息</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            <div>
              <label className="text-sm text-gray-500">姓名</label>
              <p className="text-gray-900 font-medium">{elder.name}</p>
            </div>
            <div>
              <label className="text-sm text-gray-500">年龄</label>
              <p className="text-gray-900 font-medium">{elder.age}岁</p>
            </div>
            <div>
              <label className="text-sm text-gray-500">性别</label>
              <p className="text-gray-900 font-medium">{getGenderText(elder.gender)}</p>
            </div>
            <div>
              <label className="text-sm text-gray-500">房间</label>
              <p className="text-gray-900 font-medium">{elder.room || ''}</p>
            </div>
            <div>
              <label className="text-sm text-gray-500">床号</label>
              <p className="text-gray-900 font-medium">{elder.bed || ''}</p>
            </div>
            <div>
              <label className="text-sm text-gray-500">电话</label>
              <p className="text-gray-900 font-medium">{elder.phone || ''}</p>
            </div>
          </div>
        </div>
        
        {/* 联系信息 */}
        <div>
          <h2 className="text-lg font-semibold text-gray-900 mb-4">联系信息</h2>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm text-gray-500">紧急联系人</label>
              <p className="text-gray-900 font-medium">{elder.emergencyContact}</p>
            </div>
            <div>
              <label className="text-sm text-gray-500">状态</label>
              <p>
                <span className={`px-2 py-1 text-xs font-semibold rounded-full ${getStatusStyle(elder.status)}`}>
                  {getStatusText(elder.status)}
                </span>
              </p>
            </div>
          </div>
        </div>
        
        {/* 医疗历史 */}
        <div>
          <h2 className="text-lg font-semibold text-gray-900 mb-4">医疗历史</h2>
          <p className="text-gray-900 bg-gray-50 rounded-md p-4">
            {elder.medicalHistory || '无'}
          </p>
        </div>
        
        {/* 时间信息 */}
        <div>
          <h2 className="text-lg font-semibold text-gray-900 mb-4">时间信息</h2>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm text-gray-500">入院时间</label>
              <p className="text-gray-900 font-medium">
                {new Date(elder.admittedAt).toLocaleDateString('zh-CN')}
              </p>
            </div>
            <div>
              <label className="text-sm text-gray-500">出院时间</label>
              <p className="text-gray-900 font-medium">
                {elder.dischargedAt 
                  ? new Date(elder.dischargedAt).toLocaleDateString('zh-CN') 
                  : ''}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
'use client'

import { useState,useEffect, use } from 'react'
import { createCareRecord } from '@/actions/careRecords'

interface Caregiver {
  id: string;
  email: string;
  name: string;
  createdAt: string;
  updatedAt: string;
}

interface Elder {
  id: string;
  name: string;
  age: number;
  gender: "male" | "female" | "unknown";
  phone: string | null;
  status: "active" | "discharged";
  roomNumber: string | null;
  bedNumber: string | null;
  admittedAt: string;
  medicalHistory: string | null;
  emergencyContact: string;
  dischargedAt: string | null;
}



export default function CreateCareRecordModel({ caregiversList, eldersList }: { caregiversList: Caregiver[]; eldersList: Elder[] }) {
  
  const [isOpenModal, setIsOpenModal] = useState(false)
  const [elderId, setElderId] = useState('')
  const [caregiverId, setCaregiverId] = useState('')

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)
    const result = await createCareRecord(formData)
    console.log(result)
    if (result.success) {
      setIsOpenModal(false)
    }
    
  }
  


  


  return (
    <>
      <div>
        <button onClick={() => setIsOpenModal(true)}
            className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 mr-2">
          新建任务
        </button>
      </div>

      {/* {新建护理任务模态框}   */}
      {isOpenModal && ( 
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black/50"> 
          <div className="relative bg-white p-6 rounded-xl shadow-xl w-full max-w-md border border-gray-200">
            <h2 className="text-xl font-bold mb-6 text-center text-gray-900">新建护理记录</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <label htmlFor="elder" className="block text-sm font-medium text-gray-700">老人</label>
                <div className="relative">
                  <select 
                    name="elderId" 
                    id="elder" 
                    value={elderId} 
                    onChange={(e) => setElderId(e.target.value)}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-white"
                  >
                    {eldersList.map((elder) => (
                      <option key={elder.id} value={elder.id}>
                        {elder.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              
              <div className="space-y-2">
                <label htmlFor="caregiver" className="block text-sm font-medium text-gray-700">护理人员</label>
                <div className="relative">
                  <select 
                    name="caregiverId" 
                    id="caregiver" 
                    value={caregiverId} 
                    onChange={(e) => setCaregiverId(e.target.value)}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-white"
                  >
                    {caregiversList.map((caregiver) => (
                      <option key={caregiver.id} value={caregiver.id}>
                        {caregiver.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label htmlFor="type" className="block text-sm font-medium text-gray-700">任务类型</label>
                  <div className="relative">
                    <select 
                      name="type" 
                      id="type"
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-white"
                    >
                      <option value="normal">普通</option>
                      <option value="advanced">高级</option>
                    </select>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <label htmlFor="status" className="block text-sm font-medium text-gray-700">任务状态</label>
                  <div className="relative">
                    <select 
                      name="status" 
                      id="status"
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-white"
                    >
                      <option value="pending">待处理</option>
                      <option value="completed">已完成</option>
                      <option value="cancelled">已取消</option>
                    </select>
                  </div>
                </div>
              </div>
              
              <div className="space-y-2">
                <label htmlFor="notes" className="block text-sm font-medium text-gray-700">任务备注</label>
                <input 
                  type="text" 
                  id='notes' 
                  name='notes'
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                />
              </div>
              
              <div className="space-y-2">
                <label htmlFor="content" className="block text-sm font-medium text-gray-700">任务内容</label>
                <textarea 
                  name="content" 
                  id="content" 
                  rows={3}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                ></textarea>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label htmlFor="scheduledAt" className="block text-sm font-medium text-gray-700">开始时间</label>
                  <input 
                    type="datetime-local" 
                    name="scheduledAt" 
                    id="scheduledAt" 
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  />
                </div>
                <div className="space-y-2">
                  <label htmlFor="completedAt" className="block text-sm font-medium text-gray-700">结束时间</label>
                  <input 
                    type="datetime-local" 
                    name="completedAt" 
                    id="completedAt" 
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  />
                </div>
              </div>
              
              <div className="flex space-x-3 pt-4">
                <button 
                  type="submit" 
                  className="flex-1 px-4 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition-colors"
                >
                  新建
                </button>
                <button 
                  type="button"
                  onClick={() => setIsOpenModal(false)} 
                  className="flex-1 px-4 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-colors"
                >
                  取消
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>  
  )
}
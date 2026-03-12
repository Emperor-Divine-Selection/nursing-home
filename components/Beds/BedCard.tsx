'use client';

import { deleteBed } from "@/actions/beds";
import { useState,useEffect } from "react";
import { getAllRooms } from "@/actions/rooms";
import { updateBedStatusOrRoom } from "@/actions/beds";

type Bed = {
  id: string;
  roomNumber: string | null;
  bedNumber: string;
  status: 'available' | 'occupied' | 'maintenance' | 'reserved';
};

interface BedCardProps {
  bed: Bed;
}

type Rooms = {
  id: string;
  roomNumber: string;
  createdAt: string;
  updatedAt: string;
};

export default function BedCard({ bed }: BedCardProps) {
  // 状态颜色映射
  const statusConfig = {
    available: { bg: 'bg-green-100', text: 'text-green-800', label: '空闲' },
    occupied: { bg: 'bg-red-100', text: 'text-red-800', label: '占用' },
    maintenance: { bg: 'bg-yellow-100', text: 'text-yellow-800', label: '维护' },
    reserved: { bg: 'bg-purple-100', text: 'text-purple-800', label: '预定' }
  };



  const status = statusConfig[bed.status];
  const displayRoomNumber = bed.roomNumber ?? '未分配';
  const [isOpenModal, setIsOpenModal] = useState(false);
  const [rooms, setRooms] = useState<Rooms[]>()
  const [error,setError] = useState<string | null>(null)


  useEffect(() => {
    const fetchRooms = async () => {
      const result = await getAllRooms()
      if (result.success && result.data) {
        setRooms(result.data)
      }
    }
    fetchRooms()
  },[])

  const handleDelete = async () => {
     await deleteBed(bed.id);
  };

  const handleEdit = async (formData: FormData) => {

    const result = await updateBedStatusOrRoom(formData, bed.id)
    if (result.error) {
      setError(result.error)
      setTimeout(() => setError(null), 3000);
    }
    // console.log('编辑数据:', data);
    setIsOpenModal(false)
  }

  return (
    <div className="border border-gray-200 rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow">
      {/* 房间床位号 */}
      <h3 className="text-xl font-semibold mb-3 text-center">
        房间 {displayRoomNumber} - 床 {bed.bedNumber}
      </h3>
      
      {/* 状态徽章 */}
      <div className="flex justify-center gap-2 mb-4">
        <span className={`px-3 py-1 text-sm rounded-full ${status.bg} ${status.text}`}>
          {status.label}
        </span>
      </div>
      {isOpenModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50 backdrop-blur-sm">
          <div 
            onClick={() => setIsOpenModal(false)}
            className='absolute inset-0'
          />
          <div className="relative bg-white rounded-xl shadow-2xl w-full max-w-md p-6 border border-gray-200 transform transition-all duration-200 scale-95 animate-in fade-in-90 zoom-in-90">
            <div className="flex justify-between items-center mb-4 border-b border-gray-100 pb-3">
              <h2 className="text-xl font-semibold text-gray-800">编辑床位信息</h2>
              <button 
                onClick={() => setIsOpenModal(false)}
                className="text-gray-400 hover:text-gray-600 transition-colors duration-200"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            {/* 编辑表单 */}
            <form action={handleEdit} className="space-y-4">
              <div>
                <label htmlFor="roomId" className="block text-sm font-medium text-gray-700 mb-1">
                  房号
                </label>
                <select 
                  name="roomId" 
                  id="roomId"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200 bg-white"
                >
                  {rooms?.map((room) => (
                    <option key={room.id} value={room.id}>
                      {room.roomNumber}
                    </option>
                  ))}
                </select>
              </div>
              
              <div>
                <label htmlFor="bedStatus" className="block text-sm font-medium text-gray-700 mb-1">
                  状态
                </label>
                <select 
                  name="bedStatus" 
                  id="bedStatus"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200 bg-white"
                >
                  <option value="available">空闲</option>
                  <option value="occupied">占用</option>
                  <option value="maintenance">维护</option>
                  <option value="reserved">预定</option>
                </select>
              </div>
              
              <div className="flex gap-3 pt-4">
                <button 
                  type="submit" 
                  className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors duration-200 font-medium"
                >
                  提交
                </button>
                <button 
                  type="button"
                  onClick={() => setIsOpenModal(false)}
                  className="flex-1 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-colors duration-200 font-medium"
                >
                  取消
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      {/* 操作按钮 */}
      
      <div onClick={() => setIsOpenModal(true)} 
        className="flex gap-2 justify-end">
        {error && <span className="text-red-500 mr-auto">{error}</span>}
        <button className="px-3 py-1 text-sm border border-gray-300 rounded hover:bg-gray-50 transition-colors">
          编辑
        </button>
        <button onClick={handleDelete}
          className="px-3 py-1 text-sm bg-red-100 text-red-700 rounded hover:bg-red-200 transition-colors">
          删除
        </button>
      </div>
    </div>
  );
}
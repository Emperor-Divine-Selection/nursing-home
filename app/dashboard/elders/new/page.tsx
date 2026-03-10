'use client'

import { addElder } from "@/actions/elders";
import { useState,useEffect } from "react";
import { useRouter } from "next/navigation";
import { getAvailableBedsInRoom, getAllRooms } from "@/actions/rooms";

type Bed = {
  id: string;
  roomId: string;
  bedNumber: string;
  status: "available" | "occupied" | "maintenance" | "reserved";
  createdAt: string;
  updatedAt: string;
};

type rooms = {
  id: string;
  roomNumber: string;
}

export default function addEldersPage() {

  const router = useRouter();
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [rooms,setRooms] = useState<rooms[]>([])
  const [bedsInRoom,setBedsInRoom] = useState<Bed[]>()

  const handleRoomChange = async (e: React.ChangeEvent<HTMLSelectElement>) => {
  const roomNumber = e.target.value;
  
  if (!roomNumber) {
    setBedsInRoom([]);  // 清空床位列表
    return;
  }
  
  const result = await getAvailableBedsInRoom(roomNumber);
  if (result.success && result.data && result !== undefined ) {
    setBedsInRoom(result.data);
  } else {
    setBedsInRoom([]);
    setError(result.error || '加载床位失败');
  }
};
  
  useEffect(() => {

    async function getRooms() {
      const rooms = await getAllRooms()
      if (rooms.success && rooms.data) {
        setRooms(rooms.data)
      }
    }

    getRooms()

  },[])

  const addelder = async (formData: FormData) => {
  setLoading(true)
  setError('')  // 清空旧错误
  
  const result = await addElder(formData)
  
  if (result.success) {
    setSuccess(true)
    router.push('/dashboard/elders')
  } else {
    setError(result.error || '新增失败')  // 显示具体错误
    setLoading(false)
  }
}


  return (
    <div >
      <h1 className="text-3xl font-bold text-gray-900 mt-4 text-center">新增老人</h1>
      {success && <div className="text-green-500 mb-4 text-center">提交成功</div>}
      {error && <div className="text-red-500 mb-4 text-center">{error}</div>}
      <div className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-lg">
        <form action={addelder}>
          <div className="mb-4">
            <label htmlFor="name" 
              className="block text-sm font-medium text-gray-700 mb-1">姓名:</label>
            <input id="name" type="text" name="name" placeholder="姓名" required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500" />
          </div>
          <div className="mb-4">
            <label htmlFor="age"
              className="block text-sm font-medium text-gray-700 mb-1">年龄:</label>
            <input id="age" type="number" name="age" placeholder="年龄" required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"/>
          </div>
          <div className="mb-4">
            <label htmlFor="gender"
              className="block text-sm font-medium text-gray-700 mb-1">性别:</label>
            <select name="gender" id="gender" 
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white">
              <option value="male">男</option>
              <option value="female">女</option>
              <option value="other">未知</option>
            </select>
          </div>
          <div className="mb-4">
            <label htmlFor="room"
              className="block text-sm font-medium text-gray-700 mb-1">房间:</label>
            <select name="room" id="room" onChange={handleRoomChange} 
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white">
              <option value="">请选择房间</option>
              {rooms.map((room) => (
               <option key={room.id} value={room.id}>{room.roomNumber}</option>
                ))}
            </select>
          </div>
          <div className="mb-4">
            <label htmlFor="bedId"
              className="block text-sm font-medium text-gray-700 mb-1">床号:</label>
            <select name="bedId" id="bedId" 
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white">
              <option value="">请选择床号</option>
              {bedsInRoom !== undefined && bedsInRoom.map((bed) => (
               <option key={bed.id} value={bed.id}>{bed.bedNumber}</option>
                ))}
            </select>
          </div>
          <div className="mb-4">
            <label htmlFor="phone"
              className="block text-sm font-medium text-gray-700 mb-1">电话:</label>
            <input id="phone" type="text" name="phone" placeholder="电话" 
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"/>
          </div>
          <div className="mb-4">
            <label htmlFor="emergencyContact"
              className="block text-sm font-medium text-gray-700 mb-1">紧急联系人:</label>
            <input id="emergencyContact" type="text" name="emergencyContact" placeholder="紧急联系人" required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500" />
          </div>
          <div className="mb-4">
            <label htmlFor="medicalHistory"
              className="block text-sm font-medium text-gray-700 mb-1">医疗历史:</label>
            <textarea id="medicalHistory" name="medicalHistory" placeholder="医疗历史" rows={4}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-y" />
          </div>
          <div className="flex gap-4 mb-4">
            <button type="submit" 
              className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 disabled:opacity-50"
              disabled = {loading}>{loading ? '提交中...' : '提交'}</button>
            <button 
              className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400"
              type="button" onClick={() => router.back()}>取消</button>
          </div>
        </form>
      </div>
    </div>
  )
}
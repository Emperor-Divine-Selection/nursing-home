'use client'

import { useForm } from 'react-hook-form'
import { deleteRoomOrBed } from '@/actions/rooms'
import { getAllRooms } from '@/actions/rooms'
import { getbedsByRoomId } from '@/actions/beds'
import { useEffect,useState } from 'react'


type DeleteBedFormData = {
  roomId: string
  bedId: string | null
}

interface Rooms {
  id: string;
  roomNumber: string;
  createdAt: string;
  updatedAt: string;
}

interface Beds {
  id: string;
  roomId: string;
  bedNumber: string;
  status: "available" | "occupied" | "maintenance" | "reserved";
  createdAt: string;
  updatedAt: string;
}

interface DeleteBedFormProps {
  onSuccess?: () => void
  onCancel?: () => void
}

export default function DeleteBedForm({ onSuccess, onCancel }: DeleteBedFormProps) {
  const { register, handleSubmit, formState: { isSubmitting }, watch } = useForm<DeleteBedFormData>()

  const selectedRoomId = watch('roomId')
  const [rooms, setRooms] = useState<Rooms[]>([])
  const [beds, setBeds] = useState<Beds[]>([])

  useEffect(() => {
    const fetchRooms = async () => {
      const res = await getAllRooms()
      if (res.success && res.data) {
        setRooms(res.data)
      }
    }
    fetchRooms()
  }, [])

  useEffect(() => {
    const fetchBeds = async () => {
      if (selectedRoomId) {
        const res = await getbedsByRoomId(selectedRoomId)
        if (res.success && res.data) {
          setBeds(res.data)
        }
      } else {
        setBeds([])
      }
    }
    fetchBeds()
  }, [selectedRoomId])

  const onSubmit = async (data: DeleteBedFormData) => {
    const result = await deleteRoomOrBed(data.roomId, data.bedId || null)
    if (result.success) {
      console.log(result.message)
      onSuccess?.()
    } else {
      console.error(result.error)
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 p-6 bg-white rounded-xl shadow-lg border border-gray-200">
      <div className="border-b pb-4">
        <h2 className="text-2xl font-bold text-gray-800">删除床位</h2>
        <p className="text-gray-600 mt-1">选择要删除的床位和房间</p>
      </div>

      <div>
        <label htmlFor="roomId" className="block text-sm font-medium text-gray-700">房间</label>
        <select id="roomId" {...register('roomId')} className="w-full border-gray-300 p-2 rounded-md">
          <option value="">请选择房间</option>
          {rooms.map(room => (
            <option key={room.id} value={room.id}>{room.roomNumber}</option>
          ))}
        </select>
      </div>

      <div>
        <label htmlFor="bedId" className="block text-sm font-medium text-gray-700">床位</label>
        <select id="bedId" {...register('bedId')} className="w-full border-gray-300 p-2 rounded-md">
          <option value="">请选择床位（留空则删除房间）</option>
          {beds.map(bed => (
            <option key={bed.id} value={bed.id}>{bed.bedNumber}</option>
          ))}
        </select>
      </div>

      <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
        <h3 className="font-medium text-red-800 flex items-center">
          <span className="mr-2">⚠️</span>警告
        </h3>
        <ul className="mt-2 text-sm text-red-700 space-y-1 list-disc list-inside">
          <li>删除床位操作不可撤销</li>
          <li>如果房间还有床位，将无法删除房间</li>
        </ul>
      </div>

      <div className="flex justify-end"> 
        <button type="submit" disabled={isSubmitting} className="bg-white hover:bg-gray-100 text-gray-800 font-semibold py-2 px-4 border border-gray-300 rounded shadow mr-2">
          提交
        </button>
        <button type="button" onClick={onCancel} className="bg-white hover:bg-gray-100 text-gray-800 font-semibold py-2 px-4 border border-gray-300 rounded shadow mr-2">
          取消
        </button>
      </div>
    </form>
  )
}
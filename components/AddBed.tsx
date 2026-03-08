'use client'

import { useState } from 'react'
import ClientBedList from '../components/ClientBedList'
import BedForm from './BedForm'


interface Bed { 
    id: string;
    roomNumber: string;
    bedNumber: string;
    type: string;
    status: string;
    createdAt: string;
    updatedAt: string;

}


interface addBedProps {
  initialBeds?: Bed[]
}

export default function AddBed({ initialBeds = [] } : addBedProps){

    const totalBeds = initialBeds?.length;
    const availableBeds = initialBeds?.filter( Bed => Bed.status === 'available').length;
    const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <div className="p-6">
            {/* 头部 */}
            <header className="mb-8">
              <h1 className="text-3xl font-bold text-gray-900 text-center mb-2">
                床位管理
              </h1>
              <div className="flex justify-between items-center">
                <p className="text-gray-500">
                  共 {totalBeds} 个床位，{availableBeds} 个空闲
                </p>
                <button onClick={() => setIsModalOpen(true)}
                  className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors">
                  增加床位
                </button>
              </div>
            </header>
    
            {/* 传递数据给客户端组件 */}
            <ClientBedList initialBeds={initialBeds} />

            {/* {模态框} */}
            {isModalOpen && (
              
              <div className='fixed inset-0 z-50 flex items-center justify-center p-4'>
                <div className='absolute inset-0 bg-black/50'
                  onClick={() => setIsModalOpen(false) } />
                  <div className='relative bg-white rounded-lg shadow-xl w-full max-w-md p-6'> 
                    <h2 className='text-xl font-bold mb-4 text-gray-900 text-center'>增加床位</h2>
                    <BedForm onSuccess={() => setIsModalOpen(false)} onCancel={() => setIsModalOpen(false)} />
                  </div>
              </div>
              
            )}
          </div>
  )

}
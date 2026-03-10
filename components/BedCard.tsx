'use client';

import { deleteBed } from "@/actions/beds";

type Bed = {
  id: string;
  roomNumber: string | null;
  bedNumber: string;
  status: 'available' | 'occupied' | 'maintenance' | 'reserved';
};

interface BedCardProps {
  bed: Bed;
}

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

  const handleDelete = async () => {
     await deleteBed(bed.id);

  };

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

      {/* 操作按钮 */}
      <div className="flex gap-2 justify-end">
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
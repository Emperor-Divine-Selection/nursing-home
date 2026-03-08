'use client';

type BedStatus = 'available' | 'occupied' | 'maintenance';
type BedType = 'standard' | 'vip';

type Bed = {
  id: string;
  roomNumber: string;
  bedNumber: string;
  type: BedType; // 改为字面量类型
  status: BedStatus; // 改为字面量类型
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
  };

  // 类型颜色映射
  const typeConfig = {
    standard: { bg: 'bg-blue-100', text: 'text-blue-800', label: '标准' },
    vip: { bg: 'bg-purple-100', text: 'text-purple-800', label: 'VIP' },
  };

  const status = statusConfig[bed.status];
  const type = typeConfig[bed.type];

  return (
    <div className="border border-gray-200 rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow">
      {/* 房间床位号 */}
      <h3 className="text-xl font-semibold mb-3 text-center">
        房间 {bed.roomNumber} - 床 {bed.bedNumber}
      </h3>

      {/* 状态和类型徽章 */}
      <div className="flex justify-center gap-2 mb-4">
        <span className={`px-3 py-1 text-sm rounded-full ${status.bg} ${status.text}`}>
          {status.label}
        </span>
        <span className={`px-3 py-1 text-sm rounded-full ${type.bg} ${type.text}`}>
          {type.label}
        </span>
      </div>

      {/* 操作按钮 */}
      <div className="flex gap-2 justify-end">
        <button className="px-3 py-1 text-sm border border-gray-300 rounded hover:bg-gray-50 transition-colors">
          编辑
        </button>
        <button className="px-3 py-1 text-sm bg-red-100 text-red-700 rounded hover:bg-red-200 transition-colors">
          删除
        </button>
      </div>
    </div>
  );
}
'use client';

import { useState, useMemo } from 'react';
import BedCard from './BedCard';

// 输入类型（宽松）
type InputBed = {
  id: string;
  roomNumber: string | null;
  bedNumber: string;
  status: "available" | "occupied" | "maintenance" | "reserved";
  updatedAt: string;
};

export interface Bed {
  id: string;
  roomNumber: string | null;
  bedNumber: string;
  status: "available" | "occupied" | "maintenance" | "reserved";
  updatedAt: string;
}

// 修正：添加 'reserved'
type BedStatus = 'available' | 'occupied' | 'maintenance' | 'reserved';

interface ClientBedListProps {
  initialBeds?: InputBed[];
}

export default function ClientBedList({ initialBeds = [] }: ClientBedListProps) {
  // 转换数据类型 - 修正类型转换
  const beds: Bed[] = useMemo(() => 
    initialBeds.map(bed => ({
      id: bed.id,
      roomNumber: bed.roomNumber ?? null,
      bedNumber: bed.bedNumber,
      // 修正：保留所有状态，不进行错误转换
      status: bed.status,
      updatedAt: bed.updatedAt,
    })), 
    [initialBeds]
  );

  // 状态管理
  const [filter, setFilter] = useState<'all' | BedStatus>('all');
  const [search, setSearch] = useState('');
  const [sortBy, setSortBy] = useState<'room' | 'status' | 'type'>('room');

  // 筛选逻辑
  const filteredBeds = useMemo(() => {
    let result = beds.filter(bed => {
      // 状态筛选
      if (filter !== 'all' && bed.status !== filter) return false;
      
      // 搜索筛选
      if (search) {
        const roomMatch = bed.roomNumber?.toLowerCase().includes(search.toLowerCase()) ?? false;
        const bedMatch = bed.bedNumber.toLowerCase().includes(search.toLowerCase());
        return roomMatch || bedMatch;
      }
      return true;
    });

    // 排序逻辑
    result.sort((a, b) => {
      switch (sortBy) {
        case 'room':
          // 修正：安全处理 null 值
          const roomA = a.roomNumber ?? '';
          const roomB = b.roomNumber ?? '';
          return roomA.localeCompare(roomB) || parseInt(a.bedNumber) - parseInt(b.bedNumber);
        
        case 'status':
          // 修正：添加类型注解确保完整性
          const statusOrder: Record<BedStatus, number> = {
            available: 0,
            occupied: 1,
            maintenance: 2,
            reserved: 3
          };
          return statusOrder[a.status] - statusOrder[b.status];
        
        default:
          return 0;
      }
    });

    return result;
  }, [beds, filter, search, sortBy]);

  // 统计数据 - 修正：添加 reserved 统计
  const stats = useMemo(() => ({
    total: beds.length,
    available: beds.filter(b => b.status === 'available').length,
    occupied: beds.filter(b => b.status === 'occupied').length,
    maintenance: beds.filter(b => b.status === 'maintenance').length,
    reserved: beds.filter(b => b.status === 'reserved').length,
  }), [beds]);

  return (
    <div>
      {/* 搜索和筛选区域 */}
      <div className="mb-6 space-y-4">
        {/* 搜索框 */}
        <div className="relative">
          <input
            type="text"
            placeholder="搜索房间号或床位号..."
            className="w-full px-4 py-2 pl-10 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <div className="absolute left-3 top-2.5 text-gray-400">🔍</div>
        </div>

        {/* 筛选按钮组 - 修正：添加 reserved 按钮 */}
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setFilter('all')}
            className={`px-4 py-2 rounded-md transition-colors ${
              filter === 'all' ? 'bg-indigo-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            全部 ({stats.total})
          </button>
          <button
            onClick={() => setFilter('available')}
            className={`px-4 py-2 rounded-md transition-colors ${
              filter === 'available' ? 'bg-green-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            空闲 ({stats.available})
          </button>
          <button
            onClick={() => setFilter('occupied')}
            className={`px-4 py-2 rounded-md transition-colors ${
              filter === 'occupied' ? 'bg-red-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            占用 ({stats.occupied})
          </button>
          <button
            onClick={() => setFilter('maintenance')}
            className={`px-4 py-2 rounded-md transition-colors ${
              filter === 'maintenance' ? 'bg-yellow-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            维护 ({stats.maintenance})
          </button>
          {/* 添加 reserved 按钮 */}
          <button
            onClick={() => setFilter('reserved')}
            className={`px-4 py-2 rounded-md transition-colors ${
              filter === 'reserved' ? 'bg-purple-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            预定 ({stats.reserved})
          </button>
        </div>

        {/* 排序选项 */}
        <div className="flex items-center gap-2">
          <span className="text-gray-600">排序:</span>
          <select
            className="px-3 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-indigo-500"
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as 'room' | 'status' | 'type')}
          >
            <option value="room">房间号</option>
            <option value="status">状态</option>
            <option value="type">类型</option>
          </select>
        </div>
      </div>

      {/* 床位列表 */}
      <div className="grid sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredBeds.map(bed => (
          <BedCard key={bed.id} bed={bed} />
        ))}
      </div>

      {/* 空状态 */}
      {filteredBeds.length === 0 && (
        <div className="text-center py-12">
          <div className="text-4xl mb-4">🛏️</div>
          <h3 className="text-xl font-semibold mb-2">
            {search ? '未找到匹配的床位' : '暂无床位'}
          </h3>
          <p className="text-gray-500 mb-4">
            {search ? '尝试修改搜索条件' : '点击上方按钮添加第一个床位'}
          </p>
        </div>
      )}

      {/* 统计信息 - 修正：添加 reserved 统计 */}
      <div className="mt-8 pt-6 border-t border-gray-200">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          <div className="text-center p-4 bg-gray-50 rounded-lg">
            <div className="text-2xl font-bold text-gray-800">{stats.total}</div>
            <div className="text-sm text-gray-600">总床位</div>
          </div>
          <div className="text-center p-4 bg-green-50 rounded-lg">
            <div className="text-2xl font-bold text-green-800">{stats.available}</div>
            <div className="text-sm text-green-600">空闲</div>
          </div>
          <div className="text-center p-4 bg-red-50 rounded-lg">
            <div className="text-2xl font-bold text-red-800">{stats.occupied}</div>
            <div className="text-sm text-red-600">占用</div>
          </div>
          <div className="text-center p-4 bg-yellow-50 rounded-lg">
            <div className="text-2xl font-bold text-yellow-800">{stats.maintenance}</div>
            <div className="text-sm text-yellow-600">维护</div>
          </div>
          <div className="text-center p-4 bg-purple-50 rounded-lg">
            <div className="text-2xl font-bold text-purple-800">{stats.reserved}</div>
            <div className="text-sm text-purple-600">预定</div>
          </div>
        </div>
      </div>
    </div>
  );
}
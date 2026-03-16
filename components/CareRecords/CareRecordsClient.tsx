'use client'

import { useState, useEffect, use } from 'react'
import { useSearchParams, useRouter } from 'next/navigation';
import { getCareRecordsByPage } from '@/actions/careRecords';
import { getAllCaregivers } from '@/actions/employees';


interface CareRecord {
  id: string;
  content: string;
  type: "normal" | "advanced";
  status: "pending" | "completed" | "cancelled";
  scheduledAt: string | null;
  completedAt: string | null;
  notes: string | null;
  createdAt: string;
  updatedAt: string;
  elderId: string;
  caregiverId: string;
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


interface Pagination {
  currentPage: number;
  totalPages: number;
  totalRecords: number;
  recordsPerPage: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

interface CareRecordsByPageResponse {
  success: boolean;
  data?: {
    records: CareRecord[];
    pagination: Pagination;
  };
  error?: string;
} 

interface CareRecordProps {
  page?: number;
  limit?: number;
  elderId?: string;
  caregiverId?: string;
  status?: string;
  type?: string;
  startDate?: string;
  endDate?: string;
}

interface caregiversList {
  id: string;
  email: string;
  password: string;
  role: string;
  name: string;
  createdAt: string;
  updatedAt: string;
}


export default function CareRecordClient({ eldersList,caregiversList }:{ eldersList: Elder[],caregiversList: caregiversList[] }) { 
  const router = useRouter()
  const searchParams = useSearchParams() 
  
  // 从URL获取参数
  const initialPage = parseInt(searchParams.get('page') ?? '1');
  const initialLimit = parseInt(searchParams.get('limit') ?? '10');
  const initialStatus = searchParams.get('status') ?? '';
  const initialType = searchParams.get('type') ?? '';

  // 组件状态变量
  const [page, setPage] = useState(initialPage);
  const [limit, setLimit] = useState(initialLimit);
  const [status, setStatus] = useState(initialStatus);
  const [type, setType] = useState(initialType);
  const [records, setRecords] = useState<CareRecord[]>([]);
  const [pagination, setPagination] = useState<Pagination | null>(null);
  const [loading, setLoading] = useState(true);
  const [totalRecords, setTotalRecords] = useState(0);
  const [caregiverId,setcaregiverId] = useState('')

  const getCaregiverName = (caregiverId: string) => {
    const caregiver =   caregiversList.find(c => c.id === caregiverId);
    return caregiver?.name || '未知员工';
};

  // 获取数据
  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      try {
        const params: CareRecordProps = { page, limit }
        if(status) params.status = status
        if(type) params.type = type
        
        const result: CareRecordsByPageResponse = await getCareRecordsByPage(params)
        if (result.success && result.data) {
          setRecords(result.data.records);
          setPagination(result.data.pagination);
          setTotalRecords(result.data.pagination.totalRecords);
        } else {
          console.log(result.error)
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally { 
        setLoading(false);
      }
    }
    fetchData()
  }, [page, limit, status, type])

  // 更新URL参数
  const updateURL = (newPage: number, newLimit: number, newStatus: string, newType: string) => { 
    const params = new URLSearchParams();
    if(newPage !== 1) params.set('page', newPage.toString());
    if(newLimit !== 10) params.set('limit', newLimit.toString());
    if(newStatus) params.set('status', newStatus);
    if(newType) params.set('type', newType);
    
    router.push(`?${params.toString()}`, { scroll: false })
  }

  // 处理筛选
  const handleFilterChange = (newStatus: string, newType: string) => { 
    setPage(1);
    setStatus(newStatus);
    setType(newType);
    updateURL(1, limit, newStatus, newType); 
  }

  // 处理分页
  const handlePageChange = (newPage: number) => { 
    setPage(newPage);
    updateURL(newPage, limit, status, type); 
  }

  // 处理每页数量变化
  const handleLimitChange = (newLimit: number) => {
    setLimit(newLimit)
    setPage(1)
    updateURL(1, newLimit, status, type)
  }

  // 分页组件
  const renderPagination = () => {
    if (!pagination || !pagination.totalPages || pagination.totalPages <= 1) return null;
    
    const pages = [];
    const totalPages = pagination.totalPages;
    const currentPage = page;
    
    // 显示当前页前后各2页
    let startPage = Math.max(1, currentPage - 2);
    let endPage = Math.min(totalPages, currentPage + 2);
    
    // 确保始终显示5页（如果可能）
    if (endPage - startPage < 4) {
      if (startPage === 1) {
        endPage = Math.min(totalPages, startPage + 4);
      } else if (endPage === totalPages) {
        startPage = Math.max(1, endPage - 4);
      }
    }
    
    // 开始省略号
    if (startPage > 1) {
      pages.push(<button key={1} onClick={() => handlePageChange(1)} className={`px-3 py-1 rounded ${currentPage === 1 ? 'bg-blue-500 text-white' : 'hover:bg-gray-200'}`}>1</button>);
      if (startPage > 2) {
        pages.push(<span key="start-ellipsis" className="px-2">...</span>);
      }
    }
    
    // 中间页码
    for (let i = startPage; i <= endPage; i++) {
      pages.push(
        <button
          key={i}
          onClick={() => handlePageChange(i)}
          className={`px-3 py-1 rounded ${currentPage === i ? 'bg-blue-500 text-white' : 'hover:bg-gray-200'}`}
        >
          {i}
        </button>
      );
    }
    
    // 结束省略号
    if (endPage < totalPages) {
      if (endPage < totalPages - 1) {
        pages.push(<span key="end-ellipsis" className="px-2">...</span>);
      }
      pages.push(
        <button
          key={totalPages}
          onClick={() => handlePageChange(totalPages)}
          className={`px-3 py-1 rounded ${currentPage === totalPages ? 'bg-blue-500 text-white' : 'hover:bg-gray-200'}`}
        >
          {totalPages}
        </button>
      );
    }
    
    return (
      <div className="flex items-center justify-center space-x-2">
        <button
          onClick={() => handlePageChange(page - 1)}
          disabled={!pagination.hasPreviousPage}
          className={`px-3 py-1 rounded ${!pagination.hasPreviousPage ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gray-200'}`}
        >
          上一页
        </button>
        
        {pages}
        
        <button
          onClick={() => handlePageChange(page + 1)}
          disabled={!pagination.hasNextPage}
          className={`px-3 py-1 rounded ${!pagination.hasNextPage ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gray-200'}`}
        >
          下一页
        </button>
      </div>
    );
  }

  if (loading && records.length === 0) {
    return (
      <div className="p-6 max-w-7xl mx-auto">
        <div className="text-center py-10">加载中...</div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200"> 
      <div className='bg-gray-50 rounded-lg p-4'>
        <div className='flex flex-wrap gap-4'>
          <select 
            value={status}
            onChange={(e) => handleFilterChange(e.target.value, type)}
            className='border rounded p-2 min-w-[120px]'
          >
            <option value="">全部状态</option>
            <option value="pending">待执行</option>
            <option value="completed">已完成</option>
            <option value="cancelled">已取消</option>
          </select>

          <select 
            value={type}
            onChange={(e) => handleFilterChange(status, e.target.value)}
            className='border rounded p-2 min-w-[120px]'
          >
            <option value="">全部类型</option>
            <option value="normal">普通</option>
            <option value="advanced">高级</option>
          </select>

          <select 
            value={limit}
            onChange={(e) => handleLimitChange(parseInt(e.target.value))}
            className='border rounded p-2 min-w-[120px]'
          >
            <option value="10">10条/页</option>
            <option value="20">20条/页</option>
            <option value="50">50条/页</option>
          </select>
        </div>
      </div>

      <div className="p-4"> 
        {records.length === 0 ? (
          <div className="text-center py-10 text-gray-500">暂无护理记录</div>
        ) : (
          records.map((record) => {
            const elder = eldersList.find(elder => elder.id === record.elderId)
            return (
              <div key={record.id} className='border-b border-gray-200 py-4 last:border-b-0'>
                <div className='border w-full rounded border-gray-100 p-4'>
                  <h3 className='font-medium text-gray-900'>{record.notes || '无备注'}</h3>
                  <p className='text-sm text-gray-500'>{record.content}</p>
                  <div className='flex flex-wrap items-center gap-4 mt-2 text-sm text-gray-500'>
                    <span>老人: {elder?.name || '未知'}</span>
                    <span>类型: {record.type === "normal" ? "普通" : "高级"}</span>
                    <span>状态: 
                      {record.status === "pending" ? "待执行" : 
                       record.status === "completed" ? "已完成" : "已取消"}
                    </span>
                    <span>创建时间: {new Date(record.createdAt).toLocaleString('zh-CN', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit',
                      second: '2-digit'
                    })}
                    </span>
                    <span>执行人: {getCaregiverName(record.caregiverId)}</span>
                  </div>
                </div>
              </div>
            )
          })
        )}
      </div>

      {/* 分页导航 */}
      <div className="p-4 border-t border-gray-200 flex items-center justify-between">
        <div className="text-sm text-gray-500">
          共 {totalRecords} 条记录，当前 {records.length} 条
        </div>
        {renderPagination()}
      </div>
    </div>
  )
}
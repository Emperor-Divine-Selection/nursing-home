'use client'

import { useState, useEffect } from 'react'

interface EmployeePageProps {
  id: string;
  email: string;
  password: string;
  role: string;
  name: string | null;
  createdAt: string;
  updatedAt: string;
}

interface EmployeeClientProps {
  employees?: EmployeePageProps[];
}

export default function EmployeeClient({ employees = [] }: EmployeeClientProps) { 

  const [search, setSearch] = useState('')

  return (
    <div className="p4">
      <div className="flex justify-between items-center">
        <p className="text-gray-500">
          {employees.length}个员工
        </p>
        <div>
        <button 
          className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors mr-1">
            增加员工
        </button>
        </div>
      </div>
      <div className="relative">
        <input type="text"
          placeholder="按姓名/邮箱搜索..."
          className='w-full px-4 py-2 pl-10 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500'
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <div className="absolute left-3 top-2.5 text-gray-400">🔍</div>
      </div>
    </div>
  );
}
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
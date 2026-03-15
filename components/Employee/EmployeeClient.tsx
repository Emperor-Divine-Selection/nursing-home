'use client'

import { useState } from 'react'

interface EmployeePageProps {
  id: string;
  name: string | null;
  role: string;
  email: string;
  createdAt: string;
  careRecordCount: number;
  healthRecordCount: number;
}

interface EmployeeClientProps {
  employees?: EmployeePageProps[];
}

export default function EmployeeClient({ employees = [] }: EmployeeClientProps) { 
  const [search, setSearch] = useState('')

  // 搜索过滤逻辑
  const filteredEmployees = employees.filter(emp =>
    (emp.name?.toLowerCase().includes(search.toLowerCase()) ||
    emp.email.toLowerCase().includes(search.toLowerCase()))
  )

  // 时间格式化
  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr)
    return date.toLocaleDateString('zh-CN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }

  // 角色徽章颜色
  const getRoleColor = (role: string) => {
    switch (role) {
      case 'admin':
        return 'bg-purple-100 text-purple-800 border-purple-200'
      case 'caregiver':
        return 'bg-blue-100 text-blue-800 border-blue-200'
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* 搜索和统计区域 */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          {/* 搜索框 */}
          <div className="relative flex-1 max-w-md">
            <input
              type="text"
              placeholder="搜索员工姓名或邮箱..."
              className="w-full px-4 py-3 pl-11 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            <div className="absolute left-3 top-3.5 text-gray-400">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
          </div>

          {/* 统计信息 */}
          <div className="flex items-center gap-6 text-sm text-gray-600">
            <div className="text-center">
              <div className="text-2xl font-bold text-indigo-600">{employees.length}</div>
              <div className="text-gray-500">总员工</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">
                {employees.filter(emp => emp.role === 'caregiver').length}
              </div>
              <div className="text-gray-500">护理人员</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-orange-600">
                {employees.filter(emp => emp.role === 'department_head').length}
              </div>
                <div className="text-gray-500">部门经理</div>
              </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600">
                {employees.filter(emp => emp.role === 'admin').length}
              </div>
              <div className="text-gray-500">管理员</div>
            </div>
          </div>
        </div>
      </div>

      {/* 表格区域 */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  员工信息
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  角色
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  创建时间
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  工作统计
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredEmployees.length > 0 ? (
                filteredEmployees.map((employee) => (
                  <tr 
                    key={employee.id}
                    className="hover:bg-gray-50 transition-colors duration-150 cursor-pointer"
                  >
                    {/* 员工信息列 */}
                    <td className="px-6 py-4">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10 bg-indigo-100 rounded-full flex items-center justify-center">
                          <span className="text-indigo-600 font-semibold text-sm">
                            {employee.name?.charAt(0) || employee.email.charAt(0).toUpperCase()}
                          </span>
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">
                            {employee.name || '未设置姓名'}
                          </div>
                          <div className="text-sm text-gray-500">{employee.email}</div>
                        </div>
                      </div>
                    </td>

                    {/* 角色列 */}
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getRoleColor(employee.role)}`}>
                        {employee.role === 'admin' ? '管理员' : '护理人员'}
                      </span>
                    </td>

                    {/* 创建时间列 */}
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {formatDate(employee.createdAt)}
                    </td>

                    {/* 工作统计列 */}
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-4">
                        <div className="text-center">
                          <div className="text-lg font-semibold text-blue-600">
                            {employee.healthRecordCount}
                          </div>
                          <div className="text-xs text-gray-500">健康记录</div>
                        </div>
                        <div className="text-center">
                          <div className="text-lg font-semibold text-green-600">
                            {employee.careRecordCount}
                          </div>
                          <div className="text-xs text-gray-500">护理记录</div>
                        </div>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={4} className="px-6 py-12 text-center">
                    <div className="text-gray-400">
                      <svg className="mx-auto h-12 w-12 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
                      </svg>
                      <div className="text-lg font-medium text-gray-900 mb-1">没有找到员工</div>
                      <div className="text-gray-500">尝试调整搜索条件或添加新员工</div>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
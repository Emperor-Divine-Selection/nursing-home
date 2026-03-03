'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useRouter } from 'next/navigation'

export default function Navbar() {
  const pathname = usePathname()
  const router = useRouter()
  
  const hideNavbar = ['/', '/register'].includes(pathname)
  if (hideNavbar) return null

  const handleLogout = async () => {
    try {
      const res = await fetch('/api/auth/logout', {
        method: 'POST'
      })
      const data = await res.json()
      if (data.success) {
        router.push('/')
      } else {
        alert('登出失败')
      }
    } catch (error) {
      console.error('登出错误:', error)
      alert('网络错误')
    }
  }

  return (
    <nav className="bg-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* 左侧：Logo + 导航 */}
          <div className="flex">
            <div className="flex-shrink-0 flex items-center">
              <span className="text-xl font-bold text-indigo-600">医院管理系统</span>
            </div>
            <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
              <Link
                href="/dashboard"
                className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium ${
                  pathname === '/dashboard'
                    ? 'border-indigo-500 text-gray-900'
                    : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
                }`}
              >
                首页
              </Link>
              <Link
                href="/dashboard/elders"
                className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium ${
                  pathname.startsWith('/dashboard/elders')
                    ? 'border-indigo-500 text-gray-900'
                    : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
                }`}
              >
                老人管理
              </Link>
              <Link
                href="/dashboard/nurses"
                className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium ${
                  pathname.startsWith('/dashboard/nurses')
                    ? 'border-indigo-500 text-gray-900'
                    : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
                }`}
              >
                护士管理
              </Link>
              <Link
                href="/dashboard/schedule"
                className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium ${
                  pathname.startsWith('/dashboard/schedule')
                    ? 'border-indigo-500 text-gray-900'
                    : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
                }`}
              >
                排班管理
              </Link>
              <Link
                href="/dashboard/medications"
                className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium ${
                  pathname.startsWith('/dashboard/medications')
                    ? 'border-indigo-500 text-gray-900'
                    : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
                }`}
              >
                用药记录
              </Link>
            </div>
          </div>

          {/* 右侧：用户菜单 */}
          <div className="flex items-center">
            <button
              onClick={handleLogout}
              className="text-sm font-medium text-gray-700 hover:text-gray-900"
            >
              登出
            </button>
          </div>
        </div>
      </div>
    </nav>
  )
}
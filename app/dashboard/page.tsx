'use client'

import { useEffect,useState } from "react"
import StatCard from "@/components/StatCard"

interface DashboardStats { 

  residentCount: number
  totalBeds: number
  availableBeds: number
  newAdmissionsToday: number
  dischargesToday: number
  healthAlerts: number
  pendingTasks: number
  completedTasks: number

}

export default function Dashboard() {

  const [stats, setStats] = useState<DashboardStats | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => { 
    
    fetch('/api/dashboard')
      .then(res => res.json())
      .then(data => {
          setStats(data)
          setLoading(false)
        })
      .catch(err => {
        setError(err.message)
        setLoading(false)
      })
  }, [])
  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-screen">
        <h1 className="text-4xl font-bold">正在加载...</h1>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-screen">
        <h1 className="text-4xl font-bold">{error}</h1>
      </div>
    )
  }
  
  return (
    <div className="min-h-screen bg-gray-50">
      <main className="container mx-auto mt-4">
        <h1 className="text-3xl font-bold text-gray-900 text-center my-4 ">仪表盘</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6"> 
          <StatCard title="在住老人" 
            value={`${stats?.residentCount || 0}`}
            subtitle="人"
            color="green"
          />
          <StatCard
            title="空余床位"
            value={stats?.availableBeds || 0}
            subtitle="床"
            color="green"
          />
          <StatCard
            title="今日新入住"
            value={stats?.newAdmissionsToday || 0}
            subtitle="人"
            color="purple"
          />
          <StatCard
            title="今日出院"
            value={stats?.dischargesToday || 0}
            subtitle="人"
            color="orange"
          />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard
            title="健康预警"
            value={stats?.healthAlerts || 0}
            subtitle="条"
            color="red"
          />
          <StatCard
            title="待处理护理"
            value={stats?.pendingTasks || 0}
            subtitle="项"
            color="yellow"
          />
          <StatCard
            title="已完成护理"
            value={stats?.completedTasks || 0}
            subtitle="项"
            color="teal"
          />
          <StatCard
            title="总护理记录"
            value={(stats?.pendingTasks || 0) + (stats?.completedTasks || 0)}
            subtitle="项"
            color="gray"
          />
        </div>
      </main>
    </div>
  )
}
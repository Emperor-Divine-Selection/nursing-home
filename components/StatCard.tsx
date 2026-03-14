interface StatCardProps {
  
  title: string
  value: string | number
  subtitle?: string
  color?: 'green' | 'red' | 'yellow' | 'blue' | 'purple' | 'orange' |'teal' | 'gray'
  
}

export default function StatCard({ title, value, subtitle, color = 'blue' }:StatCardProps){

   const colorClasses = {
    blue: 'text-blue-600 bg-blue-50',
    green: 'text-green-600 bg-green-50',
    red: 'text-red-600 bg-red-50',
    purple: 'text-purple-600 bg-purple-50',
    orange: 'text-orange-600 bg-orange-50',
    yellow: 'text-yellow-600 bg-yellow-50',
    teal: 'text-teal-600 bg-teal-50',
    gray: 'text-gray-600 bg-gray-50',
  }

  return (
    <div className="h-60 bg-white rounded-lg shadow p-6 hover:shadow-lg transition-shadow">
      <p className="text-sm text-gray-500 mb-2">{title}</p>
      <div className="flex items-baseline gap-2">
        <p className={`text-3xl font-bold ${colorClasses[color].split(' ')[0]}`}>
          {value}
        </p>
        {subtitle && <p className="text-sm text-gray-400">{subtitle}</p>}
      </div>
    </div>
  )

}
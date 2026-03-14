import './globals.css'
import { Inter } from 'next/font/google'

export const metadata = {
  title: '医院管理系统',
  description: '医院管理系统',
}
const inter = Inter({ subsets: ['latin'] })

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="zh-CN">
      <body className={inter.className}>
        {children}
      </body>
    </html>
  )
}
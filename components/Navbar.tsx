'use client'

import Link from "next/link"
import { usePathname } from "next/navigation"

export default function Navbar() { 

  const pathname = usePathname()

  const hideNavbar = ['/register','/'].includes(pathname)

  if (hideNavbar) return null

  return ( 
    <nav>
      <div>
        <div>
          {/* {Logo} */}
          <Link href="/">医院管理系统</Link>
          <div>
            <Link href="/">首页</Link>
            <Link href="/about">关于</Link>
          </div>
        </div>
      </div>
    </nav>
  )
}
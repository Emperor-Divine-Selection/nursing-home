'use client'

import Link from 'next/link'

export default function Login() {

  return(
    <div>
      <div>
        <div>
          <h2>登录页面</h2>
        </div>
        <form action="/api/login"> 
        {/* {error} */}

        <div>
          <div>
            <label  htmlFor="">邮箱</label>
            <input  type="email" 
                    name="email"
                    id="email"
                    placeholder="请输入邮箱"  />
            <label  htmlFor="">密码</label>
            <input  type="password" 
                    name="password"
                    id="password"
                    placeholder="请输入密码"  />
          </div>
          <div>
            <button type="submit">登录</button>
          </div>
          <div>
            <Link href="/register">
              <button type="button">注册</button>
            </Link>
          </div>
        </div>
        </form>
      </div>
    </div>
  )
}
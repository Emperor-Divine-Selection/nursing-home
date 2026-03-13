'use client'

import { useState,useEffect } from "react";
import { getUserById,updateUserInfo } from "@/actions/employees";

interface Employee {
  id: string;
        email: string;
        password: string;
        role: string;
        name: string | null;
        createdAt: string;
        updatedAt: string;
}

export default function EmpoyeeManageOrDeletedModel({ userId }: { userId: string | undefined }) {

  const [isOpenManage, setIsOpenManage] = useState(false);
  const [isOpenDeleted, setIsOpenDeleted] = useState(false);
  const [employee, setEmployee] = useState<Employee>();
  console.log('employee',employee)

  useEffect(() => {
   async function fetchEmployee() {
      if (userId !== undefined) {
        const result = await getUserById(userId)
        if (result.success) {
          setEmployee(result.data)
        }
      }
    }
  fetchEmployee()
  },[]
)

  const handleUpdate = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    console.log('formData',formData)
    const result = await updateUserInfo(formData);
    if (result.success) {
      setIsOpenManage(false)
    }
    console.log(result)
  }

  return (
   <>
    <div>   
        <button onClick={() => setIsOpenManage(true)}
          className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors mr-1">
            员工管理
        </button>
        <button onClick={() => setIsOpenDeleted(true)}
          className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors mr-1">
            删除员工
        </button>
    </div>
    {/* 员工管理模态框 */}
    {isOpenManage && (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/50" onClick={() => setIsOpenManage(false)} />
      <div className="relative bg-white rounded-lg shadow-xl w-full max-w-md p-6">
        <h2 className="text-xl font-bold mb-4 text-gray-900 text-center">员工管理</h2>
        <form onSubmit={handleUpdate} >
        <div>
          <label htmlFor="username">姓名:</label>
          <input type="text" id="username" name="username" defaultValue={employee?.name || ""} />
        </div>
        <div>
          <label htmlFor="email">邮箱:</label>
          <input type="email" id="email" name="email" defaultValue={employee?.email || ""} />
        </div>
        <div>
          <label htmlFor="role">职位:</label>
          <select id="role" name="role" defaultValue={employee?.role || "caregiver"}>
            <option value="admin">管理员</option>
            <option value="department_head">部门主管</option>
            <option value="caregiver">护理人员</option>
          </select>
        </div>
        <div>
          <button type="submit">提交</button>
          <button type="button" onClick={() => setIsOpenManage(false)}>
            取消
          </button>
        </div>
        </form>
      </div>
    </div>
    )}
  
  
  </> 
  )
}
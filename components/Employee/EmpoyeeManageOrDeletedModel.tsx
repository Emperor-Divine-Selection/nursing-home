'use client'

import { useState, useEffect } from "react";
import { getEmployeesList, updateUserInfo, deleteUser } from "@/actions/employees";

interface Employee {
  id: string;
  email: string;
  role: string;
  name: string | null;
}

export default function EmployeeManageOrDeleteModel({ userId }: { userId: string | undefined }) {
  const [isOpenManage, setIsOpenManage] = useState(false);
  const [isOpenDelete, setIsOpenDelete] = useState(false);
  const [employeesList, setEmployeesList] = useState<Employee[]>([]);
  const [selectedId, setSelectedId] = useState<string>("");

  // 加载员工列表
  useEffect(() => {
    async function fetchEmployeesList() {
      const result = await getEmployeesList();
      if (result.success && result.data) {
        setEmployeesList(result.data);
      }
    }
    fetchEmployeesList();
  }, []);

  const selectedEmployee = employeesList.find(emp => emp.id === selectedId);

  // 提权提交
  const handleUpdate = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const result = await updateUserInfo(formData, userId || '');
    if (result.success) {
      setIsOpenManage(false);
    }
  };

  // 删除提交
  const handleDelete = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!selectedId) return;
    const result = await deleteUser(selectedId, userId || '');
    if (result.success) {
      setIsOpenDelete(false);
    }
  };

  return (
    <>
      <div>
        <button
          onClick={() => setIsOpenManage(true)}
          className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 mr-2"
        >
          员工提权
        </button>
        <button
          onClick={() => setIsOpenDelete(true)}
          className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
        >
          删除员工
        </button>
      </div>

      {/* 员工提权模态框 */}
      {isOpenManage && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/50" onClick={() => setIsOpenManage(false)} />
          <div className="relative bg-white rounded-lg shadow-xl w-full max-w-md p-6">
            <h2 className="text-xl font-bold mb-4 text-center">员工提权</h2>
            <form onSubmit={handleUpdate} className="space-y-4">
              <div className="flex flex-col">
                <label className="mb-1 font-medium text-gray-700">选择员工:</label>
                <select
                  name="id"
                  value={selectedId}
                  onChange={(e) => setSelectedId(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">请选择员工</option>
                  {employeesList.map((emp) => (
                    <option key={emp.id} value={emp.id}>
                      {emp.name}
                    </option>
                  ))}
                </select>
              </div>

              {selectedEmployee && (
                <>
                  <div className="flex flex-col">
                    <label className="mb-1 font-medium text-gray-700">邮箱:</label>
                    <p className="px-3 py-2 bg-gray-100 rounded-md">{selectedEmployee.email}</p>
                  </div>
                  <div className="flex flex-col">
                    <label className="mb-1 font-medium text-gray-700">职位:</label>
                    <select
                      name="role"
                      defaultValue={selectedEmployee.role}
                      className="px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="admin">管理员</option>
                      <option value="department_head">部门主管</option>
                      <option value="caregiver">护理人员</option>
                    </select>
                  </div>
                </>
              )}

              <div className="flex space-x-2">
                <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">
                  提交
                </button>
                <button type="button" onClick={() => setIsOpenManage(false)} className="px-4 py-2 bg-gray-200 rounded-md hover:bg-gray-300">
                  取消
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 删除模态框 */}
      {isOpenDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/50" onClick={() => setIsOpenDelete(false)} />
          <div className="relative bg-white rounded-lg shadow-xl w-full max-w-md p-6">
            <h2 className="text-xl font-bold mb-4 text-center">删除员工</h2>
            <form onSubmit={handleDelete} className="space-y-4">
              <div className="flex flex-col">
                <label className="mb-1 font-medium text-gray-700">选择员工:</label>
                <select
                  value={selectedId}
                  onChange={(e) => setSelectedId(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-red-500"
                >
                  {/* <option value="">请选择员工</option> */}
                  {employeesList.map((emp) => (
                    <option key={emp.id} value={emp.id}>
                      {emp.name}
                    </option>
                  ))}
                </select>
              </div>
              {selectedEmployee && (
                <div className="flex flex-col">
                  <label className="mb-1 font-medium text-gray-700">邮箱:</label>
                  <p className="px-3 py-2 bg-gray-100 rounded-md">{selectedEmployee.email}</p>
                </div>
              )}
              <div className="flex space-x-2">
                <button type="submit" className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700">
                  删除
                </button>
                <button type="button" onClick={() => setIsOpenDelete(false)} className="px-4 py-2 bg-gray-200 rounded-md hover:bg-gray-300">
                  取消
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}

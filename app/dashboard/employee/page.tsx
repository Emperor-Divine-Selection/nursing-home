'use server'
import EmployeeClient from "@/components/Employee/EmployeeClient";
import { getEmployeesList } from "@/actions/employees";
import { getCurrentUserSessionId,getUserIdBySessionId } from "@/actions/session";
import { getUserRoleByUserId } from "@/actions/employees";
import EmpoyeeManageOrDeletedModel from "@/components/Employee/EmpoyeeManageOrDeletedModel";

export default async function Employee() {

  const sessionId  = await getCurrentUserSessionId();
  const userId = await getUserIdBySessionId(sessionId?.data);
  const { data: userRole } = await getUserRoleByUserId(userId?.data ||'');
  const { data: employeesList } = await getEmployeesList();

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <header className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 text-center mb-2">员工管理</h1>
      </header>
      
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
        <div className="flex justify-between items-center">
          <div className="text-gray-600">
            <span className="text-2xl font-bold text-indigo-600">{employeesList?.length || 0}</span>
            <span className="ml-2">个员工</span>
          </div>
          {userRole?.role === 'admin' && (
            <EmpoyeeManageOrDeletedModel userId={userId?.data} />
          )}
        </div>
      </div>
  
  <EmployeeClient employees={employeesList} />
</div>
  );
}

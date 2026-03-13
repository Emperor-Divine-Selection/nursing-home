'use server'
import EmployeeClient from "@/components/Employee/EmployeeClient";
import { getEmployees } from "@/actions/employees";
import { getCurrentUserSessionId,getUserIdBySessionId } from "@/actions/session";
import { getUserRoleByUserId } from "@/actions/employees";
import EmpoyeeManageOrDeletedModel from "@/components/Employee/EmpoyeeManageOrDeletedModel";

export default async function Employee() {

  const sessionId  = await getCurrentUserSessionId();
  const userId = await getUserIdBySessionId(sessionId?.data);
  const { data: userRole } = await getUserRoleByUserId(userId?.data ||'');
  const { data: employeesList } = await getEmployees();

  return (
    <div className="p-4">
      <header className="mb-4">
        <h1 className="text-3xl font-bold text-gray-900 text-center mb-2">员工管理</h1>
      </header>
      <div className="flex justify-between items-center">
        <p className="text-gray-500">
          {employeesList?.length || 0}个员工
        </p>
        {userRole?.role && (
          <EmpoyeeManageOrDeletedModel userId={userId?.data} />
        )}
      </div>
      <EmployeeClient employees={employeesList} />
    </div>
  );
}

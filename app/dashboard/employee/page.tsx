import EmployeeClient from "@/components/Employee/EmployeeClient";
import { getEmployees } from "@/actions/employees";




export default async function Employee() {

  const { success, data: employees } = await getEmployees();

  return (
    <div className="p-4">
      <header className="mb-4">
        <h1 className="text-3xl font-bold text-gray-900 text-center mb-2">员工管理</h1>
      </header>
      <EmployeeClient employees={employees} />
    </div>
  );
}
import { getAllCareRecords,getCareRecordsByPage } from "@/actions/careRecords"
import { getCurrentUserSessionId,getUserIdBySessionId } from "@/actions/session";
import { getUserRoleByUserId } from "@/actions/employees";
import  CreateCareRecordModel  from "@/components/CareRecords/CreateCareRecordsModel";
import { getAllCaregivers } from '@/actions/employees'
import { getAllElders } from '@/actions/elders'

interface careRecordProps {
  page?: number;
  limit?: number;
  elderId?: string;
  caregiverId?: string;
  status?: string;
  type?: string;
  startDate?: string;
  endDate?: string;
}

export default async function Care({ searchParams }:{ searchParams: careRecordProps }) { 
  
  const careRecordsList = await getAllCareRecords()
  const sessionId  = await getCurrentUserSessionId();
  const userId = await getUserIdBySessionId(sessionId?.data);
  const { data: userRole } = await getUserRoleByUserId(userId?.data ||'');
  const caregiversList = await getAllCaregivers()
  const eldersList = await getAllElders()

  




  return (
    <div className="p-6 max-w-7xl mx-auto">
      <header className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 text-center mb-2">护理记录</h1>
      </header>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
        <div className="flex justify-between items-center">
          <div className="text-gray-600">
            <span className="text-2xl font-bold text-indigo-600">{careRecordsList.success && careRecordsList.data?.length || 0}</span>
            <span className="ml-2">个护理记录</span>
          </div>
          <div className="flex">
            {userRole && userRole.role !== 'caregiver' && <CreateCareRecordModel caregiversList={caregiversList.data ?? []} eldersList={eldersList.data ?? []} />}
          </div>                
        </div>
      </div>
    </div>
  )
}
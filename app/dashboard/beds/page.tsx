import { getAllBeds } from "@/actions/beds";
import AddBed from "@/components/AddBed";

export default async function BedsPage() {
  try {
    const { data: beds, success } = await getAllBeds();
    
    
    if (!success) {
      return (
        <div className="p-6">
          <div className="alert alert-error">数据加载失败</div>
        </div>
      );
    }
  
    return (
      <div className="p-6">
        {/* 传递数据给客户端组件 */}
        <AddBed initialBeds={beds? beds : []} />
      </div>
    );
    
  } catch (error) {
    console.error('页面加载错误:', error);
    return (
      <div className="p-6">
        <div className="alert alert-error">页面加载失败</div>
      </div>
    );
  }
}
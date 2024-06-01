
import { useEffect } from 'react';
import InventoryDashboard from '../pages/InventoryDashboard/InventoryDashboard';
const Dashboard =()=>{
  useEffect(() => {
    // Remove scroll bar
    document.body.style.overflow = 'hidden';

    // Cleanup on component unmount
    return () => {
      document.body.style.overflow = 'visible';
    };
  }, []);
return(
<>
<InventoryDashboard />
</>

)

}
export default Dashboard;
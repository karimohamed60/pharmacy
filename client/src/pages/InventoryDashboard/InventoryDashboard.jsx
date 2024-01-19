import { Outlet } from 'react-router-dom';
import LogoutButton from '../../auth/LogoutButton';
import './InventoryDashboard.css'
const InventoryDashboard = () => {

    
    return(
        <>
    
            Hello in Inventory
            <div>
                <Outlet />
            </div>

            <LogoutButton/>
        </>

    );

}

export default InventoryDashboard;
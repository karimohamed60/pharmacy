import { Outlet } from 'react-router-dom';
import LogoutButton from '../../auth/LogoutButton';

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
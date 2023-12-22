import { useEffect } from 'react';
import { Route, Routes, Navigate, useNavigate } from 'react-router-dom';
import Login from '../auth/Login';
import InventoryDashboard from '../pages/InventoryDashboard/InventoryDashboard';
import PharmacyDashboard from '../pages/PharmacyDashboard/PharmacyDashboard';
import SalafRequestsDashboard from '../pages/SalafRequestsDashboard/SalafRequestsDashboard';
import NotFound from '../pages/NotFound';
import PrivateRoutes from './PrivateRoutes';
import { getUserRole } from '../services/roleService';
import { isAuthenticated } from '../services/authService';
import redirectUser from '../services/redirectUser';

//const role = 'inventory_agent';

//console.log(getUserRole());
function AppRoutes(){
    const role = getUserRole() || 'default';
    const navigate = useNavigate(); 

    useEffect(() => {
        if (!isAuthenticated() && !window.location.pathname.startsWith('/')) {
            navigate('/');
        }

        if(isAuthenticated() && window.location.pathname == '/'){
            redirectUser(role, navigate);
        }
    }, [role, navigate]);

    return (
        <Routes>
            <Route element={<PrivateRoutes />}>
                <Route
                    path='/inventory-dashboard'
                    element={
                        role.includes('inventory_agent') ? (
                            <InventoryDashboard />
                        ) : (
                            <Navigate to="/" />
                        )
                    }
                >
                </Route>
                <Route
                    path='/pharmacy-dashboard'
                    element={
                        role.includes('pharmacy_agent') ? (
                            <PharmacyDashboard />
                        ) : (
                            <Navigate to="/" />
                        )
                    }
                />
                <Route
                    path='/salaf-requests-dashboard'
                    element={
                        role.includes('salaf_requests_agent') ? (
                            <SalafRequestsDashboard />
                        ) : (
                            <Navigate to="/" />
                        )
                    }
                />
            </Route>

            <Route path='/' element={!isAuthenticated() ? <Login /> : null} />            
            <Route path='*' element={<NotFound />} />
        </Routes>
    );
}

export default AppRoutes ;




import {useNavigate} from 'react-router-dom';
import { clearAuthTokenCookie, clearLocalStorage, getAuthTokenCookie } from '../services/authService';

const LogoutButton = () => {
    const navigate = useNavigate();

    const handleLogout = async () => {
        const authToken = getAuthTokenCookie();

        clearAuthTokenCookie();
        clearLocalStorage();

        try {
            await fetch('http://localhost:4000/api/v1/logout', {
            method: 'Delete',
            headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${authToken}`,
            },
        });
    
        navigate('/');
        } catch (error) {
        console.error('Error during logout:', error);
        }
    };

    return (
        <button onClick={handleLogout}>
            Logout
        </button>
    );
};

export default LogoutButton;
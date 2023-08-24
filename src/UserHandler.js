import  { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const UserHandler = ({ children }) => {
  const [userRole, setUserRole] = useState(null);
  const navigate = useNavigate();

  const handleLogout = () => {
    setUserRole(null);
    localStorage.removeItem('role');
    navigate('/'); // Redirect to Home Page
  };

  return children({ userRole, setUserRole, handleLogout });
};

export default UserHandler;

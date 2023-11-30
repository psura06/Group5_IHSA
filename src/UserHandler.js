import  { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const UserHandler = ({ children }) => {
  const [userRole, setUserRole] = useState(null);
  const navigate = useNavigate();
  useEffect(() => {
    const userRole = localStorage.getItem('role');
    if (userRole) {
      setUserRole(userRole);
    }
  }, []);

  const handleLogout = () => {
    setUserRole(null);
    localStorage.removeItem('role');
    navigate('/');
  };

  return children({ userRole, setUserRole, handleLogout });
};

export default UserHandler;

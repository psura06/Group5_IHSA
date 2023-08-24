import React from 'react';
import NavBar from './NavBar'

const ManageEventsPage = ({ userRole, handleLogout }) => {
  return (
    <div>
     <NavBar userRole={userRole} handleLogout={handleLogout} />
      <h1>ManageEventsPage</h1>
      <p>ManageEventsPage</p>
    </div>
  );
};

export default ManageEventsPage;

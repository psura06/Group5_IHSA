import React, { useState, useEffect } from 'react';
import NavBar from './NavBar';
import axios from 'axios';
import { DataGrid } from '@material-ui/data-grid';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import FormControl from '@material-ui/core/FormControl';
import InputLabel from '@material-ui/core/InputLabel';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import '../stylings/usermanagementPage.css';
import Grid from '@material-ui/core/Grid';

const UserManagementPage = ({ userRole, loggedInUser, handleLogout }) => {
  const [admins, setAdmins] = useState([]);
  const [showAdmins, setShowAdmins] = useState([]);
  const [newUsername, setNewUsername] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [newRole, setNewRole] = useState('');

  const handleUserCreation = () => {
    if (!newUsername || !newPassword || !newRole) return;

    axios.post('/api/createUser', { username: newUsername, password: newPassword, role: newRole })
      .then(() => {
        setNewUsername('');
        setNewPassword('');
        setNewRole('');
        window.location.reload();
      })
      .catch(err => console.error(err));
  };

  const handleMakeAdmin = (username) => {
    axios.put(`/api/makeAdmin/${username}`)
      .then(() => window.location.reload())
      .catch(err => console.error(err));
  };

  const handleRemoveAccess = (username, role) => {
    let endpoint;
    switch (role) {
      case 'admin':
        endpoint = `/api/removeAdmin/${username}`;
        break;
      case 'showadmin':
        endpoint = `/api/removeShowAdmin/${username}`;
        break;
      default:
        console.error(`Invalid role: ${role}`);
        return;
    }

    axios.put(endpoint)
      .then(() => window.location.reload())
      .catch(err => console.error(err));
  };


  useEffect(() => {
    const fetchAdmins = async () => {
      const res = await axios.get('/api/admins');
      const dataWithIds = res.data.filter(admin => admin.username !== loggedInUser)
        .map((admin, index) => ({ ...admin, role: 'admin', id: index + 1 })); // added role: 'admin'
      setAdmins(dataWithIds);
    };
  
    const fetchShowAdmins = async () => {
      const res = await axios.get('/api/showadmins');
      const dataWithIds = res.data
        .map((admin, index) => ({ ...admin, role: 'showadmin', id: index + 1 })); // added role: 'showadmin'
      setShowAdmins(dataWithIds);
    };
  
    fetchAdmins();
    fetchShowAdmins();
  }, [loggedInUser]);
  

  const columnsAdmin = [
    { field: 'id', headerName: 'ID', width: 70 },
    { field: 'username', headerName: 'Username', width: 200 },
    {
      field: 'action',
      headerName: 'Action',
      width: 200,
      renderCell: (params) => (
        <strong>
          {params.row.username !== loggedInUser && (
            <Grid container spacing={2}>
              <Grid item>
                <Button
                  variant="contained"
                  color="secondary"
                  size="small"
                  onClick={() => handleRemoveAccess(params.row.username, params.row.role)}
                >
                  Remove Access
                </Button>
              </Grid>
            </Grid>
          )}
        </strong>
      ),
    },
  ];
  
  const columnsShowAdmin = [
    { field: 'id', headerName: 'ID', width: 70 },
    { field: 'username', headerName: 'Username', width: 200 },
    {
      field: 'action',
      headerName: 'Action',
      width: 300,
      renderCell: (params) => (
        <strong>
          <Grid container spacing={2}>
            <Grid item>
              <Button
                variant="contained"
                color="primary"
                size="small"
                onClick={() => handleMakeAdmin(params.row.username)}
              >
                Make Admin
              </Button>
            </Grid>
            {params.row.username !== loggedInUser && (
              <Grid item>
                <Button
                  variant="contained"
                  color="secondary"
                  size="small"
                  onClick={() => handleRemoveAccess(params.row.username, params.row.role)}
                >
                  Remove Access
                </Button>
              </Grid>
            )}
          </Grid>
        </strong>
      ),
    },
  ];
  
  return (
    <div className="user-management-page">
      <NavBar userRole={userRole} handleLogout={handleLogout} />
      <div className="table-container">
        <h1 className="table-title">Admin Users</h1>
        <DataGrid rows={admins} columns={columnsAdmin} pageSize={5} checkboxSelection />
      </div>
      <div className="table-container">
        <h1 className="table-title">Show Admin Users</h1>
        <DataGrid rows={showAdmins} columns={columnsShowAdmin} pageSize={5} checkboxSelection />
      </div>
      <div className="add-user-container">
        <h1 className="form-title">Add User</h1>
        <div className="add-user-form">
          <TextField label="Username" variant="outlined" value={newUsername} onChange={(e) => setNewUsername(e.target.value)} />
          <TextField label="Password" variant="outlined" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} />
          <FormControl variant="outlined" className="form-control">
            <InputLabel>Role</InputLabel>
            <Select value={newRole} onChange={(e) => setNewRole(e.target.value)}>
              <MenuItem value="">
                <em>None</em>
              </MenuItem>
              <MenuItem value={'admin'}>Admin</MenuItem>
              <MenuItem value={'showadmin'}>Show Admin</MenuItem>
            </Select>
          </FormControl>
          <Button variant="contained" color="primary" className="create-user-button" onClick={handleUserCreation}>Create User</Button>
        </div>
      </div>
    </div>
  );
};



export default UserManagementPage;

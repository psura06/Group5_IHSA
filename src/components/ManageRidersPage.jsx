import React, { useState } from 'react';
import NavBar from './NavBar';
import styled from 'styled-components';
import * as XLSX from 'xlsx';
import ExcelJS from 'exceljs';

const ManageRidersPage = ({ userRole, handleLogout }) => {
  const [selectedClass, setSelectedClass] = useState('');
  const [riderID, setRiderID] = useState('');
  const [riderName, setRiderName] = useState('');
  const [school, setSchool] = useState('');
  const [weight, setWeight] = useState('');
  const [height, setHeight] = useState('');
  const [riderData, setRiderData] = useState({});
  const [editMode, setEditMode] = useState(false);
  const [editRow, setEditRow] = useState(null);

  const classes = [
    'Class 1 Introductory Hunter Seat Equitation',
    'Class 2A Pre-Novice Hunter Seat Equitation',
    'Class 2B Novice Hunter Seat Equitation',
    'Class 3 Limit Hunter Seat Equitation on the Flat',
    'Class 4 Limit Hunter Seat Equitation over Fences',
    'Class 5 Intermediate Hunter Seat Equitation on the Flat',
    'Class 6 Intermediate Hunter Seat Equitation over Fences',
    'Class 7 Open Hunter Seat Equitation on the Flat',
    'Class 8 Open Hunter Seat Equitation over Fences',
    'Class 9 Alumni Hunter Seat Equitation on the Flat',
    'Class 10 Alumni Hunter Seat Equitation over Fences',
    'Class 11 Beginner Western Horsemanship',
    'Class 12A Rookie A Western Horsemanship',
    'Class 12B Rookie B Western Horsemanship',
    'Class 13 Level I Western Horsemanship',
    'Class 14 Level II Western Horsemanship',
    'Class 15 Level II Ranch Riding',
    'Class 16 Open Western Horsemanship',
    'Class 17 Open Reining',
    'Class 18 Alumni Western Horsemanship',
    'Class 19 Alumni Ranch Riding'
  ];

  const handleAddRider = () => {
    if (selectedClass && riderID && riderName && school && weight && height) {
      const newRider = {
        ID: riderID,
        'Rider Name': riderName,
        School: school,
        Weight: weight,
        Height: height,
      };

      const updatedData = { ...riderData };

      if (updatedData[selectedClass]) {
        if (!updatedData[selectedClass].some((rider) => rider.ID === riderID)) {
          updatedData[selectedClass].push(newRider);
        }
      } else {
        updatedData[selectedClass] = [newRider];
      }

      setRiderData(updatedData);

      setSelectedClass('');
      setRiderID('');
      setRiderName('');
      setSchool('');
      setWeight('');
      setHeight('');
    }
  };

  const handleEditRider = (row, classSelection) => {
    setEditMode(true);
    setEditRow(row);
    setSelectedClass(classSelection);
    setRiderID(row.ID);
    setRiderName(row['Rider Name']);
    setSchool(row.School);
    setWeight(row.Weight);
    setHeight(row.Height);
  };

  const handleUpdateRider = () => {
    if (selectedClass && riderID && riderName && school && weight && height) {
      const updatedData = { ...riderData };
  
      if (updatedData[selectedClass]) {
        // Remove the old row
        updatedData[selectedClass] = updatedData[selectedClass].filter((rider) => rider.ID !== editRow.ID);
  
        // Add the updated row
        const updatedRider = {
          ID: riderID,
          'Rider Name': riderName,
          School: school,
          Weight: weight,
          Height: height,
        };
  
        updatedData[selectedClass].push(updatedRider);
      }
  
      setRiderData(updatedData);
  
      // Reset edit mode
      setEditMode(false);
      setEditRow(null);
      setSelectedClass('');
      setRiderID('');
      setRiderName('');
      setSchool('');
      setWeight('');
      setHeight('');
    }
  };
  
  const handleDeleteRider = () => {
    if (selectedClass && editRow) {
      const updatedData = { ...riderData };
  
      if (updatedData[selectedClass]) {
        // Filter out the rider to be deleted
        updatedData[selectedClass] = updatedData[selectedClass].filter((rider) => rider.ID !== editRow.ID);
      }
  
      setRiderData(updatedData);
  
      // Reset edit mode
      setEditMode(false);
      setEditRow(null);
      setSelectedClass('');
      setRiderID('');
      setRiderName('');
      setSchool('');
      setWeight('');
      setHeight('');
    }
  };
  

  const handleDownloadTable = () => {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('RiderData');
  
    worksheet.addRow(['Class', 'ID', 'Rider Name', 'School', 'Weight', 'Height']);
  
    classes.forEach((className) => {
      if (riderData[className]) {
        riderData[className].forEach((rider) => {
          worksheet.addRow([className, rider.ID, rider['Rider Name'], rider.School, rider.Weight, rider.Height]);
        });
      }
    });
  
    workbook.xlsx.writeBuffer().then((buffer) => {
      const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
      const url = window.URL.createObjectURL(blob);
  
      const a = document.createElement('a');
      a.href = url;
      a.download = 'rider_data.xlsx';
      a.click();
  
      window.URL.revokeObjectURL(url);
    });
  };
  
  

  const handleFileUpload = (e) => {
    const file = e.target.files[0];

    if (file) {
      const reader = new FileReader();

      reader.onload = (e) => {
        const data = new Uint8Array(e.target.result);
        const workbook = XLSX.read(data, { type: 'array' });
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];

        const excelData = XLSX.utils.sheet_to_json(worksheet);

        excelData.forEach((row) => {
          const { Class, ID, 'Rider Name': riderName, School, Weight, Height } = row;

          const newRider = {
            ID: ID,
            'Rider Name': riderName,
            School: School,
            Weight: Weight,
            Height: Height, // Assuming Height contains the numeric value in cm
          };

          if (riderData[Class]) {
            riderData[Class].push(newRider);
          } else {
            riderData[Class] = [newRider];
          }
        });

        setRiderData({ ...riderData });
      };

      reader.readAsArrayBuffer(file);
    }
  };

  const allClassesHaveRecords = classes.every((className) => !!riderData[className] && riderData[className].length > 0);

  return (
    <Container>
      <NavBar userRole={userRole} handleLogout={handleLogout} />
      <Heading>Add Rider</Heading>
      <FormContainer>
        <DropdownBox
          value={selectedClass}
          onChange={(e) => setSelectedClass(e.target.value)}
          placeholder="Select a class"
        >
          <option value="" disabled>
            Select a class
          </option>
          {classes.map((className, index) => (
            <option key={index} value={className}>
              {className}
            </option>
          ))}
        </DropdownBox>
        <InputBox
          type="text"
          placeholder="Enter Rider ID"
          value={riderID}
          onChange={(e) => setRiderID(e.target.value)}
        />
        <InputBox
          type="text"
          placeholder="Enter Rider Name"
          value={riderName}
          onChange={(e) => setRiderName(e.target.value)}
        />
        <InputBox
          type="text"
          placeholder="Enter School"
          value={school}
          onChange={(e) => setSchool(e.target.value)}
        />
        <InputBox
          type="text"
          placeholder="Enter Weight"
          value={weight}
          onChange={(e) => setWeight(e.target.value)}
        />
        <InputBox
          type="text"
          placeholder="Enter Height in cm"
          value={height}
          onChange={(e) => setHeight(e.target.value)}
        />
        {editMode ? (
          <div>
            <Button onClick={handleUpdateRider}>Update</Button>
            <Button onClick={() => setEditMode(false)}>Cancel</Button>
          </div>
        ) : (
          <Button onClick={handleAddRider}>Add</Button>
        )}
        <DownloadButton
      onClick={handleDownloadTable}
      >
          Download Table
        </DownloadButton>
        <label>
          Upload Excel File:
          <input type="file" accept=".xlsx" onChange={handleFileUpload} />
        </label>
      </FormContainer>
      {classes.map((className, index) => (
        <React.Fragment key={index}>
          {riderData[className] && (
            <TableContainer>
              <ClassTable>
                <thead>
                  <tr>
                    <th colSpan="8">{className}</th>
                  </tr>
                  <tr>
                    <th>ID</th>
                    <th>Rider Name</th>
                    <th>School</th>
                    <th>Weight</th>
                    <th>Height (cm)</th>
                    <th>Edit</th>
                    <th>Delete</th>
                  </tr>
                </thead>
                <tbody>
                  {riderData[className].map((rider, riderIndex) => (
                    <tr key={riderIndex}>
                      <td>{rider.ID}</td>
                      <td>{rider['Rider Name']}</td>
                      <td>{rider.School}</td>
                      <td>{rider.Weight}</td>
                      <td>{rider.Height}</td>
                      <td>
                        <Button onClick={() => handleEditRider(rider, className)}>Edit</Button>
                      </td>
                      <td>
                        <Button onClick={() => handleDeleteRider(rider)}>Delete</Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </ClassTable>
            </TableContainer>
          )}
        </React.Fragment>
      ))}
    </Container>
  );
};

const Container = styled.div`
  padding: 20px;
  text-align: center;
`;

const Heading = styled.h1`
  font-size: 24px;
  font-weight: bold;
`;

const FormContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 10px;
  align-items: center;
`;

const DropdownBox = styled.select`
  padding: 5px;
  border-radius: 5px;
`;

const InputBox = styled.input`
  padding: 5px;
  border-radius: 5px;
`;

const Button = styled.button`
  padding: 5px;
  border-radius: 5px;
  background-color: #007bff;
  color: white;
  border: none;
  cursor: pointer;
`;

const DownloadButton = styled.button`
  padding: 5px;
  border-radius: 5px;
  background-color: ${(props) => (props.disabled ? 'gray' : '#007bff')};
  color: white;
  border: none;
  cursor: ${(props) => (props.disabled ? 'not-allowed' : 'pointer')};
`;

const TableContainer = styled.div`
  margin-top: 20px;
`;

const ClassTable = styled.table`
  width: 100%;
  border-collapse: collapse;
  th,
  td {
    border: 1px solid #ddd;
    padding: 8px;
    text-align: center;
  }
  th {
    background-color: #f2f2f2;
  }
`;

export default ManageRidersPage;

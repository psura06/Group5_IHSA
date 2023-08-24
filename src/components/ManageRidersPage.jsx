import React, { useState } from 'react';
import NavBar from './NavBar';
import styled from 'styled-components';
import * as XLSX from 'xlsx';
import ExcelJS from 'exceljs';

const ManageRidersPage = ({ userRole, handleLogout }) => {
  const [selectedClass, setSelectedClass] = useState('');
  const [riderName, setRiderName] = useState('');
  const [school, setSchool] = useState('');
  const [riderData, setRiderData] = useState({});

  const classes = [
    'Class 1 - Reining',
    'Class 2 - Level I (Sec. A)',
    'Class 3 - Ranch Riding',
    'Class 4 - Level I (Sec. B)',
    'Class 5 - Open Horsemanship',
    'Class 6 - Rookie B (Sec. A)',
    'Class 7 - Level II (Sec. A)',
    'Class 8 - Level I (Sec. C)',
    'Class 9 - Rookie B (Sec. B)',
    'Class 10 - Level II (Sec. B)',
    'Class 11 - Rookie B (Sec. C)',
    'Class 12 - Beginner (Sec. A)',
    'Class 13 - Rookie B (Sec. D)',
    'Class 14 - Beginner (Sec. B)',
    'Class 15 - Rookie A',
    'Class 16 - Beginner (Sec. C)',
    'Class 17 - Alumni',
    'Class 18 - Beginner (Sec. D)',
  ];

  const handleAddRider = () => {
    if (selectedClass && riderName && school) {
      // Create a new rider object
      const newRider = {
        'Rider Name': riderName, // Change "Name" to "Rider Name"
        School: school, // No change needed for "School"
      };

      // Create a copy of the riderData object
      const updatedData = { ...riderData };

      // Check if the class already exists in the riderData
      if (updatedData[selectedClass]) {
        // Check if the same rider data already exists, and if not, add it
        if (!updatedData[selectedClass].some((rider) => rider['Rider Name'] === riderName && rider.School === school)) {
          updatedData[selectedClass].push(newRider);
        }
      } else {
        // If the class does not exist, create a new array
        updatedData[selectedClass] = [newRider];
      }

      // Update the state with the new riderData
      setRiderData(updatedData);

      // Clear input fields
      setSelectedClass('');
      setRiderName('');
      setSchool('');
    }
  };

  const handleDownloadTable = () => {
    // Create a new Excel workbook
    const workbook = new ExcelJS.Workbook();

    // Add a worksheet
    const worksheet = workbook.addWorksheet('RiderData');

    // Add headers to the worksheet
    worksheet.addRow(['Class', 'Rider Name', 'School']); // Change "Name" to "Rider Name"

    // Populate the worksheet with rider data
    classes.forEach((className) => {
      if (riderData[className]) {
        riderData[className].forEach((rider) => {
          worksheet.addRow([className, rider['Rider Name'], rider.School]); // Change "Name" to "Rider Name"
        });
      }
    });

    // Create a Blob containing the Excel file data
    workbook.xlsx.writeBuffer().then((buffer) => {
      const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
      const url = window.URL.createObjectURL(blob);

      // Create a temporary anchor element to trigger the download
      const a = document.createElement('a');
      a.href = url;
      a.download = 'rider_data.xlsx';
      a.click();

      // Clean up
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

        // Convert the worksheet data into an array of objects
        const excelData = XLSX.utils.sheet_to_json(worksheet);

        // Process the data and update the riderData state
        excelData.forEach((row) => {
          const { Class, School } = row; // Change "Name" to "Rider Name"
          const newRider = { 'Rider Name': row['Rider Name'], School: School }; // Change "Name" to "Rider Name"

          if (riderData[Class]) {
            riderData[Class].push(newRider);
          } else {
            riderData[Class] = [newRider];
          }
        });

        // Update the state with the new riderData
        setRiderData({ ...riderData });
      };

      reader.readAsArrayBuffer(file);
    }
  };

  // Check if all classes have at least one record
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
        <Button onClick={handleAddRider}>Add</Button>
        <DownloadButton
          onClick={handleDownloadTable}
          disabled={!allClassesHaveRecords}
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
                    <th colSpan="2">{className}</th>
                  </tr>
                  <tr>
                    <th>Rider Name</th>
                    <th>School</th>
                  </tr>
                </thead>
                <tbody>
                  {riderData[className].map((rider, riderIndex) => (
                    <tr key={riderIndex}>
                      <td>{rider['Rider Name']}</td>
                      <td>{rider.School}</td>
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

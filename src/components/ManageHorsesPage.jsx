import React, { useState } from 'react';
import NavBar from './NavBar';
import styled from 'styled-components';
import * as XLSX from 'xlsx';
import ExcelJS from 'exceljs';

const ManageHorsesPage = ({ userRole, handleLogout }) => {
  const [selectedClass, setSelectedClass] = useState('');
  const [horseName, setHorseName] = useState('');
  const [provider, setProvider] = useState('');
  const [horseData, setHorseData] = useState({});

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

  const handleAddHorse = () => {
    if (selectedClass && horseName && provider) {
      // Create a new horse object with "Horse Name"
      const newHorse = {
        'Horse Name': horseName, // Change "name" to "Horse Name"
        Provider: provider, // Keep "Provider" as it is
      };

      // Create a copy of the horseData object
      const updatedData = { ...horseData };

      // Check if the class already exists in the horseData
      if (updatedData[selectedClass]) {
        // Check if the same horse data already exists, and if not, add it
        if (!updatedData[selectedClass].some((horse) => horse['Horse Name'] === horseName && horse.Provider === provider)) {
          updatedData[selectedClass].push(newHorse);
        }
      } else {
        // If the class does not exist, create a new array
        updatedData[selectedClass] = [newHorse];
      }

      // Update the state with the new horseData
      setHorseData(updatedData);

      // Clear input fields
      setSelectedClass('');
      setHorseName('');
      setProvider('');
    }
  };

  const handleDownloadTable = () => {
    // Create a new Excel workbook
    const workbook = new ExcelJS.Workbook();

    // Add a worksheet
    const worksheet = workbook.addWorksheet('HorseData');

    // Add headers to the worksheet
    worksheet.addRow(['Class', 'Horse Name', 'Provider']); // Change "Name" to "Horse Name"

    // Populate the worksheet with horse data
    classes.forEach((className) => {
      if (horseData[className]) {
        horseData[className].forEach((horse) => {
          worksheet.addRow([className, horse['Horse Name'], horse.Provider]); // Change "name" to "Horse Name"
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
      a.download = 'horse_data.xlsx';
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

        // Process the data and update the horseData state
        excelData.forEach((row) => {
          const { Class,  Provider } = row; // Change "Name" to "Horse Name"
          const newHorse = { 'Horse Name': row['Horse Name'], Provider: Provider }; // Change "name" to "Horse Name"

          if (horseData[Class]) {
            horseData[Class].push(newHorse);
          } else {
            horseData[Class] = [newHorse];
          }
        });

        // Update the state with the new horseData
        setHorseData({ ...horseData });
      };

      reader.readAsArrayBuffer(file);
    }
  };

  // Check if all classes have at least one record
  const allClassesHaveRecords = classes.every((className) => !!horseData[className] && horseData[className].length > 0);

  return (
    <Container>
      <NavBar userRole={userRole} handleLogout={handleLogout} />
      <Heading>Add Horse</Heading>
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
          placeholder="Enter Horse Name"
          value={horseName}
          onChange={(e) => setHorseName(e.target.value)}
        />
        <InputBox
          type="text"
          placeholder="Enter Provider"
          value={provider}
          onChange={(e) => setProvider(e.target.value)}
        />
        <Button onClick={handleAddHorse}>Add</Button>
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
          {horseData[className] && (
            <TableContainer>
              <ClassTable>
                <thead>
                  <tr>
                    <th colSpan="2">{className}</th>
                  </tr>
                  <tr>
                    <th>Horse Name</th> {/* Change "Name" to "Horse Name" */}
                    <th>Provider</th>
                  </tr>
                </thead>
                <tbody>
                  {horseData[className].map((horse, horseIndex) => (
                    <tr key={horseIndex}>
                      <td>{horse['Horse Name']}</td> {/* Change "name" to "Horse Name" */}
                      <td>{horse.Provider}</td> {/* Keep "Provider" as it is */}
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

export default ManageHorsesPage;

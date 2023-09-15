import React, { useState } from 'react';
import NavBar from './NavBar';
import styled from 'styled-components';
import * as XLSX from 'xlsx';
import ExcelJS from 'exceljs';

const ManageHorsesPage = ({ userRole, handleLogout }) => {
  const [selectedClass, setSelectedClass] = useState('');
  const [horseName, setHorseName] = useState('');
  const [provider, setProvider] = useState('');
  const [maxWeight, setMaxWeight] = useState('');
  const [description, setDescription] = useState('');
  const [reign, setReign] = useState('');
  const [spurs, setSpurs] = useState('');
  const [horseData, setHorseData] = useState({});

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

  // Define options for the Reign and Spurs dropdowns
  const reignOptions = ['1 Hand', '2 Hands'];
  const spursOptions = ['Ball', 'Optional', 'Optional Ball', 'Optional Rowel', 'Rowel', 'Rowel or Ball'];

  const handleAddHorse = () => {
    if (selectedClass && horseName && provider && maxWeight && description && reign && spurs) {
      const newHorse = {
        'Horse Name': horseName,
        Provider: provider,
        'Max Weight': maxWeight,
        Description: description,
        Reign: reign,
        Spurs: spurs,
      };

      const updatedData = { ...horseData };

      if (updatedData[selectedClass]) {
        if (!updatedData[selectedClass].some((horse) => horse['Horse Name'] === horseName && horse.Provider === provider)) {
          updatedData[selectedClass].push(newHorse);
        }
      } else {
        updatedData[selectedClass] = [newHorse];
      }

      setHorseData(updatedData);

      setSelectedClass('');
      setHorseName('');
      setProvider('');
      setMaxWeight('');
      setDescription('');
      setReign('');
      setSpurs('');
    }
  };

  const handleDownloadTable = () => {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('HorseData');

    worksheet.addRow(['Class', 'Horse Name', 'Provider', 'Max Weight', 'Description', 'Reign', 'Spurs']);

    classes.forEach((className) => {
      if (horseData[className]) {
        horseData[className].forEach((horse) => {
          worksheet.addRow([className, horse['Horse Name'], horse.Provider, horse['Max Weight'], horse.Description, horse.Reign, horse.Spurs]);
        });
      }
    });

    workbook.xlsx.writeBuffer().then((buffer) => {
      const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
      const url = window.URL.createObjectURL(blob);

      const a = document.createElement('a');
      a.href = url;
      a.download = 'horse_data.xlsx';
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
          const { Class, Provider, 'Horse Name': horseName, 'Max Weight': maxWeight, Description, Reign, Spurs } = row;
          const newHorse = { 'Horse Name': horseName, Provider, 'Max Weight': maxWeight, Description, Reign, Spurs };

          if (horseData[Class]) {
            horseData[Class].push(newHorse);
          } else {
            horseData[Class] = [newHorse];
          }
        });

        setHorseData({ ...horseData });
      };

      reader.readAsArrayBuffer(file);
    }
  };

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
        <InputBox
          type="text"
          placeholder="Enter Max Weight"
          value={maxWeight}
          onChange={(e) => setMaxWeight(e.target.value)}
        />
        <InputBox
          type="text"
          placeholder="Enter Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
        <DropdownBox
          value={reign}
          onChange={(e) => setReign(e.target.value)}
          placeholder="Select Reign"
        >
          <option value="" disabled>
            Select Reign
          </option>
          {reignOptions.map((option, index) => (
            <option key={index} value={option}>
              {option}
            </option>
          ))}
        </DropdownBox>
        <DropdownBox
          value={spurs}
          onChange={(e) => setSpurs(e.target.value)}
          placeholder="Select Spurs"
        >
          <option value="" disabled>
            Select Spurs
          </option>
          {spursOptions.map((option, index) => (
            <option key={index} value={option}>
              {option}
            </option>
          ))}
        </DropdownBox>
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
                    <th colSpan="7">{className}</th>
                  </tr>
                  <tr>
                    <th>Horse Name</th>
                    <th>Provider</th>
                    <th>Max Weight</th>
                    <th>Description</th>
                    <th>Reign</th>
                    <th>Spurs</th>
                  </tr>
                </thead>
                <tbody>
                  {horseData[className].map((horse, horseIndex) => (
                    <tr key={horseIndex}>
                      <td>{horse['Horse Name']}</td>
                      <td>{horse.Provider}</td>
                      <td>{horse['Max Weight']}</td>
                      <td>{horse.Description}</td>
                      <td>{horse.Reign}</td>
                      <td>{horse.Spurs}</td>
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

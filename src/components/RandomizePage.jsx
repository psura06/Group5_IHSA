import React, { useState } from 'react';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import ExcelJS from 'exceljs';
import '../stylings/randomizePage.css';
import NavBar from './NavBar';
import { Table } from 'semantic-ui-react';

const RandomizePage = ({ userRole, handleLogout }) => {
  const [ridersFile, setRidersFile] = useState(null);
  const [horsesFile, setHorsesFile] = useState(null);
  const [tableData, setTableData] = useState([]);
  const [ridersFileUploaded, setRidersFileUploaded] = useState(false);
  const [horsesFileUploaded, setHorsesFileUploaded] = useState(false);

  const parseExcelFile = (file) => {
    return new Promise((resolve, reject) => {
      const fileReader = new FileReader();
      fileReader.readAsArrayBuffer(file);

      fileReader.onload = (e) => {
        const bufferArray = e.target.result;
        const wb = XLSX.read(bufferArray, { type: 'buffer' });
        const wsname = wb.SheetNames[0];
        const ws = wb.Sheets[wsname];
        const data = XLSX.utils.sheet_to_json(ws);
        resolve(data);
      };

      fileReader.onerror = (error) => {
        reject(error);
      };
    });
  };

  const handleRidersFileChange = async (e) => {
    const riders = await parseExcelFile(e.target.files[0]);
    setRidersFile(riders);
    setRidersFileUploaded(true);
  };

  const handleHorsesFileChange = async (e) => {
    const horses = await parseExcelFile(e.target.files[0]);
    setHorsesFile(horses);
    setHorsesFileUploaded(true);
  };

  const handleRandomizeClick = async () => {
    if (!ridersFile || !horsesFile) {
      console.error('Both riders and horses files must be uploaded');
      return;
    }

    try {
      // Ensure that the data is parsed correctly
      const parsedRiders = JSON.parse(JSON.stringify(ridersFile));
      const parsedHorses = JSON.parse(JSON.stringify(horsesFile));

      // Extract class names from filtered riders and horses data
      const riderClassNames = [...new Set(parsedRiders.map((rider) => rider['Class']))]
        .filter(Boolean); // Filter out undefined or empty class names
      const horseClassNames = [...new Set(parsedHorses.map((horse) => horse['Class']))]
        .filter(Boolean); // Filter out undefined or empty class names

      console.log('Rider Class Names:', riderClassNames);
      console.log('Horse Class Names:', horseClassNames);

      // Combine all class names from both datasets
      const allClassNames = [...new Set([...riderClassNames, ...horseClassNames])];

      console.log('All Class Names:', allClassNames);

      let results = [];
      let showClassNumber = 1;

      for (let classKey of allClassNames) {
        let ridersInClass = parsedRiders.filter((rider) => rider['Class'] === classKey) || [];
        let horsesInClass = parsedHorses.filter((horse) => horse['Class'] === classKey) || [];

        console.log('Class Name:', classKey);
        console.log('Riders Count:', ridersInClass.length);
        console.log('Horses Count:', horsesInClass.length);

        let classResult = [];
        let uniqueHorsesUsed = new Set();
        let overweightTRiders = [];
        let underweightTRiders = [];

        for (let rider of ridersInClass) {
          // Check if the rider is overweight T or underweight T
          if (rider['OverWeight'] === 'T') {
            underweightTRiders.push(rider);
          } else {
            overweightTRiders.push(rider);
          }
        }

        // Assign horses for underweight T riders
        for (let rider of underweightTRiders) {
          // Check if there are eligible "F" horses
          let availableHorses = horsesInClass.filter(
            (horse) => horse['UnderWeight'] === 'F'
          );

          // Filter out horses already assigned to overweight T riders
          availableHorses = availableHorses.filter(
            (horse) => !uniqueHorsesUsed.has(horse['Horse Name'])
          );

          if (availableHorses.length > 0) {
            // Randomly select an "F" horse
            const randomIndex = Math.floor(Math.random() * availableHorses.length);
            const horse = availableHorses[randomIndex];

            classResult.push({
              Number: rider['ID'] || '',
              'Rider Name': rider['Rider Name'] || '',
              School: rider['School'] || '',
              'Draw Order': classResult.length + 1,
              'Horse Name': horse['Horse Name'] || '',
            });

            uniqueHorsesUsed.add(horse['Horse Name']);
          }
        }

        // Assign horses for overweight T riders
        for (let rider of overweightTRiders) {
          // Check if there are eligible "F" or "T" horses
          let availableHorses = horsesInClass.filter(
            (horse) => horse['UnderWeight'] === 'F' || horse['UnderWeight'] === 'T'
          );

          // Filter out horses already assigned to other riders
          availableHorses = availableHorses.filter(
            (horse) => !uniqueHorsesUsed.has(horse['Horse Name'])
          );

          if (availableHorses.length > 0) {
            // Randomly select a horse (either "F" or "T")
            const randomIndex = Math.floor(Math.random() * availableHorses.length);
            const horse = availableHorses[randomIndex];

            classResult.push({
              Number: rider['ID'] || '',
              'Rider Name': rider['Rider Name'] || '',
              School: rider['School'] || '',
              'Draw Order': classResult.length + 1,
              'Horse Name': horse['Horse Name'] || '',
            });

            uniqueHorsesUsed.add(horse['Horse Name']);
          }
        }

        results.push({
          className: `Show Class ${showClassNumber} ${classKey}`,
          data: classResult,
        });
        showClassNumber++;
      }

      console.log('Results:', results);

      setTableData(results);
    } catch (error) {
      console.error('Error randomizing:', error);
    }
  };

  const handleDownloadTable = async () => {
    if (tableData.length === 0) {
      console.error('Table is empty, cannot download');
      return;
    }
  
    // Create a new ExcelJS workbook
    const workbook = new ExcelJS.Workbook();
  
    // Create a single worksheet for all classes
    const worksheet = workbook.addWorksheet('Randomized Results');
  
    // Add data from all classes to the worksheet
    tableData.forEach((result, index) => {
      // Add the class name as a merged cell
      worksheet.addRow([result.className]);
      worksheet.mergeCells(worksheet.lastRow.number, 1, worksheet.lastRow.number, 6);
  
      // Add header row for columns
      worksheet.addRow(['Number', 'Rider Name', 'School', 'Draw Order', 'Horse Name']);
  
      // Add class data
      result.data.forEach((data) => {
        worksheet.addRow([
          data.Number,
          data['Rider Name'],
          data.School,
          data['Draw Order'],
          data['Horse Name'],
        ]);
      });
  
      // Add an empty row between classes except for the last class
      if (index < tableData.length - 1) {
        worksheet.addRow([]);
      }
    });
  
    // Generate the Excel file
    const blob = await workbook.xlsx.writeBuffer();
    saveAs(new Blob([blob]), 'Randomized_Results.xlsx');
  };
  
  return (
    <div>
      <NavBar userRole={userRole} handleLogout={handleLogout} />
      <div className="randomizePage">
        <div className="transparentCard">
          <h1>Riders and Horses List</h1>
          <div className="uploadCard">
            <h2>Upload Riders</h2>
            <button onClick={() => document.getElementById('ridersInput').click()} className="chooseFileButton">
              Choose File
            </button>
            <input id="ridersInput" type="file" onChange={handleRidersFileChange} hidden />
            {ridersFileUploaded && <p>File uploaded successfully</p>}
            <h2>Upload Horses</h2>
            <button onClick={() => document.getElementById('horsesInput').click()} className="chooseFileButton">
              Choose File
            </button>
            <input id="horsesInput" type="file" onChange={handleHorsesFileChange} hidden />
            {horsesFileUploaded && <p>File uploaded successfully</p>}
          </div>
          <button className="randomizeButton" onClick={handleRandomizeClick}>
            RANDOMIZE
          </button>
          <button className="downloadButton" onClick={handleDownloadTable}>
            DOWNLOAD TABLE
          </button>
        </div>
        <div className="resultsContainer">
          {/* Display the tables here */}
          <div className="resultsTableContainer">
            {tableData.map((result, index) => (
              <div key={index} className="resultsTable">
                <h2>{result.className}</h2>
                <Table celled>
                  <Table.Header>
                    <Table.Row>
                      <Table.HeaderCell>Number</Table.HeaderCell>
                      <Table.HeaderCell>Rider Name</Table.HeaderCell>
                      <Table.HeaderCell>School</Table.HeaderCell>
                      <Table.HeaderCell>Draw Order</Table.HeaderCell>
                      <Table.HeaderCell>Horse Name</Table.HeaderCell>
                    </Table.Row>
                  </Table.Header>
                  <Table.Body>
                    {result.data.map((data, dataIndex) => (
                      <Table.Row key={dataIndex}>
                        <Table.Cell>{data.Number}</Table.Cell>
                        <Table.Cell>{data['Rider Name']}</Table.Cell>
                        <Table.Cell>{data.School}</Table.Cell>
                        <Table.Cell>{data['Draw Order']}</Table.Cell>
                        <Table.Cell>{data['Horse Name']}</Table.Cell>
                      </Table.Row>
                    ))}
                  </Table.Body>
                </Table>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default RandomizePage;

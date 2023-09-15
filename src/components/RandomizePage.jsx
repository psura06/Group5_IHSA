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

      // Extract class names from riders and horses data
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
      for (let classKey of allClassNames) {
        let ridersInClass = parsedRiders.filter((rider) => rider['Class'] === classKey) || [];
        let horsesInClass = parsedHorses.filter((horse) => horse['Class'] === classKey) || [];

        console.log('Class Name:', classKey);
        console.log('Riders Count:', ridersInClass.length);
        console.log('Horses Count:', horsesInClass.length);

        // Filter horses based on MaxWeight >= Weight of the rider
        ridersInClass.sort(() => Math.random() - 0.5);
        horsesInClass.sort((a, b) => a['MaxWeight'] - b['MaxWeight']); // Sort horses by MaxWeight

        console.log('Filtered Riders Count:', ridersInClass.length);
        console.log('Filtered Horses Count:', horsesInClass.length);

        let classResult = [];
        let uniqueHorsesUsed = new Set();

        for (let rider of ridersInClass) {
          let horse = horsesInClass.find(
            (h) => !uniqueHorsesUsed.has(h['Horse Name']) && h['MaxWeight'] >= rider['Weight']
          );

          if (!horse) {
            // If no unique horse matches the condition, get the first available horse
            horse = horsesInClass.find((h) => h['MaxWeight'] >= rider['Weight']);
          }

          if (horse) {
            classResult.push({
              Placing: classResult.length + 1,
              Number: rider['ID'] || '', // Use the 'ID' field from your Excel file
              'Rider Name': rider['Rider Name'] || '', // Use the 'Rider Name' field from your Excel file
              School: rider['School'] || '', // Use the 'School' field from your Excel file
              'Draw Order': classResult.length + 1, // Changed the draw order logic
              'Horse Name': horse['Horse Name'] || '',
              'Horse Provider': horse['Provider'] || '',
            });

            uniqueHorsesUsed.add(horse['Horse Name']);
          }
        }

        results.push({
          className: classKey || '',
          data: classResult,
        });
      }

      console.log('Results:', results);

      setTableData(results);
    } catch (error) {
      console.error('Error while processing data:', error);
    }
  };

  const handleDownloadTable = async () => {
    if (tableData.length === 0) {
      console.error('Table is empty, cannot download');
      return;
    }

    // Create a new ExcelJS workbook
    const workbook = new ExcelJS.Workbook();

    tableData.forEach((result) => {
      const worksheet = workbook.addWorksheet(result.className); // Create a worksheet for each class

      // Define the table header
      const header = [
        'Placing',
        'Number',
        'Rider Name',
        'School',
        'Draw Order',
        'Horse Name',
        'Horse Provider',
      ];

      // Add the header row to the worksheet
      worksheet.addRow(header);

      result.data.forEach((data) => {
        worksheet.addRow([
          data.Placing,
          data.Number,
          data['Rider Name'],
          data.School,
          data['Draw Order'],
          data['Horse Name'],
          data['Horse Provider'],
        ]);
      });
    });

    // Generate the Excel file
    const blob = await workbook.xlsx.writeBuffer();
    saveAs(new Blob([blob]), 'output.xlsx');
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
          {tableData.map((result, index) => (
            <div key={index} className="resultsTable">
              <h2>{result.className}</h2>
              <Table celled>
                <Table.Header>
                  <Table.Row>
                    <Table.HeaderCell>Placing</Table.HeaderCell>
                    <Table.HeaderCell>Number</Table.HeaderCell>
                    <Table.HeaderCell>Rider Name</Table.HeaderCell>
                    <Table.HeaderCell>School</Table.HeaderCell>
                    <Table.HeaderCell>Draw Order</Table.HeaderCell>
                    <Table.HeaderCell>Horse Name</Table.HeaderCell>
                    <Table.HeaderCell>Horse Provider</Table.HeaderCell>
                  </Table.Row>
                </Table.Header>
                <Table.Body>
                  {result.data.map((data, dataIndex) => (
                    <Table.Row key={dataIndex}>
                      <Table.Cell>{data.Placing}</Table.Cell>
                      <Table.Cell>{data.Number}</Table.Cell>
                      <Table.Cell>{data['Rider Name']}</Table.Cell>
                      <Table.Cell>{data.School}</Table.Cell>
                      <Table.Cell>{data['Draw Order']}</Table.Cell>
                      <Table.Cell>{data['Horse Name']}</Table.Cell>
                      <Table.Cell>{data['Horse Provider']}</Table.Cell>
                    </Table.Row>
                  ))}
                </Table.Body>
              </Table>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default RandomizePage;

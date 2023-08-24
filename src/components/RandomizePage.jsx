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

    let ridersClasses = {};
    let horsesClasses = {};
    for (let rider of ridersFile) {
      if (!ridersClasses[rider['Class']]) {
        ridersClasses[rider['Class']] = [];
      }
      ridersClasses[rider['Class']].push(rider);
    }
    for (let horse of horsesFile) {
      if (!horsesClasses[horse['Class']]) {
        horsesClasses[horse['Class']] = [];
      }
      horsesClasses[horse['Class']].push(horse);
    }

    let results = [];
    for (let classKey in ridersClasses) {
      let ridersInClass = JSON.parse(JSON.stringify(ridersClasses[classKey]));
      let horsesInClass = JSON.parse(JSON.stringify(horsesClasses[classKey]));

      ridersInClass.sort(() => Math.random() - 0.5);
      horsesInClass.sort(() => Math.random() - 0.5);

      let classResult = ridersInClass.map((rider, index) => ({
        Placing: index + 1,
        Number: Math.floor(Math.random() * 1000),
        'Rider Name': rider['Rider Name'],
        School: rider['School'],
        'Draw Order': index + 1, // Changed the draw order logic
        'Horse Name': horsesInClass[index % horsesInClass.length]['Horse Name'], // Fixed the horse assignment logic
        'Horse Provider': horsesInClass[index % horsesInClass.length]['Provider'], // Fixed the horse assignment logic
      }));

      results.push({
        className: classKey,
        data: classResult,
      });
    }

    setTableData(results);
  };

  const handleDownloadTable = async () => {
    if (tableData.length === 0) {
      console.error('Table is empty, cannot download');
      return;
    }

    // Create a new ExcelJS workbook
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Sheet1');

    // Define the table header
    const header = [
      'Class', // Add Class column
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

    // Add data rows to the worksheet
    tableData.forEach((result) => {
      result.data.forEach((data) => {
        worksheet.addRow([
          result.className, // Add Class value
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
          <div className="resultsTableContainer">
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
                    {result.data.map((data, index) => (
                      <Table.Row key={index}>
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
    </div>
  );
};

export default RandomizePage;

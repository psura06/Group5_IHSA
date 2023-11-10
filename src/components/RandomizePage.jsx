import React, { useState } from 'react';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import ExcelJS from 'exceljs';
import '../stylings/randomizePage.css';
import NavBar from './NavBar';
import { Button, message } from 'antd';
import { Table } from 'semantic-ui-react';
import { useTableData } from './TableDataContext';

const RandomizePage = ({ userRole, handleLogout }) => {
  const [ridersFile, setRidersFile] = useState(null);
  const [horsesFile, setHorsesFile] = useState(null);
  const { tableData, updateTableData } = useTableData();
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
    message.success('Rider file uploaded successfully');
  };

  const handleHorsesFileChange = async (e) => {
    const horses = await parseExcelFile(e.target.files[0]);
    setHorsesFile(horses);
    setHorsesFileUploaded(true);
    message.success('Horse file uploaded successfully');
  };

  const handleRandomizeClick = async () => {
    if (!ridersFile || !horsesFile) {
      message.error('Both riders and horses files must be uploaded');
      return;
    }
  
    try {
      const parsedRiders = JSON.parse(JSON.stringify(ridersFile));
      const parsedHorses = JSON.parse(JSON.stringify(horsesFile));
  
      const riderClassNames = [...new Set(parsedRiders.map((rider) => rider['Class']))].filter(Boolean);
      const horseClassNames = [...new Set(parsedHorses.map((horse) => horse['Class']))].filter(Boolean);
  
      console.log('Rider Class Names:', riderClassNames);
      console.log('Horse Class Names:', horseClassNames);
  
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
  
        // Priority 1: OverHeight T and OverWeight T should be assigned to UnderHeight F and UnderWeight F
        for (let rider of ridersInClass) {
          if (rider['OverHeight'] === 'T' && rider['OverWeight'] === 'T') {
            let availableHorses = horsesInClass.filter(
              (horse) => horse['UnderHeight'] === 'F' && horse['UnderWeight'] === 'F'
            );
  
            availableHorses = availableHorses.filter(
              (horse) => !uniqueHorsesUsed.has(horse['Horse Name'])
            );
  
            if (availableHorses.length > 0) {
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
        }
  
        // Priority 2: OverHeight T and OverWeight F should be assigned to UnderHeight F and UnderWeight T or UnderHeight F and UnderWeight F
        for (let rider of ridersInClass) {
          if (rider['OverHeight'] === 'T' && rider['OverWeight'] === 'F') {
            let availableHorses = horsesInClass.filter(
              (horse) => (horse['UnderHeight'] === 'F' && horse['UnderWeight'] === 'T') ||
                (horse['UnderHeight'] === 'F' && horse['UnderWeight'] === 'F')
            );
  
            availableHorses = availableHorses.filter(
              (horse) => !uniqueHorsesUsed.has(horse['Horse Name'])
            );
  
            if (availableHorses.length > 0) {
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
        }
  
        // Priority 2: OverHeight F and OverWeight T should be assigned to UnderHeight T and UnderWeight F or UnderHeight F and UnderWeight F
        for (let rider of ridersInClass) {
          if (rider['OverHeight'] === 'F' && rider['OverWeight'] === 'T') {
            let availableHorses = horsesInClass.filter(
              (horse) => (horse['UnderHeight'] === 'T' && horse['UnderWeight'] === 'F') ||
                (horse['UnderHeight'] === 'F' && horse['UnderWeight'] === 'F')
            );
  
            availableHorses = availableHorses.filter(
              (horse) => !uniqueHorsesUsed.has(horse['Horse Name'])
            );
  
            if (availableHorses.length > 0) {
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
        }
  
        // Priority 3: Assign remaining riders with any suitable horses
        for (let rider of ridersInClass) {
          if (rider['OverHeight'] === 'F' && rider['OverWeight'] === 'F') {
            let availableHorses = horsesInClass.filter(
              (horse) => (horse['UnderHeight'] === 'F' && horse['UnderWeight'] === 'T') ||
                (horse['UnderHeight'] === 'T' && horse['UnderWeight'] === 'F') ||
                (horse['UnderHeight'] === 'F' && horse['UnderWeight'] === 'F') ||
                (horse['UnderHeight'] === 'T' && horse['UnderWeight'] === 'T')
            );
  
            availableHorses = availableHorses.filter(
              (horse) => !uniqueHorsesUsed.has(horse['Horse Name'])
            );
  
            if (availableHorses.length > 0) {
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
        }
  
        results.push({
          className: `Show Class ${showClassNumber} ${classKey}`,
          data: classResult,
        });
  
        showClassNumber++;
      }
  
      updateTableData(results);
  
      message.success('Randomization completed successfully');
    } catch (error) {
      message.error('Error randomizing:', error);
    }
  };
  
  const handleDownloadTable = async () => {
    if (tableData.length === 0) {
      message.error('Table is empty, cannot download');
      return;
    }

    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Randomized Results');

    tableData.forEach((result, index) => {
      worksheet.addRow([result.className]);
      worksheet.mergeCells(worksheet.lastRow.number, 1, worksheet.lastRow.number, 6);
      worksheet.addRow(['Number', 'Rider Name', 'School', 'Draw Order', 'Horse Name']);

      result.data.forEach((data) => {
        worksheet.addRow([
          data.Number,
          data['Rider Name'],
          data.School,
          data['Draw Order'],
          data['Horse Name'],
        ]);
      });

      if (index < tableData.length - 1) {
        worksheet.addRow([]);
      }
    });

    const blob = await workbook.xlsx.writeBuffer();
    saveAs(new Blob([blob]), 'Randomized_Results.xlsx');
  };

  const handleClearData = () => {
    setRidersFile(null);
    setHorsesFile(null);
    updateTableData([]);
    setRidersFileUploaded(false);
    setHorsesFileUploaded(false);
    const ridersInput = document.getElementById('ridersInput');
    const horsesInput = document.getElementById('horsesInput');
    if (ridersInput && horsesInput) {
      ridersInput.value = ''; // Clear the riders file input
      horsesInput.value = ''; // Clear the horses file input
    }
  };

  return (
    <div>
      <NavBar userRole={userRole} handleLogout={handleLogout} />
      <div className="randomizePage">
        <div className="transparentCard">
          <h1>Riders and Horses List</h1>
          <div className="uploadCard">
            <h2>Upload Riders</h2>
            <input id="ridersInput" type="file" onChange={handleRidersFileChange} hidden />
            <Button type="primary" onClick={() => document.getElementById('ridersInput').click()}>
              Choose File
            </Button>
            {ridersFileUploaded && (
              <p>Rider file uploaded successfully</p>
            )}
            <h2>Upload Horses</h2>
            <input id="horsesInput" type="file" onChange={handleHorsesFileChange} hidden />
            <Button type="primary" onClick={() => document.getElementById('horsesInput').click()}>
              Choose File
            </Button>
            {horsesFileUploaded && (
              <p>Horse file uploaded successfully</p>
            )}
          </div>
          <div className="buttonGroup">
            <Button type="primary" className="randomizeButton" onClick={handleRandomizeClick}>
              RANDOMIZE
            </Button>
            <Button type="primary" className="guideButton">
              <a href="https://scribehow.com/shared/Step-by-step_guide_to_managing_show_class_riders_and_horses_in_the_system__dmSv1ExASU-lOyRS9uhykg" target="_blank">
                GUIDE
              </a>
            </Button>
            <div style={{ marginTop: '10px' }}>
            <Button type="primary" className="downloadButton" onClick={handleDownloadTable}>
              DOWNLOAD TABLE
            </Button>
              <Button type="primary" className="clearButton" onClick={handleClearData}>
                CLEAR
              </Button>
              </div>
          </div>
        </div>
        <div className="resultsContainer">
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

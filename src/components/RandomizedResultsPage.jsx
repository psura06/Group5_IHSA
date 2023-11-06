import React from 'react';
import { useTableData } from './TableDataContext';
import { Table, Collapse } from 'antd';
import NavBar from './NavBar';

const { Panel } = Collapse;

const RandomizedResultsPage = ({ userRole, handleLogout }) => {
  const { tableData } = useTableData();

  // Define columns for the Ant Design Table with dynamic filters
  const columns = [
    {
      title: 'Number',
      dataIndex: 'Number',
      key: 'Number',
      filters: getUniqueValues(tableData, 'Number'), // Filter options for unique values
      onFilter: (value, record) => record.Number === value,
    },
    {
      title: 'Rider Name',
      dataIndex: 'Rider Name',
      key: 'RiderName',
      filters: getUniqueValues(tableData, 'Rider Name'), // Filter options for unique values
      onFilter: (value, record) => record['Rider Name'] === value,
    },
    {
      title: 'School',
      dataIndex: 'School',
      key: 'School',
      filters: getUniqueValues(tableData, 'School'), // Filter options for unique values
      onFilter: (value, record) => record.School === value,
    },
    {
      title: 'Draw Order',
      dataIndex: 'Draw Order',
      key: 'DrawOrder',
      filters: getUniqueValues(tableData, 'Draw Order'), // Filter options for unique values
      onFilter: (value, record) => record['Draw Order'] === value,
    },
    {
      title: 'Horse Name',
      dataIndex: 'Horse Name',
      key: 'HorseName',
      filters: getUniqueValues(tableData, 'Horse Name'), // Filter options for unique values
      onFilter: (value, record) => record['Horse Name'] === value,
    },
  ];

  // Helper function to get unique values from the table data
  function getUniqueValues(tableData, dataIndex) {
    const values = tableData.flatMap(result => result.data.map(record => record[dataIndex]));
    const uniqueValues = [...new Set(values)];
    return uniqueValues.map(value => ({ text: value, value: value }));
  }

  return (
    <div>
      <NavBar userRole={userRole} handleLogout={handleLogout} />
      <h1>Randomized Results</h1>
      <Collapse accordion>
        {tableData.map((result, index) => (
          <Panel header={result.className} key={index}>
            <Table
              columns={columns}
              dataSource={result.data}
              pagination={false}
            />
          </Panel>
        ))}
      </Collapse>
    </div>
  );
};

export default RandomizedResultsPage;

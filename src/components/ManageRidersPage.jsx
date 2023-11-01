import React, { useState } from 'react';
import { Table, Input, Button, Select, Row, Col, Layout } from 'antd';
import * as XLSX from 'xlsx';
import NavBar from './NavBar';
import '../stylings/ManageRidersPage.css';

const { Option } = Select;
const { Content } = Layout;

const ManageRidersPage = ({ userRole, handleLogout }) => {
  const [showClassInput, setShowClassInput] = useState(''); // State to input Show Classes
  const [classInput, setClassInput] = useState(''); // State to select Show Classes
  const [riderNameInput, setRiderNameInput] = useState('');
  const [schoolInput, setSchoolInput] = useState('');
  const [overweightInput, setOverweightInput] = useState('');
  const [overheightInput, setOverheightInput] = useState('');
  const [tableData, setTableData] = useState([]);
  const [pasteData, setPasteData] = useState('');
  const [idInput, setIdInput] = useState('');
  const [editingRow, setEditingRow] = useState(null); // State to track the row being edited
  const [editedValues, setEditedValues] = useState({}); // State to store edited values
  const [showClasses, setShowClasses] = useState([]);

  // Function to extract unique Show Classes from tableData
  const getUniqueShowClasses = () => {
    const uniqueClasses = new Set();
    tableData.forEach((record) => {
      uniqueClasses.add(record.Class);
    });
    return Array.from(uniqueClasses);
  };

  const handleAddClass = () => {
    if (showClassInput) {
      // Split showClassInput into an array of lines
      const newShowClasses = showClassInput.split('\n').filter((line) => line.trim() !== '');
      setShowClasses([...showClasses, ...newShowClasses]);
      setShowClassInput('');
    }
  };

  const handleAdd = () => {
    if (classInput && riderNameInput && schoolInput) {
      setTableData([
        ...tableData,
        {
          Class: classInput,
          ID: idInput,
          RiderName: riderNameInput,
          School: schoolInput,
          OverWeight: overweightInput,
          OverHeight: overheightInput,
        },
      ]);
      setClassInput('');
      setIdInput('');
      setRiderNameInput('');
      setSchoolInput('');
      setOverweightInput('F');
      setOverheightInput('F');
    }
  };

  const handleEdit = (record) => {
    setEditingRow(record);
    setEditedValues(record); // Set the edited values to the selected row's data
  };

  const handleSaveEdit = () => {
    const updatedTableData = tableData.map((item) =>
      item === editingRow
        ? {
            ...item,
            Class: editedValues.Class,
            ID: editedValues.ID,
            RiderName: editedValues.RiderName,
            School: editedValues.School,
            OverWeight: editedValues.OverWeight,
            OverHeight: editedValues.OverHeight,
          }
        : item
    );
    setTableData(updatedTableData);
    setEditingRow(null); // Clear the editing state
    setEditedValues({}); // Clear the edited values
  };

  const handleCancelEdit = () => {
    setEditingRow(null); // Clear the editing state
    setEditedValues({}); // Clear the edited values
  };

  const handleDownloadExcel = () => {
    const modifiedData = tableData.map((item) => ({
      Class: item.Class,
      ID: item.ID,
      "Rider Name": item.RiderName,
      School: item.School,
      OverWeight: item.OverWeight,
      OverHeight: item.OverHeight,
    }));

    const header = ["Class", "ID", "Rider Name", "School", "OverWeight", "OverHeight"];
    const worksheet = XLSX.utils.json_to_sheet(modifiedData, { header });
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, worksheet, 'RidersData');
    XLSX.writeFile(wb, 'riders_data.xlsx');
  };

  const handleExtract = () => {
    const dataLines = pasteData.split('\n').filter((line) => line.trim() !== '');
    const extractedData = [];
    let currentClass = '';

    for (const line of dataLines) {
      if (line.startsWith('Show Class')) {
        currentClass = line;
        if (!showClasses.includes(currentClass)) {
          setShowClasses([...showClasses, currentClass]);
        }
      } else if (!line.startsWith('1. _________')) {
        if (!line.includes('Kansas State University Sunday Show') && !line.includes('Classes / Sections')) {
          const words = line.split(' ');
          const id = words.shift(); // Get the first part as ID
          const riderName = words.slice(0, 2).join(' '); // Get the first two words after the three digits as Rider Name
          const school = words.slice(2).join(' '); // The rest as School

          extractedData.push({
            Class: currentClass,
            ID: id,
            RiderName: riderName,
            School: school,
            OverWeight: 'F',
            OverHeight: 'F',
          });
        }
      }
    }

    setTableData(extractedData);
  };

  const columns = [
    {
      title: 'Class',
      dataIndex: 'Class',
      filters: getUniqueShowClasses().map((showClass) => ({ text: showClass, value: showClass })),
      onFilter: (value, record) => record.Class === value,
      render: (_, record) =>
        editingRow === record ? (
          <Select
            style={{ width: '100%' }}
            value={editedValues.Class}
            onChange={(value) => setEditedValues({ ...editedValues, Class: value })}
          >
            {showClasses.map((showClass) => (
              <Option key={showClass} value={showClass}>
                {showClass}
              </Option>
            ))}
          </Select>
        ) : (
          record.Class
        ),
    },
    {
      title: 'ID',
      dataIndex: 'ID',
      render: (_, record) =>
        editingRow === record ? (
          <Input value={editedValues.ID} onChange={(e) => setEditedValues({ ...editedValues, ID: e.target.value })} />
        ) : (
          record.ID
        ),
    },
    {
      title: 'Rider Name',
      dataIndex: 'RiderName',
      render: (_, record) =>
        editingRow === record ? (
          <Input
            value={editedValues.RiderName}
            onChange={(e) => setEditedValues({ ...editedValues, RiderName: e.target.value })}
          />
        ) : (
          record.RiderName
        ),
    },
    {
      title: 'School',
      dataIndex: 'School',
      render: (_, record) =>
        editingRow === record ? (
          <Input
            value={editedValues.School}
            onChange={(e) => setEditedValues({ ...editedValues, School: e.target.value })}
          />
        ) : (
          record.School
        ),
    },
    {
      title: 'OverWeight',
      dataIndex: 'OverWeight',
      render: (_, record) =>
        editingRow === record ? (
          <Select
            style={{ width: '100%' }}
            value={editedValues.OverWeight}
            onChange={(value) => setEditedValues({ ...editedValues, OverWeight: value })}
          >
            <Option value="T">T</Option>
            <Option value="F">F</Option>
          </Select>
        ) : (
          record.OverWeight
        ),
    },
    {
      title: 'OverHeight',
      dataIndex: 'OverHeight',
      render: (_, record) =>
        editingRow === record ? (
          <Select
            style={{ width: '100%' }}
            value={editedValues.OverHeight}
            onChange={(value) => setEditedValues({ ...editedValues, OverHeight: value })}
          >
            <Option value="T">T</Option>
            <Option value="F">F</Option>
          </Select>
        ) : (
          record.OverHeight
        ),
    },
    {
      title: 'Action',
      dataIndex: 'Action',
      render: (_, record) => {
        if (editingRow === record) {
          return (
            <>
              <Button type="primary" onClick={handleSaveEdit}>
                Save
              </Button>
              <Button type="default" onClick={handleCancelEdit}>
                Cancel
              </Button>
            </>
          );
        } else {
          return (
            <Button type="link" onClick={() => handleEdit(record)}>
              Edit
            </Button>
          );
        }
      },
    },
  ];

  return (
    <Layout className="manage-riders-layout">
      <NavBar userRole={userRole} handleLogout={handleLogout} />
      <Content>
        <div className="manage-riders-content">
          <h1>Manage Riders</h1>
          <Row gutter={16} className="input-row">
            <Col span={4}>
              <Input.TextArea
                placeholder="Add Show Classes (one per line)"
                autoSize={{ minRows: 3 }}
                value={showClassInput}
                onChange={(e) => setShowClassInput(e.target.value)}
              />
            </Col>
            <Col span={2}>
              <Button type="primary" onClick={handleAddClass}>
                Add Class
              </Button>
            </Col>
            <Col span={3}>
              {showClasses.length > 0 && (
                <Select
                  style={{ width: '100%' }}
                  placeholder="Select Show Class"
                  value={classInput}
                  onChange={(value) => setClassInput(value)}
                >
                  {showClasses.map((showClass) => (
                    <Option key={showClass} value={showClass}>
                      {showClass}
                    </Option>
                  ))}
                </Select>
              )}
            </Col>
            <Col span={1}>
              <Input placeholder="ID" style={{ width: '100%' }} value={idInput} onChange={(e) => setIdInput(e.target.value)} />
            </Col>
            <Col span={4}>
              <Input
                placeholder="Rider First and Last Name"
                value={riderNameInput}
                onChange={(e) => setRiderNameInput(e.target.value)}
              />
            </Col>
            <Col span={4}>
              <Input placeholder="School Name" value={schoolInput} onChange={(e) => setSchoolInput(e.target.value)} />
            </Col>
            <Col span={2}>
              <Select style={{ width: '105%' }} value={overweightInput} onChange={(value) => setOverweightInput(value)}>
                <Option value="instruction" disabled>
                  OverWeight
                </Option>
                <Option value="T">T</Option>
                <Option value="F">F</Option>
              </Select>
            </Col>
            <Col span={2} >
              <Select style={{ width: '100%' }} value={overheightInput} onChange={(value) => setOverheightInput(value)}>
                <Option value="instruction" disabled>
                  OverHeight
                </Option>
                <Option value="T">T</Option>
                <Option value="F">F</Option>
              </Select>
            </Col>
            <Col span={1}>
              <Button type="primary" onClick={handleAdd}>
                Add
              </Button>
            </Col>
          </Row>
          <Row gutter={16} className="input-row">
            <Col span={24}>
              <Input.TextArea
                placeholder="Paste data here to Extract"
                autoSize={{ minRows: 3 }}
                value={pasteData}
                onChange={(e) => setPasteData(e.target.value)}
              />
              <Button className="extract-button" type="primary" onClick={handleExtract}>
                Extract
              </Button>
              <Button type="primary" onClick={handleDownloadExcel} style={{ marginLeft: '80px' }}>
                Download Excel
              </Button>
            </Col>
          </Row>
          <Table dataSource={tableData} columns={columns} rowKey={(record) => record.ID} />
        </div>
      </Content>
    </Layout>
  );
};

export default ManageRidersPage;
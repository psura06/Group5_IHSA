import React, { useState } from 'react';
import { Table, Input, Button, Select, Row, Col, Layout } from 'antd';
import * as XLSX from 'xlsx';
import NavBar from './NavBar';
import '../stylings/ManageHorsesPage.css';

const { Option } = Select;
const { Content } = Layout;

const ManageHorsesPage = ({ userRole, handleLogout }) => {
  const [showClassInput, setShowClassInput] = useState(''); // State to input Show Classes
  const [classInput, setClassInput] = useState([]); // State to select Show Classes
  const [horseNameInput, setHorseNameInput] = useState('');
  const [underweightInput, setUnderweightInput] = useState('');
  const [underheightInput, setUnderheightInput] = useState('');
  const [tableData, setTableData] = useState([]);
  // const [pasteData, setPasteData] = useState('');
  const [showClasses, setShowClasses] = useState([]);
  const [editingRow, setEditingRow] = useState(null); // State to track the row being edited
  const [editedValues, setEditedValues] = useState({}); // State to store edited values

  const handleAddClass = () => {
    if (showClassInput) {
      const newShowClasses = showClassInput.split('\n').filter((line) => line.trim() !== '');
      setShowClasses([...showClasses, ...newShowClasses]);
      setShowClassInput('');
    }
  };

  const handleAdd = () => {
    if (classInput.length > 0 && horseNameInput && underweightInput) {
      // Create a row for each selected Show Class
      const newRows = classInput.map((selectedClass) => ({
        Class: selectedClass,
        HorseName: horseNameInput,
        UnderWeight: underweightInput,
        UnderHeight: underheightInput,
      }));
      setTableData([...tableData, ...newRows]);
      setClassInput([]);
      setHorseNameInput('');
      setUnderweightInput('F');
      setUnderheightInput('F');
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
            HorseName: editedValues.HorseName,
            UnderWeight: editedValues.UnderWeight,
            UnderHeight: editedValues.UnderHeight,
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
      "Horse Name": item.HorseName,
      UnderWeight: item.UnderWeight,
      UnderHeight: item.UnderHeight,

    }));

    const header = ["Class", "Horse Name", "UnderWeight", "UnderHeight"];
    const worksheet = XLSX.utils.json_to_sheet(modifiedData, { header });
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, worksheet, 'HorsesData');
    XLSX.writeFile(wb, 'horses_data.xlsx');
  };

  const columns = [
    {
      title: 'Class',
      dataIndex: 'Class',
      filters: showClasses
        .filter((showClass) => tableData.some((item) => item.Class === showClass))
        .map((showClass) => ({ text: showClass, value: showClass })),
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
      title: 'Horse Name',
      dataIndex: 'HorseName',
      render: (_, record) =>
        editingRow === record ? (
          <Input
            value={editedValues.HorseName}
            onChange={(e) => setEditedValues({ ...editedValues, HorseName: e.target.value })}
          />
        ) : (
          record.HorseName
        ),
    },
    {
      title: 'UnderWeight',
      dataIndex: 'UnderWeight',
      render: (_, record) =>
        editingRow === record ? (
          <Select
            style={{ width: '100%' }}
            value={editedValues.UnderWeight}
            onChange={(value) => setEditedValues({ ...editedValues, UnderWeight: value })}
          >
            <Option value="T">T</Option>
            <Option value="F">F</Option>
          </Select>
        ) : (
          record.UnderWeight
        ),
    },
    {
      title: 'UnderHeight',
      dataIndex: 'UnderHeight',
      render: (_, record) =>
        editingRow === record ? (
          <Select
            style={{ width: '100%' }}
            value={editedValues.UnderHeight}
            onChange={(value) => setEditedValues({ ...editedValues, UnderHeight: value })}
          >
            <Option value="T">T</Option>
            <Option value="F">F</Option>
          </Select>
        ) : (
          record.UnderHeight
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
    <Layout className="manage-horses-layout">
      <NavBar userRole={userRole} handleLogout={handleLogout} />
      <Content>
        <div className="manage-horses-content">
          <h1>Manage Horses</h1>
          <Row gutter={16} className="input-row">
            <Col span={5}>
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
            <Col span={4}>
              {showClasses.length > 0 && (
                <Select
                  mode="multiple" // This sets up multi-select
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
            <Col span={2}>
              <Input
                placeholder="Horse Name"
                value={horseNameInput}
                onChange={(e) => setHorseNameInput(e.target.value)}
              />
            </Col>
            <Col span={3}>
              <Select style={{ width: '100%' }} value={underweightInput} onChange={(value) => setUnderweightInput(value)}>
              <Option value="instruction" disabled>
                  UnderWeight
                </Option>
                <Option value="T">T</Option>
                <Option value="F">F</Option>
              </Select>
            </Col>
            <Col span={3}>
              <Select style={{ width: '100%' }} value={underheightInput} onChange={(value) => setUnderheightInput(value)}>
              <Option value="instruction" disabled>
                  UnderHeight
                </Option>
                <Option value="T">T</Option>
                <Option value="F">F</Option>
              </Select>
            </Col>
            <Col span={2}>
              <Button type="primary" onClick={handleAdd}>
                Add
              </Button>
            </Col>
            <Col span={2} offset={2}>
              <Button type="primary" onClick={handleDownloadExcel}>
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

export default ManageHorsesPage;

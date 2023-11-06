import React, { createContext, useContext, useState } from 'react';

const TableDataContext = createContext();

export function useTableData() {
  return useContext(TableDataContext);
}

export function TableDataProvider({ children }) {
  const [tableData, setTableData] = useState([]);

  const updateTableData = (data) => {
    setTableData(data);
  };

  return (
    <TableDataContext.Provider value={{ tableData, updateTableData }}>
      {children}
    </TableDataContext.Provider>
  );
}

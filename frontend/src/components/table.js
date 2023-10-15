import React from 'react';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from '@mui/material';

const DynamicTable = ({ data, maxHeight, tableHead}) => {
  if (!data || data.length === 0) {
    return <p>No data available.</p>;
  }

  const columns = Object.keys(data[0]);

  return (
    <div style={{ maxHeight: `${maxHeight}px`, overflow: 'auto' }}>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              {tableHead.map((column, index) => (
                <TableCell key={index}>{column}</TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {data.map((row, rowIndex) => (
              <TableRow key={rowIndex}>
                {columns.map((column, columnIndex) => (
                  <TableCell key={columnIndex}>{row[column]}</TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
};

export default DynamicTable;

import React, { useState } from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import FilterComponent from './FilterCharge';

interface TableHeaderProps {
  toggle: () => void;
  pageSize: number;
  page: number;
  setPage: (page: number) => void;
  setCurrentFilters: (data: {}) => void;
}

const TableHeader: React.FC<TableHeaderProps> = ({ toggle, pageSize, page, setPage, setCurrentFilters }) => {
  const [isFilterComponentVisible, setIsFilterComponentVisible] = useState(false);

  const toggleFilterComponent = () => setIsFilterComponentVisible(!isFilterComponentVisible);

  return (
    <Box sx={{ p: 5, pb: 3, display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between' }}>

      <Button
        onClick={toggleFilterComponent}
        variant='contained'
        sx={{ mr: 6, mb: 2, pr: 5, pl: 5 }}>
        {isFilterComponentVisible ? "Cerrar Filtro" : "Mostrar Filtro"}
      </Button>

      <Button
        sx={{ mb: 2 }}
        onClick={toggle}
        variant='contained'>
        Crear Cargo
      </Button>

      {isFilterComponentVisible && <FilterComponent pageSize={pageSize} page={page} setPage={setPage} setCurrentFilters={setCurrentFilters} />}
    </Box>
  );
}

export default TableHeader;


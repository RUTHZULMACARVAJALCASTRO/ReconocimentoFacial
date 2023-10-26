// // ** MUI Imports
// import Box from '@mui/material/Box'
// import Button from '@mui/material/Button'
// import TextField from '@mui/material/TextField'
// import FilterMod from './FilterCharge'

// // ** Icon Imports
// import Icon from 'src/@core/components/icon'
// import { useState } from 'react'

// interface TableHeaderProps {
//   value: string
//   toggle: () => void,
//   pageSize: number
// }

// const TableHeader: React.FC<TableHeaderProps> = ({ toggle, value, pageSize }) => {


//   const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);
//   const openFilterModal = () => setIsFilterModalOpen(true);
//   const closeFilterModal = () => setIsFilterModalOpen(false);

//   return (
//     <Box sx={{ p: 5, pb: 3, display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between' }}>
//       <Box sx={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center' }}>
//         <Button onClick={openFilterModal} variant='contained' sx={{ mr: 6, mb: 2, pr: 15, pl: 15 }}>
//           Filtrar
//         </Button>

//         <Button sx={{ mb: 2 }} onClick={toggle} variant='contained'>
//           Agregar Cargo
//         </Button>


//         <FilterMod open={isFilterModalOpen} handleClose={closeFilterModal} pageSize={pageSize} />
//       </Box>
//     </Box>
//   )
// }

// export default TableHeader
import React, { useState } from 'react';
import { DataGrid } from '@mui/x-data-grid';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Icon from 'src/@core/components/icon';
import FilterComponent from './FilterCharge'; // Importa tu componente FilterComponent aquí

interface TableHeaderProps {
  toggle: () => void;
  pageSize: number;
}

const TableHeader: React.FC<TableHeaderProps> = ({ toggle, pageSize }) => {
  const [isFilterComponentVisible, setIsFilterComponentVisible] = useState(false);

  const toggleFilterComponent = () => setIsFilterComponentVisible(!isFilterComponentVisible);

  return (
    <Box sx={{ p: 5, pb: 3, display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between' }}>
      <Box sx={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center' }}>
        <Button onClick={toggleFilterComponent} variant='contained' sx={{ mr: 6, mb: 2, pr: 15, pl: 15 }}>
          Filtrar
        </Button>

        <Button sx={{ mb: 2 }} onClick={toggle} variant='contained'>
          Agregar Cargo
        </Button>
      </Box>
      {isFilterComponentVisible && <FilterComponent pageSize={pageSize} />}
    </Box>
  );
}

export default TableHeader;


// components/SalaryDataGrid.tsx
import * as React from 'react';
import { DataGrid, GridColDef, GridValueGetterParams } from '@mui/x-data-grid';
import { Button } from '@mui/material';

const columns: GridColDef[] = [
    { field: 'date', headerName: 'Fecha', width: 130 },
    { field: 'name', headerName: 'Nombres y Apellidos', width: 200 },
    { field: 'position', headerName: 'Cargo', width: 150 },
    { field: 'baseSalary', headerName: 'Salario Básico', width: 150 },
    { field: 'totalEarned', headerName: 'Total Ganado', width: 150 },
    { field: 'deductions', headerName: 'Deducciones', width: 150 },
    { field: 'totalDeductions', headerName: 'Total Descuentos', width: 180 },
    {
        field: 'netPay',
        headerName: 'Líquido a Pagar',
        width: 180,
        valueGetter: (params: GridValueGetterParams) =>
            (Number(params.getValue(params.id, 'totalEarned') || 0) -
                Number(params.getValue(params.id, 'totalDeductions') || 0)).toString(),
    },
];

const rows = [
    // Add your data here
    { id: 1, date: '01/02/2023', name: 'Juan Pérez', position: 'Gerente', baseSalary: 5000, totalEarned: 5500, deductions: 100, totalDeductions: 150 },
    // ... more rows
];

export const SalaryDataGrid: React.FC = () => {
    return (
        <div style={{ height: 400, width: '100%' }}>
            <DataGrid
                rows={rows}
                columns={columns}
                pageSize={5}
                checkboxSelection
                disableSelectionOnClick
                components={{
                    Toolbar: () => (
                        <Button variant="contained" color="primary" style={{ marginBottom: '1rem' }}>
                            Agregar Nuevo Registro
                        </Button>
                    ),
                }}
            />
        </div>
    );
};

export default SalaryDataGrid;

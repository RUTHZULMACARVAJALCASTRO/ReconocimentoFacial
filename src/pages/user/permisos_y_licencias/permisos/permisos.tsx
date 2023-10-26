// pages/asignar-permiso.tsx
import React, { useState } from 'react';
import { Button, FormControl, InputLabel, Select, TextField, Container, Typography, MenuItem } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import { NextPage } from 'next';

interface Asignacion {
    id: number;
    nombre: string;
    tipoPermiso: string;
    fechaInicio: string;
    fechaFin: string;
}

const AsignarPermiso: NextPage = () => {
    const [empleado, setEmpleado] = React.useState('');
    const [tipoPermiso, setTipoPermiso] = React.useState('');
    const [fechaInicio, setFechaInicio] = useState('');
    const [fechaFin, setFechaFin] = useState('');
    const [asignaciones, setAsignaciones] = useState<Asignacion[]>([]);

    const handleEmpleadoChange = (event: any) => {
        setEmpleado(event.target.value);
    };

    const handleTipoPermisoChange = (event: any) => {
        setTipoPermiso(event.target.value);
    };

    const handleSubmit = () => {
        // Agregar la asignación a la lista de asignaciones
        const nuevaAsignacion: Asignacion = {
            id: asignaciones.length + 1,
            nombre: empleado,  // Aquí puedes hacer un mapeo de id a nombre real si es necesario
            tipoPermiso,
            fechaInicio,
            fechaFin,
        };

        setAsignaciones(prevAsignaciones => [...prevAsignaciones, nuevaAsignacion]);

        // Limpiar los campos después de asignar
        setEmpleado('');
        setTipoPermiso('');
        setFechaInicio('');
        setFechaFin('');
    };

    return (
        <Container>
            <Typography variant="h4" gutterBottom>Asignar Permiso</Typography>

            <FormControl fullWidth variant="outlined" margin="normal">
                <InputLabel>Empleado</InputLabel>
                <Select
                    value={empleado}
                    onChange={handleEmpleadoChange}
                    label="Empleado"
                >
                    <MenuItem value={'Juan Pérez'}>Juan Pérez</MenuItem>
                    <MenuItem value={'María González'}>María González</MenuItem>
          // ... agregar otros empleados según sea necesario
                </Select>
            </FormControl>

            <FormControl fullWidth variant="outlined" margin="normal">
                <InputLabel>Tipo de Permiso</InputLabel>
                <Select
                    value={tipoPermiso}
                    onChange={handleTipoPermisoChange}
                    label="Tipo de Permiso"
                >
                    <MenuItem value={'Licencia Médica'}>Licencia Médica</MenuItem>
                    <MenuItem value={'Permiso Personal'}>Permiso Personal</MenuItem>
                    <MenuItem value={'Vacaciones'}>Vacaciones</MenuItem>
                </Select>
            </FormControl>

            <TextField
                fullWidth
                margin="normal"
                variant="outlined"
                label="Fecha de Inicio"
                type="date"
                value={fechaInicio}
                onChange={(e) => setFechaInicio(e.target.value)}
                InputLabelProps={{ shrink: true }}
            />
            <TextField
                fullWidth
                margin="normal"
                variant="outlined"
                label="Fecha de Finalización"
                type="date"
                value={fechaFin}
                onChange={(e) => setFechaFin(e.target.value)}
                InputLabelProps={{ shrink: true }}
            />

            <Button variant="contained" color="primary" onClick={handleSubmit} style={{ marginTop: '1rem' }}>
                Asignar Permiso
            </Button>

            <div style={{ height: 400, marginTop: '2rem' }}>
                <DataGrid
                    rows={asignaciones}
                    columns={[
                        { field: 'nombre', headerName: 'Empleado', width: 200 },
                        { field: 'tipoPermiso', headerName: 'Tipo de Permiso', width: 200 },
                        { field: 'fechaInicio', headerName: 'Fecha de Inicio', width: 200 },
                        { field: 'fechaFin', headerName: 'Fecha de Finalización', width: 200 },
                    ]}
                    pageSize={5}
                />
            </div>
        </Container>
    );
};

export default AsignarPermiso;

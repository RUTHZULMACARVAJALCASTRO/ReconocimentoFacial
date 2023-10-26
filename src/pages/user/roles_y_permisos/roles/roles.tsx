
import React, { useState } from 'react';
import { Button, Avatar, Grid, Paper, Typography, IconButton, Table, TableBody, TableCell, TableHead, TableRow, TextField } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import { NextPage } from 'next';
import AgregarRolModal from './AgregarRolModal';

interface Rol {
    id: number;
    nombre: string;
    totalUsuarios: number;
    avatares: string[]; // URLs de las imágenes de los avatares
}

const Roles: NextPage = () => {
    const [roles, setRoles] = useState<Rol[]>([
        {
            id: 1,
            nombre: "Administrador",
            totalUsuarios: 7,
            avatares: ['url1', 'url2', 'url3'], // Reemplaza con URLs reales
        },
        // ... otros roles de ejemplo
    ]);
    const usuarios = [
        {
            nombre: 'Galen Slixby',
            email: 'gslixby0@abc.net.au',
            rol: 'Editor',
            plan: 'Empresa',
            estado: 'Inactivo'
        },
        // ... otros usuarios
    ];
    const [isModalOpen, setModalOpen] = useState(false);

    const handleAddRole = (rol: string, permisos: string[]) => {
        // Aquí puedes agregar la lógica para guardar el nuevo rol, por ejemplo:
        setRoles(prev => [...prev, { id: Math.random(), nombre: rol, totalUsuarios: 0, avatares: [] }]);
        // También puedes agregar la lógica para guardar los permisos si es necesario.
    };

    return (
        <Paper style={{ padding: '2rem', margin: '2rem' }}>
            <Typography variant="h4" gutterBottom>Lista de roles</Typography>
            <Typography variant="body1" gutterBottom>
                Un rol proporciona acceso a menús y funciones predefinidos para que,
                según el rol asignado, un administrador pueda tener acceso a lo que necesita.
            </Typography>

            <Grid container spacing={4}>
                {roles.map((rol) => (
                    <Grid item xs={12} md={4} key={rol.id}>
                        <Paper elevation={3} style={{ padding: '1rem', textAlign: 'center' }}>
                            <Grid container spacing={2}>
                                <Grid item xs={8}>
                                    <Typography variant="h6">{rol.nombre}</Typography>
                                </Grid>
                                <Grid item xs={4}>
                                    <IconButton>
                                        <EditIcon />
                                    </IconButton>
                                </Grid>
                                <Grid item xs={12}>
                                    <Grid container spacing={1} justifyContent="center">
                                        {rol.avatares.map((avatarUrl, index) => (
                                            <Grid item key={index}>
                                                <Avatar src={avatarUrl} />
                                            </Grid>
                                        ))}
                                    </Grid>
                                    <Typography variant="subtitle1">Total {rol.totalUsuarios} usuarios</Typography>
                                </Grid>
                            </Grid>
                        </Paper>
                    </Grid>
                ))}
            </Grid>

            <Button variant="contained" color="primary" style={{ marginTop: '2rem' }} onClick={() => setModalOpen(true)}>
                AGREGAR ROL
            </Button>

            <AgregarRolModal open={isModalOpen} onClose={() => setModalOpen(false)} onAdd={handleAddRole} />


            <Grid item xs={12}>
                <Typography variant="h4" gutterBottom>
                    Usuarios totales con sus roles
                </Typography>
                <Typography variant="body1" gutterBottom>
                    Encuentre todas las cuentas de administrador de su empresa y sus roles asociados.
                </Typography>
                <Grid container justifyContent="space-between" alignItems="center" marginBottom={2}>
                    <Grid item xs={6}>
                        <TextField fullWidth label="Buscar (Ctrl+/)" variant="outlined" />
                    </Grid>
                    <Grid item>
                        <Button variant="contained" color="primary">
                            EXPORTAR
                        </Button>
                    </Grid>
                </Grid>
                <Paper elevation={3}>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell>USUARIO</TableCell>
                                <TableCell>CORREO ELECTRÓNICO</TableCell>
                                <TableCell>ROL</TableCell>
                                <TableCell>PLAN</TableCell>
                                <TableCell>ESTADO</TableCell>
                                <TableCell></TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {usuarios.map((usuario, index) => (
                                <TableRow key={index}>
                                    <TableCell>
                                        <Grid container alignItems="center" spacing={1}>
                                            <Grid item>
                                                <Avatar>{usuario.nombre[0]}</Avatar>
                                            </Grid>
                                            <Grid item>{usuario.nombre}</Grid>
                                        </Grid>
                                    </TableCell>
                                    <TableCell>{usuario.email}</TableCell>
                                    <TableCell>{usuario.rol}</TableCell>
                                    <TableCell>{usuario.plan}</TableCell>
                                    <TableCell>{usuario.estado}</TableCell>
                                    <TableCell>
                                        <IconButton>
                                            <EditIcon />
                                        </IconButton>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </Paper>
            </Grid>
        </Paper>

    );
};

export default Roles;

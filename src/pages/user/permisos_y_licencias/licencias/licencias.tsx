import React, { useEffect, useState } from 'react';
import {
    Button, FormControl, InputLabel, TextField, Container, Typography, MenuItem, Select,
    Grid, Box, List, ListItem, ListItemText, ListItemIcon, InputAdornment, IconButton, Menu, Tooltip,
} from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import axios from 'axios';
import { NextPage } from 'next';
import SearchIcon from '@mui/icons-material/Search';
import CheckIcon from '@mui/icons-material/Check';
import EditIcon from '@mui/icons-material/Edit';
import { toggleChargeStatus } from 'src/store/apps/charge';
import Swal from 'sweetalert2';
import MenuIcon from '@mui/icons-material/Menu';
import CustomChip from 'src/@core/components/mui/chip';
import { ThemeColor } from 'src/@core/layouts/types';
import { editCharge } from 'src/store/apps/charge/index';

interface AsignacionLicencia {
    _id: string;
    personal: string;
    licenseType: string;
    description: string;
    startDate: string;
    endDate: string;
    isActive: boolean;
}

interface CellType {
    row: AsignacionLicencia;
}

interface User {
    _id: string;
    name: string;
    lastName: string;
}

interface licenseStatusType {
    [key: string]: ThemeColor;
}

const AsignarLicencia: NextPage = () => {
    // Estado para asignar licencia
    const [licenseType, setLicenseType] = useState('');
    const [description, setDescription] = useState('');
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [asignacionesLicencias, setAsignacionesLicencias] = useState<AsignacionLicencia[]>([]);
    const [selectedLicense, setSelectedLicense] = useState<AsignacionLicencia | null>(null);
    const [editingLicense, setEditingLicense] = useState<AsignacionLicencia | null>(null);
    const [isEditing, setIsEditing] = useState(false);
    // Estado para búsqueda y selección de usuario
    const [searchBy, setSearchBy] = useState("fullName");
    const [searchValue, setSearchValue] = useState("");
    const [isSearching, setIsSearching] = useState(false);
    const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
    const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
    const [selectedUsers, setSelectedUsers] = useState<User[]>([]);


    const dataGridRows = asignacionesLicencias.map((asignacion) => ({
        ...asignacion,
        id: asignacion._id,
        personal: getFullNameFromId(asignacion.personal), // suponiendo que esta función devuelve el nombre completo basado en el ID
        startDate: asignacion.startDate.split('T')[0],
        endDate: asignacion.endDate.split('T')[0],
    }));

    const licenseStatusObj: licenseStatusType = {
        asignado: 'success',
        finalizado: 'secondary',
    };

    function getFullNameFromId(id: string): string {
        if (!id) {
            return ''; // Return an empty string if no user is selected
        }

        const user = selectedUsers.find((user) => user._id === id);
        return user ? `${user.name} ${user.lastName}` : 'Desconocido';
    }

    const handleUserSelection = (userId: string) => {
        setSelectedUserId(userId);
        const user = filteredUsers.find((user) => user._id === userId);
        if (user) {
            setSelectedUsers([user]); // Reemplaza el array de usuarios seleccionados con el usuario actual
        }
        setFilteredUsers([]); // Limpiar la lista después de seleccionar
    };

    useEffect(() => {
        const fetchLicenses = async () => {
            try {
                const response = await axios.get(`${process.env.NEXT_PUBLIC_PERSONAL_LICENCIA}`);
                setAsignacionesLicencias(response.data);
            } catch (error) {
                console.error('Error al obtener las licencias:', error);
            }
        };
        const fetchSelectedUsers = async () => {
            if (selectedUserId) {
                try {
                    const response = await axios.get(`${process.env.NEXT_PUBLIC_PERSONAL}${selectedUserId}`);
                    const user = response.data;
                    if (user) {
                        setSelectedUsers([user]);
                    } else {
                        console.error(`No se encontró el usuario con ID ${selectedUserId}`);
                    }
                } catch (error) {
                    console.error("Error al obtener el usuario seleccionado:", error);
                }
            }
        };

        fetchLicenses();
        fetchSelectedUsers(); // Llamar a la función para obtener el usuario seleccionado
    }, [selectedUserId]);


    const handleSearch = async () => {
        setIsSearching(true);
        try {
            const url = `https://khaki-badgers-feel.loca.lt/api/personal/filtered?${searchBy}=${searchValue}`;
            const response = await axios.get(url);
            setFilteredUsers(response.data.data);
        } catch (error) {
            console.error("Error buscando usuarios:", error);
        }
        setIsSearching(false);
    };

    const handleSubmit = async () => {
        if (!selectedUserId) {
            console.error("Por favor selecciona un usuario antes de asignar una licencia.");
            return;
        }

        const nuevaAsignacionLicencia: Partial<AsignacionLicencia> = {
            personal: selectedUserId,
            licenseType,
            description,
            startDate,
            endDate,
            isActive: true,
        };

        try {
            const response = await axios.post('https://khaki-badgers-feel.loca.lt/api/license', nuevaAsignacionLicencia);
            setAsignacionesLicencias(prevAsignaciones => [...prevAsignaciones, response.data]);
        } catch (error) {
            console.error("Error al asignar licencia:", error);
        }

        setSelectedUserId(null);
        setLicenseType('');
        setDescription('');
        setStartDate('');
        setEndDate('');
    };

    const handleEdit = async (id: string) => {
        try {
            setIsEditing(true); // Cambia a modo de edición
            // Realiza una solicitud para obtener la información de la licencia con el ID seleccionado
            const response = await axios.get(`https://khaki-badgers-feel.loca.lt/api/license/${id}`);
            const fetchedLicense = response.data;
            if (fetchedLicense) {
                setEditingLicense(fetchedLicense);
            } else {
                console.error(`La licencia con ID ${id} no se encontró.`);
            }
        } catch (error) {
            console.error(`Error al obtener la licencia con ID ${id}:`, error);
        }

        setIsEditing(false);
    };

    const LicenseOptions = ({ id, isActive }: { id: string, isActive: boolean }) => {

        const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
        const licenseOptionsOpen = Boolean(anchorEl);

        const handleLicenseOptionsClick = (event: React.MouseEvent<HTMLElement>) => {
            console.log('click aquí');
            setAnchorEl(event.currentTarget);
        };

        const handleLicenseOptionsClose = () => {
            setAnchorEl(null);
        };

        const handleUpdate = (licenseId: string) => () => {
            // Aquí puedes manejar la actualización de la licencia
        };

        const swalWithBootstrapButtons = Swal.mixin({
            customClass: {
                confirmButton: 'btn btn-success',
                cancelButton: 'btn btn-danger',
            },
            buttonsStyling: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
        });

        return (
            <>
                <IconButton size="small" onClick={handleLicenseOptionsClick}>
                    <MenuIcon />
                </IconButton>
                <Menu
                    keepMounted
                    anchorEl={anchorEl}
                    open={licenseOptionsOpen}
                    onClose={handleLicenseOptionsClose}
                    anchorOrigin={{
                        vertical: 'bottom',
                        horizontal: 'right',
                    }}
                    transformOrigin={{
                        vertical: 'top',
                        horizontal: 'right',
                    }}
                    PaperProps={{ style: { minWidth: '8rem' } }}
                >
                    <Tooltip
                        title={isActive ? '' : 'No se puede editar esta licencia porque no está activa'}
                        arrow
                        placement="top"
                    >
                        <span>
                            <MenuItem
                                onClick={isActive ? () => handleEdit(id) : undefined}
                                sx={{
                                    '& svg': { mr: 2 },
                                    pointerEvents: isActive ? 'auto' : 'none',
                                    opacity: isActive ? 1 : 0.5,
                                }}
                            >
                                <EditIcon />
                                Editar
                            </MenuItem>
                        </span>
                    </Tooltip>
                    <MenuItem
                        onClick={() => {
                            swalWithBootstrapButtons.fire({
                                title: isActive ? '¿Desactivar Licencia?' : '¿Activar Licencia?',
                                text: isActive
                                    ? 'Realmente quieres desactivar esta licencia?'
                                    : 'Realmente quieres activar esta licencia?',
                                icon: 'warning',
                                showCancelButton: true,
                                confirmButtonText: isActive ? 'Sí, desactivar' : 'Sí, activar',
                                cancelButtonText: 'No, cancelar',
                                reverseButtons: true,
                            }).then((result) => {
                                if (result.isConfirmed) {
                                    // Aquí manejas la activación/desactivación de la licencia
                                    console.log(isActive ? 'Licencia desactivada' : 'Licencia activada');
                                } else if (result.dismiss === Swal.DismissReason.cancel) {
                                    swalWithBootstrapButtons.fire(
                                        'Cancelado',
                                        'La licencia está segura :)',
                                        'error'
                                    );
                                }
                            });

                            handleLicenseOptionsClose();
                        }}
                        sx={{ '& svg': { mr: 2 } }}
                    >
                        {isActive ? 'Desactivar Licencia' : 'Activar Licencia'}
                    </MenuItem>
                </Menu>
            </>
        );
    };

    return (
        <Container>
            <Typography variant="h5" gutterBottom>Asignar Licencia</Typography>
            <br />
            <Grid container spacing={3}>
                <Grid item xs={4}>
                    <FormControl variant="outlined" fullWidth>
                        <InputLabel>Buscar por</InputLabel>
                        <Select
                            value={searchBy}
                            onChange={(e) => setSearchBy(e.target.value)}
                            label="Buscar por"
                        >
                            <MenuItem value="fullName">Nombre Completo</MenuItem>
                            <MenuItem value="name">Nombre</MenuItem>
                            <MenuItem value="lastName">Apellido</MenuItem>
                            <MenuItem value="ci">CI</MenuItem>
                            <MenuItem value="phone">Teléfono</MenuItem>
                        </Select>
                    </FormControl>
                </Grid>

                <Grid item xs={8}>
                    <TextField
                        fullWidth
                        variant="outlined"
                        placeholder="Buscar usuario..."
                        value={searchValue}
                        onChange={(e) => setSearchValue(e.target.value)}
                        InputProps={{
                            endAdornment: (
                                <InputAdornment position="end">
                                    <Button onClick={handleSearch} color="primary">
                                        <SearchIcon />
                                        Buscar
                                    </Button>
                                </InputAdornment>
                            ),
                        }}
                    />
                </Grid>

                {isSearching && <p>Buscando...</p>}
                {!isSearching && filteredUsers.length > 0 && (
                    <Box>
                        <List dense>
                            {filteredUsers.map((user: User) => (
                                <ListItem button key={user._id} onClick={() => handleUserSelection(user._id)}>
                                    <ListItemText primary={`${user.name} ${user.lastName}`} />
                                    {selectedUserId === user._id && <ListItemIcon><CheckIcon color="primary" /></ListItemIcon>}
                                </ListItem>
                            ))}
                        </List>
                    </Box>
                )}
                <Grid item xs={12}>
                    <TextField
                        fullWidth
                        margin="normal"
                        variant="outlined"
                        label="Usuario Seleccionado"
                        value={selectedUserId ? getFullNameFromId(selectedUserId) : ""}
                        InputProps={{
                            readOnly: true,
                        }}
                    />
                </Grid>
            </Grid>
            <Grid container spacing={3}>
                <Grid item xs={6}>
                    <FormControl fullWidth variant="outlined" margin="normal">
                        <InputLabel>Tipo de Licencia</InputLabel>
                        <Select
                            value={licenseType}
                            onChange={(event: any) => setLicenseType(event.target.value)}
                            label="License Type"
                        >
                            <MenuItem value={'Medica'}>Medica</MenuItem>
                            <MenuItem value={'Maternidad'}>Maternidad</MenuItem>
                            <MenuItem value={'Paternidad'}>Paternidad</MenuItem>
                            <MenuItem value={'Duelo'}>Duelo</MenuItem>
                            <MenuItem value={'Vacaciones'}>Vacaciones</MenuItem>
                            <MenuItem value={'Personal'}>Personal</MenuItem>
                        </Select>
                    </FormControl>
                </Grid>
                <Grid item xs={6}>
                    <TextField
                        fullWidth
                        margin="normal"
                        variant="outlined"
                        label="Descripción"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                    />
                </Grid>
                <Grid item xs={6}>
                    <TextField
                        fullWidth
                        margin="normal"
                        variant="outlined"
                        label="Fecha de Inicio"
                        type="date"
                        value={startDate}
                        onChange={(e) => setStartDate(e.target.value)}
                        InputLabelProps={{ shrink: true }}
                    />
                </Grid>
                <Grid item xs={6}>
                    <TextField
                        fullWidth
                        margin="normal"
                        variant="outlined"
                        label="Fecha de Finalización"
                        type="date"
                        value={endDate}
                        onChange={(e) => setEndDate(e.target.value)}
                        InputLabelProps={{ shrink: true }}
                    />
                </Grid>
            </Grid>
            <br />
            {
                !editingLicense ?
                    <Button variant="contained" color="primary" onClick={() => handleEdit(id)}>editCharge</Button>
                    :
                    <Button variant="contained" color="primary" onClick={handleSubmit}>AddLicense</Button>
            }
            <div style={{ height: 400, marginTop: '2rem' }}>
                <DataGrid
                    rows={dataGridRows}
                    columns={[
                        {
                            flex: 0.1,
                            minWidth: 90,
                            sortable: false,
                            field: 'actions',
                            headerName: 'Acciones',
                            renderCell: ({ row }: CellType) => <LicenseOptions id={row._id} isActive={row.isActive} />,
                        },
                        {
                            flex: 0.1,
                            minWidth: 110,
                            field: 'licenseStatus', // Cambia esto según tus necesidades
                            headerName: 'Estado de Licencia',
                            renderCell: ({ row }: CellType) => {
                                const status = row.isActive ? 'asignado' : 'finalizado'; // Asegúrate de que 'isActive' es la propiedad correcta
                                return (
                                    <CustomChip
                                        skin='light'
                                        size='small'
                                        label={status}
                                        color={licenseStatusObj[status]}
                                        sx={{ textTransform: 'capitalize', '& .MuiChip-label': { lineHeight: '18px' } }}
                                    />
                                )
                            },
                        },
                        {
                            flex: 0.1,
                            minWidth: 200,
                            field: 'personal',
                            headerName: 'Personal',
                            renderCell: ({ row }: CellType) => {
                                return (
                                    <Tooltip title={row.personal || ''}>
                                        <div style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                                            <Typography noWrap variant='body2'>
                                                {row.personal}
                                            </Typography>
                                        </div>
                                    </Tooltip>
                                );
                            },
                        },
                        {
                            flex: 0.1,
                            minWidth: 200,
                            field: 'licenseType',
                            headerName: 'Tipo de Licencia',
                            renderCell: ({ row }: CellType) => {
                                return (
                                    <Tooltip title={row.licenseType || ''}>
                                        <div style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                                            <Typography noWrap variant='body2'>
                                                {row.licenseType}
                                            </Typography>
                                        </div>
                                    </Tooltip>
                                );
                            },
                        },
                        {
                            flex: 0.1,
                            minWidth: 200,
                            field: 'description',
                            headerName: 'Descripción',
                            renderCell: ({ row }: CellType) => {
                                return (
                                    <Tooltip title={row.description || ''}>
                                        <div style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                                            <Typography noWrap variant='body2'>
                                                {row.description}
                                            </Typography>
                                        </div>
                                    </Tooltip>
                                );
                            },
                        },
                        {
                            flex: 0.1,
                            minWidth: 200,
                            field: 'startDate',
                            headerName: 'Fecha de Inicio',
                            renderCell: ({ row }: CellType) => {
                                return (
                                    <Tooltip title={row.startDate || ''}>
                                        <div style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                                            <Typography noWrap variant='body2'>
                                                {row.startDate}
                                            </Typography>
                                        </div>
                                    </Tooltip>
                                );
                            },
                        },
                        {
                            flex: 0.1,
                            minWidth: 200,
                            field: 'endDate',
                            headerName: 'Fecha de Finalización',
                            renderCell: ({ row }: CellType) => {
                                return (
                                    <Tooltip title={row.endDate || ''}>
                                        <div style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                                            <Typography noWrap variant='body2'>
                                                {row.endDate}
                                            </Typography>
                                        </div>
                                    </Tooltip>
                                );
                            },
                        },
                    ]}
                    localeText={{
                        noRowsLabel: 'No hay Licencias',
                        noResultsOverlayLabel: 'No se encontraron resultados.',
                        errorOverlayDefaultLabel: 'Ocurrió un error.',
                    }}
                    disableColumnMenu={true}
                    pageSize={5}
                />
            </div>
        </Container>
    );
};

export default AsignarLicencia;

import React, { useEffect, useState } from 'react'
import Drawer from '@mui/material/Drawer'
import Button from '@mui/material/Button'
import { styled } from '@mui/material/styles'
import TextField from '@mui/material/TextField'
import IconButton from '@mui/material/IconButton'
import Typography from '@mui/material/Typography'
import Box from '@mui/material/Box'
import FormControl from '@mui/material/FormControl'
import * as yup from 'yup'
import { yupResolver } from '@hookform/resolvers/yup'
import { useForm, Controller } from 'react-hook-form'
import Icon from 'src/@core/components/icon'
import axios from 'axios'
import { useDispatch, useSelector } from 'react-redux'
import { RootState } from 'src/redux/store'
import { editLicense } from 'src/store/apps/license/index' // Asegúrate de tener una función 'editLicense' en tu store
import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'
import { Grid, Select, MenuItem, InputAdornment, InputLabel, List, ListItem, ListItemIcon, ListItemText } from '@mui/material'
import SearchIcon from '@mui/icons-material/Search';
import CheckIcon from '@mui/icons-material/Check';
import { AppDispatch } from 'src/redux/store'

interface SidebarEditLicenseType {
    licenseId: string;
    open: boolean;
    toggle: () => void;
}

interface LicenseData {
    _id: string;
    personal: string;
    licenseType: string;
    description: string;
    startDate: string;
    endDate: string;
    isActive: boolean
}

interface User {
    _id: string;
    name: string;
    lastName: string
}

const Header = styled(Box)(({ theme }) => ({
    display: 'flex',
    alignItems: 'center',
    padding: theme.spacing(3, 4),
    justifyContent: 'space-between',
    backgroundColor: theme.palette.background.default
}))

const defaultValues = {
    _id: '',
    personal: '',
    licenseType: '',
    description: '',
    startDate: '',
    endDate: '',
    isActive: true
}

const SidebarEditLicense = ({ licenseId, open, toggle }: SidebarEditLicenseType) => {

    const dispatch = useDispatch<AppDispatch>();
    const allLicense = useSelector((state: RootState) => state.license.paginatedLicenses); // Asumo que tienes un estado llamado 'allLicenses'
    const selectedLicense = allLicense.find(license => license._id === licenseId);
    const [searchBy, setSearchBy] = useState("name");
    const [searchValue, setSearchValue] = useState("");
    const [openSnackbar, setOpenSnackbar] = useState(false);
    const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
    const [isSearching, setIsSearching] = useState(false);
    const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
    const [selectedUsers, setSelectedUsers] = useState<User[]>([]);
    const { handleSubmit, control, setValue } = useForm<LicenseData>({
        defaultValues: selectedLicense ? selectedLicense : defaultValues
    });
    const MySwal = withReactContent(Swal)

    useEffect(() => {
        if (selectedLicense) {
            setValue("personal", selectedLicense.personal);
            setValue("licenseType", selectedLicense.licenseType);
            setValue("description", selectedLicense.description);
            setValue("startDate", selectedLicense.startDate);
            setValue("endDate", selectedLicense.endDate);
            setSelectedUserId(selectedLicense.personal);

        }
    }, [licenseId, selectedLicense, setValue]);

    const onSubmit = async (data: LicenseData) => {
        try {
            await dispatch(editLicense({ ...data, _id: licenseId })).unwrap();
            toggle();
            setOpenSnackbar(true);
            MySwal.fire({
                title: <p>Licencia editada con éxito!</p>,
                icon: 'success'
            });
        } catch (error) {
            // Manejar el error
        }
    };

    const handleClose = () => {
        toggle();
    };
    const getFullNameFromId = (id: string): string => {
        const user = selectedUsers.find((user) => user._id === id);
        return user ? `${user.name} ${user.lastName}` : 'Desconocido';
    };
    const handleSearch = async () => {
        setIsSearching(true);
        try {
            const url = `${process.env.NEXT_PUBLIC_PERSONAL}filtered?${searchBy}=${searchValue}`;
            const response = await axios.get(url);
            setFilteredUsers(response.data.data);
        } catch (error) {
            console.error("Error buscando usuarios:", error);
        }
        setIsSearching(false);
    };

    const handleUserSelection = (userId: string) => {
        setSelectedUserId(userId);
        const user = filteredUsers.find((user) => user._id === userId);
        if (user) {
            setSelectedUsers(prevUsers => [...prevUsers, user]);
        }
        setFilteredUsers([]);  // Limpiar la lista después de seleccionar
    };
    return (
        <>
            <Drawer
                style={{ border: '2px solid white' }}
                open={open}
                onClose={handleClose}
                anchor='right'
                variant='temporary'
                sx={{ '& .MuiDrawer-paper': { width: { xs: 400, sm: 800 } } }}
            >
                <Header>
                    <Typography variant='h6'>Editar Licencia</Typography>
                    <IconButton size='small' onClick={handleClose} sx={{ color: 'text.primary' }}>
                        <Icon icon='mdi:close' fontSize={20} />
                    </IconButton>
                </Header>
                <Box sx={{ p: 5 }}>
                    <form onSubmit={handleSubmit(onSubmit)}>
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
                                <Controller
                                    name="personal"
                                    control={control}
                                    // defaultValue={selectedUserId}
                                    render={({ field }) => (
                                        <TextField
                                            {...field}
                                            fullWidth
                                            label="Usuario Seleccionado"
                                            value={selectedUserId ? getFullNameFromId(selectedUserId) : ""}
                                            InputProps={{
                                                readOnly: true,
                                            }}
                                        />
                                    )}
                                />
                            </Grid>

                            <Grid item xs={12}>
                                <FormControl fullWidth sx={{ mb: 4 }}>
                                    <Controller
                                        name='licenseType'
                                        control={control}
                                        rules={{ required: true }}
                                        render={({ field }) => (
                                            <Select
                                                {...field}
                                                label='Tipo de Licencia'
                                            >
                                                <MenuItem value={'Medica'}>Madica</MenuItem>
                                                <MenuItem value={'Maternidad'}>Maternidad</MenuItem>
                                                <MenuItem value={'Paternidad'}>Paternidad</MenuItem>
                                                <MenuItem value={'Duelo'}>Duelo</MenuItem>
                                                <MenuItem value={'Vacaciones'}>Vacaciones</MenuItem>
                                                <MenuItem value={'Personal'}>Personal</MenuItem>
                                            </Select>
                                        )}
                                    />
                                </FormControl>
                            </Grid>

                            <Grid item xs={12}>
                                <FormControl fullWidth sx={{ mb: 4 }}>
                                    <Controller
                                        name='description'
                                        control={control}
                                        rules={{ required: true, minLength: 5 }} // Puedes ajustar estas reglas
                                        render={({ field }) => (
                                            <TextField
                                                {...field}
                                                label='Descripcion'
                                                autoComplete='off'
                                            />
                                        )}
                                    />
                                </FormControl>
                            </Grid>
                            <Grid item xs={6}>
                                <Controller
                                    name="startDate"
                                    control={control}
                                    rules={{ required: true, minLength: 5 }}
                                    render={({ field }) => (
                                        <TextField
                                            {...field}
                                            fullWidth
                                            type="date"
                                            label="Fecha de inicio"
                                            autoComplete='off'
                                        />
                                    )}
                                />
                            </Grid>

                            <Grid item xs={6}>
                                <Controller
                                    name="endDate"
                                    control={control}
                                    render={({ field }) => (
                                        <TextField
                                            {...field}
                                            fullWidth
                                            type="date"
                                            label="Fecha de finalización"
                                            autoComplete='off'
                                        />
                                    )}
                                />
                            </Grid>
                        </Grid>
                        <br />
                        <Grid item xs={12}>
                            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                <Button size='large' type='submit' variant='contained' sx={{ mr: 6 }}>
                                    Aceptar
                                </Button>
                                <Button size='large' variant='outlined' color='secondary' onClick={handleClose}>
                                    Cancelar
                                </Button>
                            </Box>
                        </Grid>
                    </form>
                </Box>
            </Drawer>
        </>
    );
}

export default SidebarEditLicense;

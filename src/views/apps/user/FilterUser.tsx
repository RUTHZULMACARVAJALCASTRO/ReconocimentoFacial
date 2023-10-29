import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { TextField, Grid, FormControl, InputLabel, Select, MenuItem, Paper, Button, InputAdornment } from '@mui/material';
import { fetchUsersByPage } from 'src/store/apps/user/index';
import { AppDispatch } from 'src/redux/store';
import { useSelector } from 'react-redux';
import { RootState } from 'src/store';
import FilterListIcon from '@mui/icons-material/FilterList';

interface FilterProps {
    pageSize: number;
    onFilterSubmit?: (filters: any) => void;
    page: number;
    setPage: (page: number) => void;
    setCurrentFilters: (data: {}) => void;
}

const initialFilters = {
    name: '',
    lastName: '',
    ci: '',
    email: '',
    phone: '',
    address: '',
    nationality: '',
    isActive: ''
};

const FilterComponent: React.FC<FilterProps> = ({ pageSize, page, setPage, setCurrentFilters }) => {

    const userStatus = useSelector((state: RootState) => state.users.status);
    const totalPages = useSelector((state: RootState) => state.users.pageSize) || 0;
    const paginatedUsers = useSelector((state: RootState) => state.users.paginatedUsers);

    console.log({ userStatus, totalPages, paginatedUsers, page });

    const [filters, setFilters] = useState(initialFilters);
    const dispatch = useDispatch<AppDispatch>();

    const handleInputChange = (event: any) => {
        const { name, value } = event.target;
        if (name === "isActive") {
            setFilters(prevState => ({ ...prevState, [name]: value === "true" }));
        } else {
            setFilters(prevState => ({ ...prevState, [name]: value }));
        }
    };

    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setPage(1);
        setCurrentFilters(filters);
        dispatch(fetchUsersByPage({ page, pageSize, ...filters }));
    };

    const handleReset = () => {
        setFilters(initialFilters);
        setCurrentFilters({})
        console.log("Estado actualizado a:", initialFilters);
        dispatch(fetchUsersByPage({ page: 1, pageSize }));
    };

    return (

        <Paper style={{ padding: '10px', marginBottom: '10px', width: '100%' }}>

            <form onSubmit={handleSubmit}>
                <Grid container spacing={2}>
                    <Grid item xs={1.5}>
                        <FormControl fullWidth variant="standard">
                            <InputLabel htmlFor="isActive">Estado</InputLabel>
                            <Select
                                name="isActive"
                                value={String(filters.isActive)}
                                onChange={handleInputChange}
                                id="isActive"
                            >
                                <MenuItem value={"true"}>Activo</MenuItem>
                                <MenuItem value={"false"}>Inactivo</MenuItem>
                            </Select>

                        </FormControl>
                    </Grid>
                    <Grid item xs={1.5}>
                        <TextField name="name" variant="standard" value={filters.name} onChange={handleInputChange} label="Nombre" fullWidth
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <FilterListIcon />
                                    </InputAdornment>
                                ),
                            }} />
                    </Grid>
                    <Grid item xs={1.5}>
                        <TextField name="lastName" variant="standard" value={filters.lastName} onChange={handleInputChange} label="Apellido" fullWidth
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <FilterListIcon />
                                    </InputAdornment>
                                ),
                            }} />
                    </Grid>
                    <Grid item xs={1.5}>
                        <TextField name="ci" variant="standard" value={filters.ci} onChange={handleInputChange} label="CI" fullWidth
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <FilterListIcon />
                                    </InputAdornment>
                                ),
                            }} />
                    </Grid>
                    <Grid item xs={1.5}>
                        <TextField name="email" variant="standard" value={filters.email} onChange={handleInputChange} label="E-mail" fullWidth
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <FilterListIcon />
                                    </InputAdornment>
                                ),
                            }} />
                    </Grid>
                    <Grid item xs={1.5}>
                        <TextField name="phone" variant="standard" value={filters.phone} onChange={handleInputChange} label="Telefono" fullWidth
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <FilterListIcon />
                                    </InputAdornment>
                                ),
                            }} />
                    </Grid>
                    <Grid item xs={1.5}>
                        <TextField name="address" variant="standard" value={filters.address} onChange={handleInputChange} label="Dirección" fullWidth
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <FilterListIcon />
                                    </InputAdornment>
                                ),
                            }} />
                    </Grid>
                    <Grid item xs={1.5}>
                        <FormControl fullWidth variant="standard">
                            <InputLabel htmlFor="nationality">Nacionalidad</InputLabel>
                            <Select
                                name="nationality"
                                value={filters.nationality}
                                onChange={handleInputChange}
                                id="nationality"
                            >
                                <MenuItem value={"Argentina"}>Argentino</MenuItem>
                                <MenuItem value={"Brasil"}>Brasileño</MenuItem>
                                <MenuItem value={"Chile"}>Chileno</MenuItem>
                                <MenuItem value={"Bolivia"}>Boliviano</MenuItem>
                                <MenuItem value={"Peru"}>Peruano</MenuItem>
                            </Select>

                        </FormControl>
                    </Grid>

                    <Grid item xs={1.5}>
                        <Button
                            type="submit"
                            fullWidth
                            variant="contained"
                            color="primary"
                            style={{ marginTop: '10px' }}
                        >
                            Filtrar
                        </Button>
                    </Grid>
                    <Grid item xs={1.5}>
                        <Button
                            onClick={handleReset}
                            fullWidth
                            variant="outlined"
                            color="primary"
                            style={{ marginTop: '10px' }}
                        >
                            Restablecer
                        </Button>
                    </Grid>
                </Grid>
            </form>
        </Paper>
    );
};

export default FilterComponent;
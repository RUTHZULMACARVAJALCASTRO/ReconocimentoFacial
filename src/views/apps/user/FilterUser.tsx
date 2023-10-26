
import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { TextField, Grid, FormControl, InputLabel, Select, MenuItem, Paper, Typography, Button, InputAdornment } from '@mui/material';
import { fetchUsersByPage } from 'src/store/apps/user/index';
import { AppDispatch } from 'src/redux/store';
import { useSelector } from 'react-redux';
import { RootState } from 'src/store';
import FilterListIcon from '@mui/icons-material/FilterList';

interface FilterProps {
    pageSize: number;
    onFilterSubmit?: (filters: any) => void;
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

const FilterComponent: React.FC<FilterProps> = ({ pageSize, onFilterSubmit }) => {
    const [filters, setFilters] = useState(initialFilters);
    const dispatch = useDispatch<AppDispatch>();
    const currentPage = useSelector((state: RootState) => state.users.currentPage);

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
        const finalFilters = {
            ...filters,
            page: 1,
            pageSize: pageSize
        };

        dispatch(fetchUsersByPage(finalFilters));

        if (onFilterSubmit) {
            onFilterSubmit(finalFilters);
        }
    };

    const handleReset = () => {
        setFilters(initialFilters); // Restablecer los filtros al estado inicial
        console.log("Estado actualizado a:", initialFilters);

        // Suponiendo que si no pasas filtros a fetchChargesByPage, devuelve todos los datos.
        dispatch(fetchUsersByPage({ page: 1, pageSize: pageSize }));
    };
    return (

        <Paper style={{ padding: '10px', marginBottom: '10px', width: '100%' }}>

            <form onSubmit={handleSubmit}>
                <Grid container spacing={2}>
                    <Grid item xs={1.2}>
                        <FormControl fullWidth variant="standard">
                            <InputLabel htmlFor="isActive">Estado</InputLabel>
                            <Select
                                name="isActive"
                                value={filters.isActive}
                                onChange={handleInputChange}
                                id="isActive"
                            >
                                <MenuItem value={"true"}>Activo</MenuItem>
                                <MenuItem value={"false"}>Inactivo</MenuItem>
                            </Select>

                        </FormControl>
                    </Grid>
                    <Grid item xs={1.2}>
                        <TextField name="name" variant="standard" value={filters.name} onChange={handleInputChange} label="Nombre" fullWidth
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <FilterListIcon />
                                    </InputAdornment>
                                ),
                            }} />
                    </Grid>
                    <Grid item xs={1.3}>
                        <TextField name="lastName" variant="standard" value={filters.lastName} onChange={handleInputChange} label="Apellido" fullWidth
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <FilterListIcon />
                                    </InputAdornment>
                                ),
                            }} />
                    </Grid>
                    <Grid item xs={1}>
                        <TextField name="ci" variant="standard" value={filters.ci} onChange={handleInputChange} label="CI" fullWidth
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <FilterListIcon />
                                    </InputAdornment>
                                ),
                            }} />
                    </Grid>
                    <Grid item xs={1.3}>
                        <TextField name="E-mail" variant="standard" value={filters.email} onChange={handleInputChange} label="E-mail" fullWidth
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <FilterListIcon />
                                    </InputAdornment>
                                ),
                            }} />
                    </Grid>
                    <Grid item xs={1.3}>
                        <TextField name="telefono" variant="standard" value={filters.phone} onChange={handleInputChange} label="Telefono" fullWidth
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <FilterListIcon />
                                    </InputAdornment>
                                ),
                            }} />
                    </Grid>
                    <Grid item xs={1.3}>
                        <TextField name="dirección" variant="standard" value={filters.address} onChange={handleInputChange} label="Dirección" fullWidth
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <FilterListIcon />
                                    </InputAdornment>
                                ),
                            }} />
                    </Grid>
                    <Grid item xs={1.2}>
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

                    <Grid item xs={1}>
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
                    <Grid item xs={1}>
                        <Button
                            onClick={handleReset}
                            fullWidth
                            variant="outlined"
                            color="primary"
                            style={{ marginTop: '10px' }}
                        >
                            Fin
                        </Button>
                    </Grid>

                </Grid>
            </form>
        </Paper>
    );
};

export default FilterComponent;


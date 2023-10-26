
import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { TextField, Grid, FormControl, InputLabel, Select, MenuItem, Paper, Typography, Button, InputAdornment } from '@mui/material';
import { fetchChargesByPage } from 'src/store/apps/charge/index';
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
    isActive: ''
};

const FilterComponent: React.FC<FilterProps> = ({ pageSize, onFilterSubmit }) => {
    const [filters, setFilters] = useState(initialFilters);
    const dispatch = useDispatch<AppDispatch>();
    const currentPage = useSelector((state: RootState) => state.charges.currentPage);

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

        dispatch(fetchChargesByPage(finalFilters));

        if (onFilterSubmit) {
            onFilterSubmit(finalFilters);
        }
    };

    const handleReset = () => {
        setFilters(initialFilters); // Restablecer los filtros al estado inicial
        console.log("Estado actualizado a:", initialFilters);

        // Suponiendo que si no pasas filtros a fetchChargesByPage, devuelve todos los datos.
        dispatch(fetchChargesByPage({ page: 1, pageSize: pageSize }));
    };
    return (

        <Paper style={{ padding: '10px', marginBottom: '10px', width: '100%' }}>

            <form onSubmit={handleSubmit}>
                <Grid container spacing={3}>
                    <Grid item xs={3}>
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
                    <Grid item xs={3}>
                        <TextField name="name" variant="standard" value={filters.name} onChange={handleInputChange} label="Nombre" fullWidth
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <FilterListIcon />
                                    </InputAdornment>
                                ),
                            }} />
                    </Grid>

                    <Grid item xs={3}>
                        <Button
                            type="submit"
                            fullWidth
                            variant="contained"
                            color="primary"
                            style={{ marginTop: '10px' }}
                        >
                            Aplicar Filtro
                        </Button>
                    </Grid>
                    <Grid item xs={3}>
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


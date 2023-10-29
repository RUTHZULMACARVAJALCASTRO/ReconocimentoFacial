
import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { Grid, FormControl, InputLabel, Select, MenuItem, Paper, Button } from '@mui/material';
import { AppDispatch } from 'src/redux/store';
import { useSelector } from 'react-redux';
import { RootState } from 'src/store';
import { fetchLicensesByPage } from 'src/store/apps/license';

interface FilterProps {
    pageSize: number;
    onFilterSubmit?: (filters: any) => void;
    page: number;
    setPage: (page: number) => void;
    setCurrentFilters: (data: {}) => void;
}

const initialFilters = {
    licenseType: '',
    isActive: undefined
};

const FilterComponent: React.FC<FilterProps> = ({ pageSize, page, setPage, setCurrentFilters }) => {
    const licenseStatus = useSelector((state: RootState) => state.license.status);
    const totalPages = useSelector((state: RootState) => state.license.pageSize) || 0;
    const paginatedLicenses = useSelector((state: RootState) => state.license.paginatedLicenses);


    console.log({ licenseStatus, totalPages, paginatedLicenses, page });

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
        dispatch(fetchLicensesByPage({ page, pageSize, ...filters }));
    };

    const handleReset = () => {
        setFilters(initialFilters);
        setCurrentFilters({})
        console.log("Estado actualizado a:", initialFilters);
        dispatch(fetchLicensesByPage({ page: 1, pageSize }));
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
                        <FormControl fullWidth variant="standard">
                            <InputLabel htmlFor="licenseType">Tipo de Licencia</InputLabel>
                            <Select
                                name="licenseType"
                                value={filters.licenseType}
                                onChange={handleInputChange}
                                id="licenseType"
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


import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { TextField, Grid, FormControl, InputLabel, Select, MenuItem, Paper, Button, InputAdornment } from '@mui/material';
import { fetchScheduleByPage } from 'src/store/apps/schedule/index';
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
    isActive: ''
};

const FilterComponent: React.FC<FilterProps> = ({ pageSize, page, setPage, setCurrentFilters }) => {

    const scheduleStatus = useSelector((state: RootState) => state.users.status);
    const totalPages = useSelector((state: RootState) => state.users.pageSize) || 0;
    const paginatedSchedule = useSelector((state: RootState) => state.users.paginatedUsers);

    console.log({ scheduleStatus, totalPages, paginatedSchedule, page });
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
        dispatch(fetchScheduleByPage({ page, pageSize, ...filters }));
    };

    const handleReset = () => {
        setFilters(initialFilters);
        setCurrentFilters({})
        console.log("Estado actualizado a:", initialFilters);
        dispatch(fetchScheduleByPage({ page: 1, pageSize }));
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
                </Grid>
                <Grid container spacing={4}>
                    <Grid item xs={1.5}>
                        <Button
                            type="submit"
                            fullWidth
                            variant="contained"
                            color="primary"
                            style={{ marginTop: '15px' }}
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
                            style={{ marginTop: '15px' }}
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


import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { Button, Modal, TextField, Box, Grid, FormControl, InputLabel, Select, MenuItem } from '@mui/material';
import { fetchChargesByPage } from 'src/store/apps/charge/index';
import { AppDispatch } from 'src/redux/store';
import { useSelector } from 'react-redux';
import { RootState } from 'src/store';


interface FilterModalProps {
    open: boolean;
    handleClose: () => void;
    pageSize: number
}

const initialFilters = {
    name: '',
    description: '',
    isActive: ''
};

const FilterModal: React.FC<FilterModalProps> = ({ open, handleClose, pageSize }) => {
    const [filters, setFilters] = useState(initialFilters);


    const dispatch = useDispatch<AppDispatch>()
    const currentPage = useSelector((state: RootState) => state.charges.currentPage);

    const handleInputChange = (event: any) => {
        const { name, value } = event.target;
        if (name === "isActive") {
            setFilters(prevState => ({ ...prevState, [name]: value === "true" }));
        } else {
            setFilters(prevState => ({ ...prevState, [name]: value }));
        }

        console.log(name);
        console.log(value);
    };

    useEffect(() => {
        console.log(filters);
    }, [filters]);

    const handleSubmit = (event: any) => {
        console.log('aplicando filtro');
        event.preventDefault();
        const finalFilters = {
            ...filters,
            page: currentPage,
            pageSize: pageSize
        };
        dispatch(fetchChargesByPage(finalFilters));
        handleClose();
    };

    useEffect(() => {
        if (!open) {
            setFilters(initialFilters);
        }
    }, [open]);

    const style = {
        position: 'absolute' as 'absolute',
        top: '20%',
        left: '50%',
        transform: 'translate(-50%, -10%)',
        width: 400,
        bgcolor: 'background.paper',
        boxShadow: 24,
        p: 4,
    };

    return (
        <Modal
            open={open}
            onClose={handleClose}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
        >
            <Box sx={style}>
                <form onSubmit={handleSubmit}>
                    <Grid container spacing={4}>
                        <Grid item xs={6}>
                            <TextField name="name" value={filters.name} onChange={handleInputChange} id="standard-basic-1" label="Nombre" variant="standard" fullWidth />
                        </Grid>
                        <Grid item xs={6}>
                            <TextField name="lastName" value={filters.description} onChange={handleInputChange} id="standard-basic-2" label="Descripción" variant="standard" fullWidth />
                        </Grid>
                        <Grid item xs={6}>
                            <FormControl fullWidth variant="standard">
                                <InputLabel htmlFor="estado">Estado</InputLabel>
                                <Select
                                    name="isActive"
                                    value={filters.isActive}
                                    onChange={handleInputChange}
                                    id="estado"
                                    label="Estado"
                                >
                                    <MenuItem value={"true"}>Activo</MenuItem>
                                    <MenuItem value={"false"}>Inactivo</MenuItem>
                                </Select>
                            </FormControl>
                        </Grid>

                        <Grid item xs={12}>
                            <Button type="submit" fullWidth>Aplicar Filtro</Button>
                        </Grid>
                    </Grid>
                </form>
            </Box>
        </Modal>
    );
};

export default FilterModal;
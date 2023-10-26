
import React, { useState } from 'react';
import { Button, Checkbox, FormControlLabel, TextField, Dialog, DialogTitle, DialogContent, DialogActions } from '@mui/material';

const AgregarRolModal: React.FC<{ open: boolean, onClose: () => void, onAdd: (rol: string, permisos: string[]) => void }> = ({ open, onClose, onAdd }) => {
    const [rol, setRol] = useState('');
    const [permisos, setPermisos] = useState<string[]>([]);

    const handleCheckboxChange = (permiso: string, checked: boolean) => {
        if (checked) {
            setPermisos(prev => [...prev, permiso]);
        } else {
            setPermisos(prev => prev.filter(p => p !== permiso));
        }
    };

    const handleSubmit = () => {
        onAdd(rol, permisos);
        setRol('');
        setPermisos([]);
        onClose();
    };


    return (
        <Dialog open={open} onClose={onClose}>
            <DialogTitle>Agregar Rol</DialogTitle>
            <DialogContent>
                <TextField fullWidth margin="normal" label="Nombre del Rol" value={rol} onChange={(e) => setRol(e.target.value)} />
                {/* Lista de permisos */}
                {['Leer', 'Escribir', 'Crear'].map(permiso => (
                    <FormControlLabel
                        key={permiso}
                        control={
                            <Checkbox
                                checked={permisos.includes(permiso)}
                                onChange={(e) => handleCheckboxChange(permiso, e.target.checked)}
                            />
                        }
                        label={permiso}
                    />
                ))}
                {/* Puedes agregar más permisos si es necesario */}
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose} color="secondary">
                    Cancelar
                </Button>
                <Button onClick={handleSubmit} color="primary" variant="contained">
                    Agregar
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default AgregarRolModal;

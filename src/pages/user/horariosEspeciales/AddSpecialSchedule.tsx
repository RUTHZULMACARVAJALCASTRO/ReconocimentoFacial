import { Button, Checkbox, Collapse, Drawer, FormControlLabel, FormGroup, Grid, Grow, IconButton, List, ListItemButton, ListItemIcon, ListItemText, ListSubheader, Paper, Switch, TextField, Typography } from '@mui/material';
import Box, { BoxProps } from '@mui/material/Box';
import { styled } from '@mui/material/styles';
import Icon from 'src/@core/components/icon'
import axios from 'axios';
import React, { useState, Children } from 'react';
import { Controller } from 'react-hook-form';
import { useForm } from 'react-hook-form';

// onSave: (data: any) => void;
type SpecialScheduleFormProps = {
  onCancel: () => void;
  open: boolean;
  onClose: () => void;
  toggle: () => void
};

const SpecialScheduleForm: React.FC<SpecialScheduleFormProps> = ({ onCancel, open, onClose }) => {

  const { control, handleSubmit, setValue, formState: { errors }, watch } = useForm({
    defaultValues: {
      name: '',
      schedules: Array(7).fill({ entryTolerance: 0, exitTolerance: 0 }),
      isPermanent: true,
      temporalDateRange: [],
      startDate: null,  // Agregado
      endDate: null     // Agregado
    }
  });

  const handleSave = (data: any) => {
    console.log('Data del formulario', data);

    if (!checked) {
      delete data.startDate;
      delete data.endDate;
    }

    const filteredSchedules = data.schedules.filter((schedule: any) => schedule.day !== null);
    const finalData = {
      ...data,
      schedules: filteredSchedules
    };
    onSave(finalData);
  };

  const onSave = async (data: any) => {
    try {
      await axios.post(`https://khaki-mirrors-shop.loca.lt/api/special-schedule`, data);
      alert('Horario especial creado con éxito!');
      onClose();  // Cierra el formulario
    } catch (error) {
      console.error('Error al crear el horario especial:', error);
      alert('Error al crear el horario especial. Intente nuevamente.');
    }
  };

  const [checked, setChecked] = useState(false);

  const handleChange = () => {
    setChecked((prev) => !prev);
  };

  const icon = (
    <Paper elevation={3}>
      <Box>
        <Controller
          name="startDate"
          control={control}
          rules={{
            required: checked ? "La fecha de inicio es obligatoria" : false,
          }}
          render={({ field }) => (
            <TextField
              {...field}
              type="date"
              label="Fecha de inicio"
              InputLabelProps={{ shrink: true }}
            />
          )}
        />
        {errors.startDate && <Typography variant="caption" color="error">{errors.startDate.message}</Typography>}

        {/* validate: value => */}
        {/* !value || new Date(value) > new Date(watch("startDate")) || "La fecha de fin debe ser posterior a la fecha de inicio", */}
        <Controller
          name="endDate"
          control={control}
          rules={{
            required: checked ? "La fecha de fin es obligatoria" : false,

          }}
          render={({ field }) => (
            <TextField
              {...field}
              type="date"
              label="Fecha de fin"
              InputLabelProps={{ shrink: true }}
            />
          )}
        />
        {errors.endDate && <Typography variant="caption" color="error">{errors.endDate.message}</Typography>}
      </Box>
    </Paper>

  );

  const Header = styled(Box)<BoxProps>(({ theme }) => ({
    display: 'flex',
    alignItems: 'center',
    padding: theme.spacing(3, 4, '4', '5'),
    justifyContent: 'space-between',
    backgroundColor: theme.palette.background.default,
  }))

  const dias = [
    { nombre: 'Lunes', value: 1 },
    { nombre: 'Martes', value: 2 },
    { nombre: 'Miercoles', value: 3 },
    { nombre: 'Jueves', value: 4 },
    { nombre: 'Viernes', value: 5 },
    { nombre: 'Sabado', value: 6 },
    { nombre: 'Domingo', value: 0 },
  ]

  return (
    <>
      <Drawer
        open={open}
        anchor='right'
        variant='temporary'
        onClose={onClose}
        sx={{ '& .MuiDrawer-paper': { width: { xs: 300, sm: 500, md: 800, xl: 1200 } } }}
        ModalProps={{ keepMounted: true }}
      >
        <Header>
          <Typography variant='h6'>Horario Especial</Typography>
          <IconButton size='large' onClick={onCancel} sx={{ color: 'text.primary' }}>
            <Icon icon='mdi:close' fontSize={20} />
          </IconButton>
        </Header>

        <Box sx={{ p: 5 }}>
          <form onSubmit={handleSubmit(handleSave)}>
            <Typography variant="subtitle1" sx={{ fontWeight: 'bold', marginBottom: 2 }}>
              Nombre
            </Typography>

            <Controller
              name='name'
              control={control}
              rules={{ required: true }}
              render={({ field: { value, onChange } }) => (
                <TextField
                  value={value}
                  label='Nombre'
                  onChange={onChange}
                  error={Boolean(errors.name)}
                  inputProps={{ autoComplete: "off" }}
                />
              )}
            />

            <Box sx={{ marginTop: 3 }}>
              {dias.map((dia, index) => (
                <Box key={index} sx={{ marginBottom: 2 }}>
                  <FormControlLabel
                    control={
                      <Controller
                        name={`schedules.${index}.day`}
                        control={control}
                        render={({ field: { onChange, value } }) => (
                          <Checkbox
                            checked={value === dia.value}
                            onChange={e => onChange(e.target.checked ? dia.value : null)}
                            color="primary"
                          />
                        )}
                      />
                    }
                    label={dia.nombre}
                  />

                  <Box sx={{ display: 'flex', flexDirection: 'column', marginLeft: 2 }}>
                    {['morningEntry', 'morningExit', 'afternoonEntry', 'afternoonExit'].map((fieldKey) => (
                      <Controller
                        key={fieldKey}
                        name={`schedules.${index}.${fieldKey}` as any}
                        control={control}
                        defaultValue=""
                        render={({ field }) => (
                          <TextField
                            type="time"
                            label={fieldKey.replace(/[A-Z]/g, match => ` ${match.toLowerCase()}`)}
                            {...field}
                            sx={{ marginBottom: 1 }}
                            fullWidth
                          />
                        )}
                      />
                    ))}
                    <Controller
                      name={`schedules.${index}.entryTolerance`}
                      control={control}
                      defaultValue=""
                      render={({ field }) => (
                        <TextField
                          type="number"
                          label="Tolerancia de Entrada (min)"
                          {...field}
                          sx={{ marginBottom: 1 }}
                          fullWidth
                          InputProps={{
                            inputProps: {
                              min: 0,
                              step: 1
                            }
                          }}
                        />
                      )}
                    />
                    <Controller
                      name={`schedules.${index}.exitTolerance`}
                      control={control}
                      defaultValue=""
                      render={({ field }) => (
                        <TextField
                          type="number"
                          label="Tolerancia de Salida (min)"
                          {...field}
                          sx={{ marginBottom: 1 }}
                          fullWidth
                          InputProps={{
                            inputProps: {
                              min: 0,
                              step: 1
                            }
                          }}
                        />
                      )}
                    />
                  </Box>
                </Box>
              ))}
            </Box>

            <Box sx={{ height: 100, marginTop: 5 }}>
              <FormControlLabel
                control={<Switch checked={checked} onChange={handleChange} />}
                label="Temporal"
              />
              <Box sx={{ display: 'flex' }}>
                <Grow in={checked}>{icon}</Grow>
              </Box>
            </Box>

            <Box sx={{ mt: 4 }}>
              <Button variant="contained" color="primary" onClick={handleSubmit(handleSave)}>
                Guardar
              </Button>
              <Button color="secondary" onClick={onCancel}>
                Cancelar
              </Button>
            </Box>
          </form>
        </Box>
      </Drawer>
    </>
  );
}

export default SpecialScheduleForm
// Importaciones
import { yupResolver } from '@hookform/resolvers/yup';
import { Button, Checkbox, Collapse, Drawer, FormControlLabel, FormGroup, Grid, Grow, IconButton, List, ListItemButton, ListItemIcon, ListItemText, ListSubheader, Paper, Switch, TextField, Typography } from '@mui/material';
import Box, { BoxProps } from '@mui/material/Box';
import { styled } from '@mui/material/styles';
import axios from 'axios';
import React, { useState, Children } from 'react';

import { Controller, useForm, useFormContext } from 'react-hook-form';

import Icon from 'src/@core/components/icon'

import * as yup from 'yup';

// Creacion de Interfaces
interface SidebarAddSpecialScheduleType {
  open: boolean
  toggle: () => void
}

interface Children {
  _id: string,
  name: string,
  children: Children[]
}
interface Schedule {
  day?: number,
  morningEntry?: string,
  morningExit?: string,
  afternoonEntry?: string,
  afternoonExit?: string,
  entryTolerance?: number,
  exitTolerance?: number,
}

interface ScheduleData {
  name: string,
  schedules: Schedule[],
  specialSchedule?: string
}

// Variables  -  Constantes

const showErrors = (field: string, valueLen: number, min: number) => {
  if (valueLen === 0) {
    return `El campo ${field} es requerido`
  } else if (valueLen > 0 && valueLen < min) {
    return `${field} debe tener al menos ${min} caracteres`
  } else {
    return ''
  }
}

const Header = styled(Box)<BoxProps>(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  padding: theme.spacing(3, 4, '4', '5'),
  justifyContent: 'space-between',
  backgroundColor: theme.palette.background.default,
}))

const schema = yup.object().shape({
  name: yup
    .string()
    .min(4, obj => showErrors('Nombre', obj.value.length, obj.min))
    .required(),

  schedules: yup
    .array().of(
      yup.object().shape({
        day: yup.number().required(),
        morningEntry: yup.string().required(),
        morningExit: yup.string().required(),
        afternoonEntry: yup.string().required(),
        afternoonExit: yup.string().required(),
        entryTolerance: yup.number().required(),
        exitTolerance: yup.number().required(),
      })
    ),
  specialSchedule: yup.string().notRequired(),
})

const defaultValues = {
  name: '',
  schedules: [{
    day: 0,
    morningEntry: '',
    morningExit: '',
    afternoonEntry: '',
    afternoonExit: '',
    entryTolerance: 0,
    exitTolerance: 0,
  }],
  specialSchedule: ''
};

const SidebarAddSpecialSchedule = (props: SidebarAddSpecialScheduleType) => {
  const { open, toggle } = props;
  const [checked, setChecked] = React.useState(false);  
  const[lunes,setLunes]=useState<Schedule>();
  const [children, setChildren] = useState<Children[]>([])
  const [schedule, setSchedule] = useState<ScheduleData>({
    name: '',
    schedules: [],
    specialSchedule: ''
  });

  const handleChange = () => {
    setChecked((prev) => !prev);
  };
  const updateLunes = (field:string, value:any) => {
    if(field==="day")value.string
    setLunes((prevLunes) => ({
      ...prevLunes,
      [field]: value,
    }));
  };

  const [openList, setOpenList] = useState(true);

  const { reset, control, setValue, handleSubmit, formState: { errors }, getValues } = useForm({
    defaultValues,
    mode: 'onChange',
    resolver: yupResolver(schema)
  });



  const handleSave = async (data: ScheduleData) => {
    try {
      await axios.post(`${process.env.NEXT_PUBLIC_PERSONAL_SCHEDULES}`, {
        name: data.name,
        schedules: data.schedules,
        specialSchedule: data.specialSchedule
      });
      toggle();
      reset();
      setSchedule(defaultValues)
    } catch (error) {
      // console.log(error);
    }
  };

  const handleClose = () => {
    toggle()
    reset()
  }

  const fetchSchedules = async () => {
    try {
      const response = await axios.get(`${process.env.NEXT_PUBLIC_PERSONAL_SCHEDULES}`);
      const schedules = response.data;
      return schedules;
    } catch (error) {
      return [];
    }
  };

  fetchSchedules();


  const handleClick = () => {
    setOpenList(!openList);
  };

  const icon = (
    <Paper sx={{ m: 1 }} elevation={10}>
      <Box sx={{ display: 'flex' }}>
        <Box component="div" sx={{ width: 300, height: 60, marginRight: '10px' }}>
          <TextField
            id="date"
            label="Fecha de inicio"
            type="date"
            defaultValue="2017-05-24"
            InputLabelProps={{
              shrink: true,
            }}  
            sx={{ width: '100%', height: '100%' }} // Añadido para ajustar el TextField al tamaño del Box
          /> 
        </Box>
        <Box component="div" sx={{ width: 300, height: 60 }}>
          <TextField
            id="date"
            label="Fecha Final"
            type="date"
            defaultValue="2017-05-24"
            InputLabelProps={{
              shrink: true,
            }}  
            sx={{ width: '100%', height: '100%' }} // Añadido para ajustar el TextField al tamaño del Box
          /> 
        </Box>
      </Box>
    </Paper>
  );
  
  
  return (
    <>
      <Button onClick={handleClose}
        variant="contained"
        color="primary"
        sx={{
          borderRadius: '8px',
          marginBottom: '15px',
          fontSize: '12px',
          fontWeight: 'bold',
          padding: '10px 20px',
          boxShadow: '0 3px 5px rgba(0, 0, 0, 0.2)',
          '&:hover': {
            backgroundColor: '#1565c0',

          },
        }}
      >
        Crear Horario Especial
      </Button>

      <Drawer
        open={open}
        anchor='right'
        variant='temporary'
        onClose={handleClose}
        ModalProps={{ keepMounted: true }}
        sx={{ '& .MuiDrawer-paper': { width: { xs: '100%', sm: '90%', md: '80%', lg: '70%' } } }} >

        <Header>
          <Typography variant='h6'>Agregar Horario Especial</Typography>
          <IconButton size='large' onClick={handleClose} sx={{ color: 'text.primary' }}>
            <Icon icon='mdi:close' fontSize={20} />
          </IconButton>
        </Header>

        <Box sx={{ p: 4 }}>
          <form onSubmit={handleSubmit(handleSave)}>
            <Typography variant="subtitle1" sx={{ fontWeight: 'bold', marginBottom: 2 }}>
              Nombre
            </Typography>

            <Controller
              name="name"
              control={control}
              render={({ field }) => (
                <TextField
                  label="Nombre"
                  {...field}
                  error={Boolean(errors.name)}
                  helperText={errors.name ? 'El nombre es requerido' : ''}
                  fullWidth
                />
              )}
            />

            <Box sx={{ marginTop: 4 }}>
              <Typography variant="subtitle1" sx={{ fontWeight: 'bold', marginBottom: 2 }}>
                Horarios
              </Typography>
              <Grid container spacing={2}>
                {['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo'].map((day, index) => (

                  <Grid item xs={12} key={index}>
                    <FormControlLabel
                      key={index}
                      control={<Checkbox name={`schedules[${index}].selected`} />}
                      label={day}
                    />
                    <FormGroup>
                      <Grid container spacing={2}>
                        <Grid item xs={2}>
                          <Typography variant="subtitle2">Entrada mañana</Typography>
                          <TextField
                          value={lunes?.morningEntry}
                          onChange={(e) => updateLunes('morningEntry', e.target.value)}
                                type="time"
                                fullWidth
                                inputProps={{ step: 300, autoComplete: 'off' }}
                              />
                        </Grid>
                        <Grid item xs={2}>
                          <Typography variant="subtitle2">Salida mañana</Typography>
                          <TextField
                          value={lunes?.morningExit}
                          onChange={(e) => updateLunes('morningExit', e.target.value)}
                                type="time"
                                fullWidth
                                inputProps={{ step: 300, autoComplete: 'off' }}
                              />
                        </Grid>
                        <Grid item xs={2}>
                          <Typography variant="subtitle2">Entrada Tarde</Typography>
                          <TextField
                          value={lunes?.afternoonEntry}
                          onChange={(e) => updateLunes('afternoonEntry', e.target.value)}
                                type="time"
                                fullWidth
                                inputProps={{ step: 300, autoComplete: 'off' }}
                              />
                        </Grid>
                        <Grid item xs={2}>
                          <Typography variant="subtitle2">Salida Tarde</Typography>
                          <TextField
                          value={lunes?.afternoonExit}
                          onChange={(e) => updateLunes('afternoonExit', e.target.value)}
                                type="time"
                                fullWidth
                                inputProps={{ step: 300, autoComplete: 'off' }}
                              />
                        </Grid>
                        <Grid item xs={2}>
                          <Typography variant="subtitle2">Tolerancia Entrada</Typography>
                          <TextField
                          value={lunes?.entryTolerance}
                          onChange={(e) => updateLunes('entryTolerance', e.target.value)}
                              type="number"
                              fullWidth
                              inputProps={{ min: 0, step: 1 }}
                              />
                        </Grid>
                        <Grid item xs={2}>
                          <Typography variant="subtitle2">Tolerancia Salida</Typography>
                          <TextField
                          value={lunes?.exitTolerance}
                          onChange={(e) => updateLunes('exitTolerance', e.target.value)}
                              type="number"
                              fullWidth
                              inputProps={{ min: 0, step: 1 }}
                              />
                        </Grid>
                      </Grid>
                    </FormGroup>
                  </Grid>
                ))}
              </Grid>
            </Box>

            {/* Agregar funcionalidad de fechas  */}

            <Box sx={{ height: 100, marginTop: 5  }}>
              <FormControlLabel
                control={<Switch checked={checked} onChange={handleChange} />}
                label="Temporal"
              />
              <Box sx={{ display: 'flex' }}>
                <Grow in={checked}>{icon}</Grow>
              </Box>
            </Box>

            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', marginTop: 10 }}>
              <Button size='large' type='submit' variant='contained' sx={{ marginRight: 6 }}>
                Aceptar
              </Button>
              <Button size='large' variant='outlined' color='secondary' onClick={handleClose}>
                Cancelar
              </Button>
            </Box>
          </form>
        </Box>
      </Drawer>
    </>
  )
};
export default SidebarAddSpecialSchedule







// Importaciones
import { yupResolver } from '@hookform/resolvers/yup';
import { Button, Checkbox, Collapse, Drawer, FormControlLabel, FormGroup, Grid, IconButton, List, ListItemButton, ListItemIcon, ListItemText, ListSubheader, TextField, Typography } from '@mui/material';
import Box, { BoxProps } from '@mui/material/Box';
import { styled } from '@mui/material/styles';
import { useState } from 'react';
import InboxIcon from '@mui/icons-material/MoveToInbox';
import ExpandLess from '@mui/icons-material/ExpandLess';
import ExpandMore from '@mui/icons-material/ExpandMore';
import StarBorder from '@mui/icons-material/StarBorder';
import axios from 'axios';

import { Controller, useForm, useFormContext } from 'react-hook-form';

import Icon from 'src/@core/components/icon'

import * as yup from 'yup';

// Creacion de Interfaces
interface SidebarAddScheduleType {
  open: boolean
  toggle: () => void
}

interface Schedule {
  day: number | null,
  morningEntry: string,
  morningExit: string,
  afternoonEntry: string,
  afternoonExit: string,
  entryTolerance: number,
  exitTolerance: number,
}

interface ScheduleData {
  name: string,
  schedules: Schedule[],
}

const Header = styled(Box)<BoxProps>(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  padding: theme.spacing(3, 4, '4', '5'),
  justifyContent: 'space-between',
  backgroundColor: theme.palette.background.default,
}))

const schema = yup.object().shape({
  name: yup.string().required("El nombre del horario es requerido"),
  schedules: yup.array().of(
    yup.object().shape({
      day: yup.number().min(0).max(6).required(),
      morningEntry: yup.string().required(),
      morningExit: yup.string().required(),
      afternoonEntry: yup.string().required(),
      afternoonExit: yup.string().required(),
      entryTolerance: yup.number().required(),
      exitTolerance: yup.number().required(),
    })
  )
});

const defaultValues = {
  name: "",
  schedules: [
    {
      day: null,
      morningEntry: "",
      morningExit: "",
      afternoonEntry: "",
      afternoonExit: "",
      entryTolerance: 0,
      exitTolerance: 0
    }
  ]
};

const SidebarAddHorario = (props: SidebarAddScheduleType) => {
  const { open, toggle } = props;

  const [schedule, setSchedule] = useState<ScheduleData>({
    name: '',
    schedules: [],
  });

  const [openList, setOpenList] = useState(true);

  const { reset, control, setValue, handleSubmit, formState: { errors }, getValues } = useForm({
    defaultValues,
    mode: 'onChange',
    resolver: yupResolver(schema)
  });



  const handleSave = async (data: ScheduleData) => {
    try {
      console.log(data);
      const filteredSchedules = data.schedules.filter(schedule => schedule.day !== null)

      const response = await axios.post(`http://10.10.214.80:3001/api/schedule`, {
        name: data.name,
        schedules: filteredSchedules.map(schedule => ({
          day: schedule.day,
          morningEntry: schedule.morningEntry,
          morningExit: schedule.morningExit,
          afternoonEntry: schedule.afternoonEntry,
          afternoonExit: schedule.afternoonExit,
          entryTolerance: schedule.entryTolerance,
          exitTolerance: schedule.exitTolerance,
        })),
      });

      console.log(response);
      if (response.status === 200 || response.status === 201) {
        toggle();
        reset();
      }
    } catch (error) {
      console.log('Error al crear un horario', error);
    }
  };

  const handleClose = () => {
    toggle()
    reset()
  }

  const dias = [
    { nombre: "Domingo", value: 0 },
    { nombre: "Lunes", value: 1 },
    { nombre: "Martes", value: 2 },
    { nombre: "Miercoles", value: 3 },
    { nombre: "Jueves", value: 4 },
    { nombre: "Viernes", value: 5 },
    { nombre: "Sabado", value: 6 }
  ];

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
        Crear Horario
      </Button>

      <Drawer
        open={open}
        anchor='right'
        variant='temporary'
        onClose={handleClose}
        ModalProps={{ keepMounted: true }}
        sx={{ '& .MuiDrawer-paper': { width: { xs: '50%', sm: '50%', md: '50%', lg: '50%' } } }} >
        <Header>
          <Typography variant='h6'> Crear Horario</Typography>
          <IconButton size='large' onClick={handleClose} sx={{ color: 'text.primary' }}>
            <Icon icon='mdi:close' fontSize={20} />
          </IconButton>
        </Header>

        <Box sx={{ p: { xs: 2, sm: 4, md: 6 } }}>
          <form onSubmit={handleSubmit(handleSave)}>
            <Typography variant="subtitle1" sx={{ fontWeight: 'bold', marginBottom: 2 }}>
              Nombre de Horario
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
                    {['Entrada Mañana', 'Salida Mañana', 'Entrada Tarde', 'Salida Tarde'].map((fieldKey) => (
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

                    {['Tolerancia Entrada', 'Tolerancia Salida'].map((fieldKey) => (
                      <Controller
                        key={fieldKey}
                        name={`schedules.${index}.${fieldKey}` as any}
                        control={control}
                        defaultValue={0}
                        render={({ field }) => (
                          <TextField
                            type="number"
                            label={fieldKey.replace(/[A-Z]/g, match => ` ${match.toLowerCase()}`) + " (min)"}
                            {...field}
                            sx={{ marginBottom: 1 }}
                            fullWidth
                          />
                        )}
                      />
                    ))}
                  </Box>
                </Box>
              ))}
            </Box>

            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', marginTop: 10 }}>
              <Button
                size='large' type='submit' variant='contained' sx={{ mr: 6 }}
              > Aceptar </Button>
              <Button size='large' variant='outlined' color='secondary' onClick={handleClose}
              > Cancelar </Button>
            </Box>
          </form>
        </Box>
      </Drawer>
    </>
  )
};
export default SidebarAddHorario
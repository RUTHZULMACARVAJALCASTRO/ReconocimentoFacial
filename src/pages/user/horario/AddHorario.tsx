import React, { useEffect, useState } from 'react';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Drawer from '@mui/material/Drawer';
import { styled } from '@mui/material/styles';
import Typography from '@mui/material/Typography';
import Box, { BoxProps } from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import Icon from 'src/@core/components/icon';
import { Grid } from '@mui/material';
import axios from 'axios';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { useForm, Controller } from 'react-hook-form';
import Checkbox from '@mui/material/Checkbox';
import FormGroup from '@mui/material/FormGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import data from './data.json'

interface ScheduleData {
  day: boolean[]; // Array of booleans for selected days
  morningEntry: string;
  morningExit: string;
  afternoonEntry: string;
  afternoonExit: string;
  entranceTolerance: number;
}

interface UserData {
  name: string;
  schedules: ScheduleData[];
}

const Header = styled(Box)<BoxProps>(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  padding: theme.spacing(3, 4),
  justifyContent: 'space-between',
  backgroundColor: theme.palette.background.default,
}));

const schema = yup.object().shape({
  name: yup.string().required(),
  schedules: yup.array().of(
    yup.object().shape({
      day: yup.array().of(yup.boolean()).required(),
      morningEntry: yup.string().required(),
      morningExit: yup.string().required(),
      afternoonEntry: yup.string().required(),
      afternoonExit: yup.string().required(),
      entranceTolerance: yup.number().required(),
    })
  ),
});
const defaultDaySchedule: ScheduleData = {
  day: [false, false, false, false, false, false, false],
  morningEntry: '',
  morningExit: '',
  afternoonEntry: '',
  afternoonExit: '',
  entranceTolerance: 0,
};

const defaultValues: UserData = {
  name: '',
  schedules: [
    {
      day: [false, false, false, false, false, false, false],
      morningEntry: '',
      morningExit: '',
      afternoonEntry: '',
      afternoonExit: '',
      entranceTolerance: 0,
    },
  ],
};

const dias = ['LUNES', 'MARTES', 'MIERCOLES', 'JUEVES', 'VIERNES', 'SABADO', 'DOMINGO'];

type SidebarAddHorarioType = {
  open: boolean;
  toggle: () => void;
};

const SidebarAddHorario = ({ open, toggle }: SidebarAddHorarioType) => {

  const [scheduleData, setScheduleData] = useState<UserData>(defaultValues);

  useEffect(() => {
    // Simular la carga de datos desde data.json
    const fetchData = async () => {
      try {
        const response = await axios.get('/data.json'); // Ruta correcta a data.json
        setScheduleData(response.data);
      } catch (error) {
        console.log(error);
      }
    };

    fetchData();
  }, []);
 
  const {
    reset,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<UserData>({
    defaultValues,
    mode: 'onChange',
    resolver: yupResolver(schema),
  });

const [LUNES, setLUNES] = useState<ScheduleData>(defaultDaySchedule);
const [MARTES, setMARTES] = useState<ScheduleData>(defaultDaySchedule);
const [MIERCOLES, setMIERCOLES] = useState<ScheduleData>(defaultDaySchedule);
const [JUEVES, setJUEVES] = useState<ScheduleData>(defaultDaySchedule);
const [VIERNES, setVIERNES] = useState<ScheduleData>(defaultDaySchedule);
const [SABADO, setSABADO] = useState<ScheduleData>(defaultDaySchedule);
const [DOMINGO, setDOMINGO] = useState<ScheduleData>(defaultDaySchedule);


  const handleSave = async (data: UserData) => {
    try {
      const transformedData: UserData = {
        name: data.name,
        schedules: [
          LUNES,
          MARTES,
          MIERCOLES,
          JUEVES,
          VIERNES,
          SABADO,
          DOMINGO,
        ],
      };
  
      // await axios.post(`${process.env.NEXT_PUBLIC_PERSONAL}`, transformedData);
  
      toggle();
      reset();
      window.location.reload();
    } catch (error) {
      console.log(error);
    }
  };


  const handleClose = () => {
    toggle();
    reset();
  };

  return (
    <>
      <Button
        onClick={handleClose}
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
        Agregar Horario
      </Button>
      <Drawer
        open={open}
        anchor="right"
        variant="temporary"
        onClose={handleClose}
        ModalProps={{ keepMounted: true }}
        sx={{
          '& .MuiDrawer-paper': { width: { xs: 300, sm: 500, md: 800, xl: 1200 } },
          backgroundColor: '#f5f5f5', // Color de fondo del Drawer
        }}
      >
        <Header>
          <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
            Crear Horario
          </Typography>
          <IconButton size="small" onClick={handleClose} sx={{ color: 'text.primary' }}>
            <Icon icon="mdi:close" fontSize={20} />
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
                {dias.map((nombreDia, diaIndex) => (
                  <Grid item xs={12} key={diaIndex}>
                    <Typography variant="subtitle2">{nombreDia}</Typography>
                    <FormGroup>
                      <Grid container spacing={2}>
                        <Grid item xs={2.5}>
                          <Typography variant="subtitle2">Entrada mañana</Typography>
                          <Controller
                            name={`schedules[${diaIndex}].morningEntry`}
                            control={control}
                            render={({ field }) => (
                              <TextField
                                type="time"
                                {...field}
                                fullWidth
                                error={Boolean(errors.schedules?.[diaIndex]?.morningEntry)}
                                inputProps={{ step: 300, autoComplete: 'off' }}
                              />
                            )}
                          />
                        </Grid>
                        <Grid item xs={2.5}>
                          <Typography variant="subtitle2">Salida mañana</Typography>
                          <Controller
                            name={`schedules[${diaIndex}].morningExit`}
                            control={control}
                            render={({ field }) => (
                              <TextField
                                type="time"
                                {...field}
                                fullWidth
                                error={Boolean(errors.schedules?.[diaIndex]?.morningExit)}
                                inputProps={{ step: 300, autoComplete: 'off' }}
                              />
                            )}
                          />
                        </Grid>
                        <Grid item xs={2.5}>
                          <Typography variant="subtitle2">Entrada Tarde</Typography>
                          <Controller
                            name={`schedules[${diaIndex}].afternoonEntry`}
                            control={control}
                            render={({ field }) => (
                              <TextField
                                type="time"
                                {...field}
                                fullWidth
                                error={Boolean(errors.schedules?.[diaIndex]?.afternoonEntry)}
                                inputProps={{ step: 300, autoComplete: 'off' }}
                              />
                            )}
                          />
                        </Grid>
                        <Grid item xs={2.5}>
                          <Typography variant="subtitle2">Salida Tarde</Typography>
                          <Controller
                            name={`schedules[${diaIndex}].afternoonExit`}
                            control={control}
                            render={({ field }) => (
                              <TextField
                                type="time"
                                {...field}
                                fullWidth
                                error={Boolean(errors.schedules?.[diaIndex]?.afternoonExit)}
                                inputProps={{ step: 300, autoComplete: 'off' }}
                              />
                            )}
                          />
                        </Grid>
                        <Grid item xs={2}>
                        <Typography variant="subtitle2">Tolerancia</Typography>
                        <Controller
                          name={`schedules[${diaIndex}].entranceTolerance`}
                          control={control}
                          render={({ field }) => (
                            <TextField
                              type="number"
                              {...field}
                              fullWidth
                              error={Boolean(errors.schedules?.[diaIndex]?.entranceTolerance)}
                              inputProps={{ min: 0, step: 1 }}
                            />
                          )}
                        />
                      </Grid>
                      </Grid>
                    </FormGroup>
                  </Grid>
                ))}
              </Grid>

            </Box>
            <Box sx={{ display: 'flex', justifyContent: 'center', marginTop: 4 }}>
              <Button
                size="large"
                type="submit"
                variant="contained"
                sx={{ marginRight: 2, backgroundColor: '#1976d2', color: 'white', '&:hover': { backgroundColor: '#1565c0' } }}
              >
                Aceptar
              </Button>
              <Button
                size="large"
                variant="outlined"
                color="secondary"
                onClick={handleClose}
                sx={{ borderColor: '#f44336', color: '#f44336', '&:hover': { backgroundColor: '#fdecec' } }}
              >
                Cancelar
              </Button>
            </Box>
          </form>
        </Box>
      </Drawer>
    </>
  );
};

export default SidebarAddHorario;

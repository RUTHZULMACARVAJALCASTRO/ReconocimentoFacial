import React, { useState } from 'react';
import TextField, { FilledTextFieldProps, OutlinedTextFieldProps, StandardTextFieldProps, TextFieldVariants } from '@mui/material/TextField';
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
import Switch from '@mui/material/Switch';
import Fade from '@mui/material/Fade';
import DateRangePicker, { DateRange } from '@mui/lab/DateRangePicker';
import {DatePicker, KeyboardDatePicker} from '@mui/lab'

interface ScheduleData {
  dias: number;
  morningEntry: string;
  morningExit: string;
  afternoonEntry: string;
  afternoonExit: string;
  entryTolerance: number;
  startDate?: Date | null; // New field for start date
  endDate?: Date | null;   // New field for end date
}

interface UserData {
  name: string;
  schedules: ScheduleData[];
  isPermanent: boolean;
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
      dias: yup.number().required(),
      morningEntry: yup.string().required(),
      morningExit: yup.string().required(),
      afternoonEntry: yup.string().required(),
      afternoonExit: yup.string().required(),
      entryTolerance: yup.number().required(),
    })
  ),
  isPermanent: yup.boolean().required(),
});

const defaultDaySchedule: ScheduleData = {
  dias: 0,
  morningEntry: '',
  morningExit: '',
  afternoonEntry: '',
  afternoonExit: '',
  entryTolerance: 0,
};

const defaultValues: UserData = {
  name: '',
  schedules: [
    {
      dias: 0,
      morningEntry: '',
      morningExit: '',
      afternoonEntry: '',
      afternoonExit: '',
      entryTolerance: 0,
    },
  ],
  isPermanent: false,
};

const dias = ['LUNES', 'MARTES', 'MIERCOLES', 'JUEVES', 'VIERNES', 'SABADO', 'DOMINGO'];

type SidebarAddScheduleType = {
  open: boolean;
  toggle: () => void;
};

const SidebarAddSchedule = ({ open, toggle }: SidebarAddScheduleType) => {
  const [scheduleData, setScheduleData] = useState<UserData>(defaultValues);
  const [showDateRange, setShowDateRange] = useState(false); // State for showing date range picker
  const [currentDayIndex, setCurrentDayIndex] = useState<number>(0); // Index of the current day being edited


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

  const currentSchedule = scheduleData.schedules[currentDayIndex];

  const handleDateRangeChange = (dates: Date[]) => {
    const [startDate, endDate] = dates;
    setScheduleData((prevData) => ({
      ...prevData,
      schedules: prevData.schedules.map((schedule, index) =>
        index === currentDayIndex
          ? { ...schedule, startDate, endDate }
          : schedule
      ),
    }));
  };
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
        isPermanent: data.isPermanent,
      };

      await axios.post(`${process.env.NEXT_PUBLIC_PERSONAL}`, transformedData);

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
        Agregar Horario Especial
      </Button>
      <Drawer
        open={open}
        anchor="right"
        variant="temporary"
        onClose={handleClose}
        ModalProps={{ keepMounted: true }}
        sx={{
          '& .MuiDrawer-paper': { width: { xs: 300, sm: 500, md: 800, xl: 1200 } },
          backgroundColor: '#f5f5f5', // Drawer background color
        }}
      >
        <Header>
          <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
            Crear Horario Especial
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
                Horarios Especiales
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
                            name={`schedules[${diaIndex}].entryTolerance`}
                            control={control}
                            render={({ field }) => (
                              <TextField
                                type="number"
                                {...field}
                                fullWidth
                                error={Boolean(errors.schedules?.[diaIndex]?.entryTolerance)}
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
            <FormControlLabel
              control={
                <Switch
                  checked={showDateRange}
                  onChange={() => setShowDateRange((prev) => !prev)}
                />
              }
              label="Horario Temporal"
              sx={{ marginTop: 2 }}
            />
            {showDateRange && !scheduleData.isPermanent && (
              <Fade in={showDateRange}>
                <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginTop: 2 }}>
                  <DatePicker
                    label="Fecha de inicio"
                    value={currentSchedule.startDate || null}
                    onChange={(date: Date) => handleDateRangeChange([date, currentSchedule.endDate])}
                    renderInput={(params: JSX.IntrinsicAttributes & { variant?: TextFieldVariants | undefined; } & Omit<FilledTextFieldProps | OutlinedTextFieldProps | StandardTextFieldProps, "variant">) => <TextField {...params} variant="outlined" size="small" margin="normal" />}
                  />
                  <DatePicker
                    label="Fecha de fin"
                    value={currentSchedule.endDate || null}
                    onChange={(date: Date) => handleDateRangeChange([currentSchedule.startDate, date])}
                    renderInput={(params: JSX.IntrinsicAttributes & { variant?: TextFieldVariants | undefined; } & Omit<OutlinedTextFieldProps | FilledTextFieldProps | StandardTextFieldProps, "variant">) => <TextField {...params} variant="outlined" size="small" margin="normal" />}
                  />
                </Box>
              </Fade>
            )}
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

export default SidebarAddSchedule;

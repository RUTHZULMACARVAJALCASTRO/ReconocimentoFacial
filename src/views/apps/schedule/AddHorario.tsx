import React, { forwardRef, useEffect, useState } from 'react';
import {
  useForm,
  Controller,
} from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import {
  Card,
  CardContent,
  Checkbox,
  TextField,
  Button,
  Box,
  Tab,
  Divider,
  CardActions,
  FormControlLabel,
  Collapse,
  FormLabel,
  List,
  ListItem,
  FormGroup,
  ListItemIcon,
  ListItemText,
  FormControl,
  Switch,
  useTheme,
  InputLabel,
  MenuItem,
  Select,
  InputAdornment,
} from '@mui/material';
import TabContext from '@mui/lab/TabContext';
import TabList from '@mui/lab/TabList';
import TabPanel from '@mui/lab/TabPanel';
import Drawer from '@mui/material/Drawer';
import ScrollBar from 'react-perfect-scrollbar';
import axios from 'axios';
import DatePickerWrapper from 'src/@core/styles/libs/react-datepicker';
import { ReactDatePickerProps } from 'react-datepicker';
import { DateType } from 'src/components/PickersTime';
import addDays from 'date-fns/addDays';
import { format } from 'date-fns';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { Cipher } from 'crypto';

import { useDispatch } from 'react-redux'
import { addSchedule } from 'src/store/apps/schedule/index'
import { AppDispatch } from 'src/redux/store';
import SearchIcon from '@material-ui/icons/Search';
import Grid from '@mui/material/Grid';
import { makeStyles } from '@material-ui/core/styles';

interface SidebarAddHorarioType {
  open: boolean;
  toggle: () => void;
}

interface Schedule {
  day: number;
  into: string;
  out: string;
  intoTwo: string;
  outTwo: string;
  toleranceInto: number;
  toleranceOut: number;
}

interface ScheduleSpecial {
  name: string;
  day: number;
  into: string;
  out: string;
  intoTwo: string;
  outTwo: string;
  toleranceInto: number;
  toleranceOut: number;
  permanente: boolean;
  dateRange: [string | null, string | null];
  usersAssigned: string[];
}

interface ScheduleData {
  name: string;
  scheduleNormal: Schedule[];
  scheduleSpecial: ScheduleSpecial[];
}

interface User {
  _id: string;
  name: string;
  lastName: string;
}

type PickerProps = {
  start: Date | null;
  end: Date | null;
  label?: string;
};

interface PickersRangeProps {
  selectedDateRange: (string | null)[];
  onDateRangeChange: (newRange: [string, string]) => void;
  popperPlacement: "bottom";
}

interface DayData {
  selectedUsers: string[];
  selectedDateRange: [string | null, string | null];
  permanente: boolean;
}

interface SpecialDaysData {
  [key: string]: DayData;
}


const useStyles = makeStyles((theme) => ({
  listContainer: {
    maxHeight: '300px', // Puedes ajustar el valor según tus necesidades
    overflowY: 'auto',
    border: '1px solid #ccc', // Define el borde del cuadrado
    borderRadius: '5px', // Agrega un pequeño borde redondeado
    padding: theme.spacing(1),
  },
}));

const PickersRange = ({
  selectedDateRange,
  onDateRangeChange,
  popperPlacement,
}: PickersRangeProps) => {
  const [dates, setDates] = useState<[Date | null, Date | null]>([null, null]);

  const CustomInput = React.forwardRef((props: PickerProps, ref) => {
    const formattedStartDate = props.start ? props.start.toLocaleDateString() : '';
    const formattedEndDate = props.end ? props.end.toLocaleDateString() : '';
    const value = props.end ? `${formattedStartDate} - ${formattedEndDate}` : formattedStartDate;

    return <TextField inputRef={ref} label={props.label || ''} {...props} value={value} />;
  });

  const handleDateChange = (dates: [Date | null, Date | null]) => {
    setDates(dates);

    if (!dates[0] || !dates[1]) {
      console.error("Ambas fechas, inicio y final, deben ser seleccionadas.");
      return;
    }

    if (dates[0] && dates[1] && dates[0] > dates[1]) {
      console.error("La fecha de inicio no puede ser posterior a la fecha de finalización");
      return;
    }

    const formattedStart = dates[0]?.toISOString() || '';
    const formattedEnd = dates[1]?.toISOString() || '';

    onDateRangeChange([formattedStart, formattedEnd]);
  };


  return (
    <Box sx={{ display: 'flex', flexWrap: 'wrap' }} className='demo-space-x'>
      <div>
        <DatePicker
          selectsRange
          startDate={dates[0]}
          endDate={dates[1]}
          onChange={handleDateChange}
          shouldCloseOnSelect={false}
          popperPlacement={popperPlacement}
          customInput={<CustomInput label='Date Range' start={dates[0]} end={dates[1]} />}
        />
      </div>
    </Box>
  );
};


const SidebarAddHorario = (props: SidebarAddHorarioType) => {
  const { open, toggle } = props;
  const [selectedDays, setSelectedDays] = useState<number[]>([]);
  const [selectedDaysSpecial, setSelectedDaysSpecial] = useState<number[]>([]);
  const [isAtLeastOneDaySelected, setIsAtLeastOneDaySelected] = useState(false);
  const [value, setValue] = useState('Horario Normal');
  const [usersError, setUsersError] = useState('');
  const [selectedDateRange, setSelectedDateRange] = useState<string[]>([]);
  const [dateRange, setDateRange] = useState<string[]>([]);
  const [selectedUserId, setSelectedUserId] = useState("");
  const [users, setUsers] = useState<User[]>([]);
  const [selectedUsers, setSelectedUsers] = useState<string[]>([]);
  const [isPermanent, setIsPermanent] = useState(true);
  const [usersAssigned, setUsersAssigned] = useState<string[]>([]);
  const [specialDaysData, setSpecialDaysData] = useState<SpecialDaysData>({});
  const [isUserModalOpen, setUserModalOpen] = useState(false);
  const dispatch: AppDispatch = useDispatch();
  const classes = useStyles();

  const fetchUsers = async () => {
    try {
      const response = await axios.get(`${process.env.NEXT_PUBLIC_PERSONAL}`);
      return response.data;
    } catch (error) {
      console.log(error);
      return [];
    }
  };

  useEffect(() => {
    const fetchUsersData = async () => {
      try {
        const usersResponse = await fetchUsers();
        setUsers(usersResponse);
        console.log(usersResponse);
      } catch (error) {
        console.log(error);
      }
    };
    fetchUsersData();
  }, []);

  const schema = yup.object().shape({
    name: yup.string().required('El nombre del horario es requerido'),
    scheduleNormal: yup.array().of(
      yup.object().shape({
        day: yup.number().min(0).max(6),
        into: yup.string().when('day', (day, schema) =>
          selectedDays.includes(day) ? schema : schema
        ),
        out: yup.string().when('day', (day, schema) =>
          selectedDays.includes(day) ? schema : schema
        ),
        intoTwo: yup.string().when('day', (day, schema) =>
          selectedDays.includes(day) ? schema : schema
        ),
        outTwo: yup.string().when('day', (day, schema) =>
          selectedDays.includes(day) ? schema : schema
        ),
        toleranceInto: yup.number().when('day', (day, schema) =>
          selectedDays.includes(day) ? schema : schema
        ),
        toleranceOut: yup.number().when('day', (day, schema) =>
          selectedDays.includes(day) ? schema : schema
        ),
      })
    ),
    scheduleSpecial: yup.array().of(
      yup.object().shape({
        day: yup.number().min(0).max(6),
        name: yup.string().required('El nombre del día especial es requerido'),
        into: yup.string(),
        out: yup.string(),
        intoTwo: yup.string(),
        outTwo: yup.string(),
        toleranceInto: yup.number(),
        toleranceOut: yup.number(),
        permanente: yup.boolean(),
        dateRange: yup.array(),
        usersAssigned: yup.array(),
      })
    ),
  });

  const dias = [
    { nombre: 'Lunes', value: 1 },
    { nombre: 'Martes', value: 2 },
    { nombre: 'Miércoles', value: 3 },
    { nombre: 'Jueves', value: 4 },
    { nombre: 'Viernes', value: 5 },
    { nombre: 'Sábado', value: 6 },
    { nombre: 'Domingo', value: 0 },
  ];

  const defaultValues: ScheduleData = {
    name: '',
    scheduleNormal: dias.map(dia => ({
      day: dia.value,
      into: '08:00',
      out: '12:00',
      intoTwo: '14:00',
      outTwo: '18:00',
      toleranceInto: 15,
      toleranceOut: 15,
    })),
    scheduleSpecial: dias.map(dia => ({
      name: 'Descripcion',
      day: dia.value,
      into: '08:00',
      out: '12:00',
      intoTwo: '13:00',
      outTwo: '17:00',
      toleranceInto: 15,
      toleranceOut: 15,
      permanente: true,
      dateRange: [null, null],
      usersAssigned: [],
    })),
  };
  //dateRange: [new Date().toISOString(), new Date().toISOString()], // Esto simplemente pone la fecha actual como rango por defecto

  const handleUserCheckboxChange = (dayValue: string, userId: string, isChecked: boolean) => {
    console.log(`Checkbox change for user: ${userId} on day: ${dayValue}. Checked: ${isChecked}`);

    setSpecialDaysData(prevState => {
      if (!prevState[dayValue]) return prevState;
      const dayData = prevState[dayValue] || { selectedUsers: [] };
      const updatedUsers = isChecked
        ? [...dayData.selectedUsers, userId]
        : dayData.selectedUsers.filter(id => id !== userId);

      return {
        ...prevState,
        [dayValue]: {
          ...dayData,
          selectedUsers: updatedUsers,
        }
      };
    });

    console.log('entraa', specialDaysData);
  };

  const theme = useTheme()
  const { direction } = theme
  const popperPlacement: ReactDatePickerProps['popperPlacement'] = direction === 'ltr' ? 'bottom-start' : 'bottom-end'


  type PermanentStatesType = {
    [key: number]: boolean;
  };

  const { reset, control, handleSubmit, formState: { errors } } = useForm({
    defaultValues,
    mode: 'onChange',
    resolver: yupResolver(schema),
  });

  const handleDaySelect = (dayValue: number) => {
    if (selectedDays.includes(dayValue)) {
      setSelectedDays(selectedDays.filter((day) => day !== dayValue));
    } else {
      setSelectedDays([...selectedDays, dayValue]);
    }
  }

  const handleDaySpecialSelect = (dayValue: string) => {
    const dayNumber = parseInt(dayValue, 10);

    const isDaySelected = selectedDaysSpecial.includes(dayNumber);
    if (isDaySelected) {
      setSelectedDaysSpecial(prev => prev.filter(day => day !== dayNumber));
    } else {
      setSelectedDaysSpecial(prev => [...prev, dayNumber]);
    }

    setSpecialDaysData(prevState => {
      const dayData: DayData = prevState[dayValue] || {
        selectedUsers: [],
        selectedDateRange: []
      };

      if (isDaySelected) {
        const { [dayValue]: _, ...rest } = prevState;
        return rest;
      } else {
        return {
          ...prevState,
          [dayValue]: dayData
        };
      }
    });

    console.log('entraa 1', specialDaysData);
  };

  const handleDateRangeChange = (dayValue: string, newRange: [string, string]) => {
    setSpecialDaysData(prevState => {
      const dayData = prevState[dayValue] || {};
      const updatedData = {
        ...prevState,
        [dayValue]: {
          ...dayData,
          selectedDateRange: newRange
        }
      };
      return updatedData;
    });
  };

  const togglePermanentForDay = (dayValue: string) => {
    setSpecialDaysData(prevState => {
      const currentPermanente = prevState[dayValue]?.permanente;
      const updatedPermanente = !currentPermanente;

      return {
        ...prevState,
        [dayValue]: {
          ...prevState[dayValue],
          permanente: updatedPermanente,
        }
      };
    });
  };


  const handleSave = async (data: ScheduleData) => {
    if (!isAtLeastOneDaySelected) {
      setUsersError('Selecciona al menos un día antes de guardar');
      return;
    }

    const filteredScheduleNormal = data.scheduleNormal.filter(schedule => selectedDays.includes(schedule.day));
    console.log(filteredScheduleNormal)

    const filteredScheduleSpecial = data.scheduleSpecial.map(scheduleSpecial => {
      const dayValue = scheduleSpecial.day.toString();
      const specificDayData = specialDaysData[dayValue] || {};
      return {
        ...scheduleSpecial,
        permanente: specificDayData.permanente !== undefined ? specificDayData.permanente : true,
        // permanente: isPermanent,
        dateRange: specificDayData.selectedDateRange || [],
        usersAssigned: specificDayData.selectedUsers || [],
      }
    }).filter(scheduleSpecial => selectedDaysSpecial.includes(scheduleSpecial.day));

    try {
      dispatch(addSchedule({
        name: data.name,
        scheduleNormal: filteredScheduleNormal,
        scheduleSpecial: filteredScheduleSpecial,
      }));

      toggle();
      reset(defaultValues);

    } catch (error) {
      // Enviar un mensaje de error (ocurrio un error. Vuelva a intentarlo)
      console.error("Error al enviar datos al servidor:", error);
    }
  };

  useEffect(() => {
    setIsAtLeastOneDaySelected(selectedDays.length > 0);
  }, [selectedDays, selectedDaysSpecial]);

  const handleClose = () => {
    toggle();
    reset();
    setUsersError('');
  };


  const [searchValue, setSearchValue] = useState('');
  const [filteredUsers, setFilteredUsers] = useState(users);
  const [searchBy, setSearchBy] = useState('name');

  // const handleSearch = async () => {
  //   if (searchValue) {
  //     try {
  //       const response = await axios.get(`https://fine-experts-push.loca.lt/api/personal/filtered?name=${searchValue}`);
  //       if (response.data && response.data.data) {
  //         setFilteredUsers(response.data.data);
  //       }
  //     } catch (error) {
  //       console.error("Error buscando usuarios:", error);
  //     }
  //   } else {
  //     setFilteredUsers(users);
  //   }
  // };

  const handleSearch = async () => {
    if (searchValue) {
      try {
        const url = `http://10.10.214.124:3000/api/personal/filtered?${searchBy}=${searchValue}`;
        const response = await axios.get(url);
        setFilteredUsers(response.data.data); if (response.data && response.data.data) {
          setFilteredUsers(response.data.data);
        }
      } catch (error) {
        console.error("Error buscando usuarios:", error);
      }
    } else {
      setFilteredUsers(users);
    }
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
        Crear Horario
      </Button>
      <Drawer
        open={open}
        anchor="right"
        variant="temporary"
        onClose={handleClose}
        ModalProps={{ keepMounted: true }}
        sx={{ '& .MuiDrawer-paper': { width: { xs: 200, sm: 400, md: 600, xl: 1000 } } }}
      >
        <ScrollBar>
          <Card>
            <TabContext value={value}>
              <TabList
                variant="scrollable"
                scrollButtons={false}
                onChange={(event: any, newValue: React.SetStateAction<string>) => setValue(newValue)}
                sx={{ borderBottom: (theme) => `1px solid ${theme.palette.divider}` }}
              >
                <Tab value="Horario Normal" label="Horario Normal" />
                <Tab value="Horario Especial" label="Horario Especial" />
              </TabList>

              <form onSubmit={handleSubmit(handleSave)}>
                <CardContent>
                  <TabPanel value="Horario Normal">
                    <Grid item xs={12} md={12}>
                      <Controller
                        name="name"
                        control={control}
                        rules={{ required: true }}
                        render={({ field: { value, onChange } }) => (
                          <TextField
                            value={value}
                            label="Nombre del Horario"
                            onChange={onChange}
                            error={Boolean(errors.name)}
                            inputProps={{ autoComplete: 'off' }}
                            sx={{ marginBottom: (theme) => theme.spacing(7) }}
                          />
                        )}
                      />
                    </Grid>
                    <Grid container spacing={10}>
                      {dias.map((dia, index) => (
                        <Grid item xs={6} sm={4} key={dia.value}>
                          <FormControlLabel
                            control={
                              <Controller
                                name={`scheduleNormal.${index}.day`}
                                control={control}

                                render={({ field }) => (
                                  <Checkbox
                                    checked={selectedDays.includes(dia.value)}
                                    onChange={() => handleDaySelect(dia.value)}
                                    color="primary"
                                  />
                                )}
                              />
                            }
                            label={dia.nombre}
                          />
                          <Box mb={3}>
                            <Controller
                              name={`scheduleNormal.${index}.into`}
                              control={control}
                              render={({ field }) => (
                                <TextField
                                  label="Entrada 1"
                                  type="time"
                                  {...field}
                                  error={Boolean(errors.scheduleNormal?.[index]?.into)}
                                  helperText={errors.scheduleNormal?.[index]?.into?.message}
                                  fullWidth
                                />
                              )}
                            />
                          </Box>
                          <Box mb={3}>
                            <Controller
                              name={`scheduleNormal.${index}.out`}
                              control={control}
                              render={({ field }) => (
                                <TextField
                                  label="Salida 1"
                                  type="time"
                                  {...field}
                                  error={Boolean(errors.scheduleNormal?.[index]?.out)}
                                  helperText={errors.scheduleNormal?.[index]?.out?.message}
                                  fullWidth
                                />
                              )}
                            />
                          </Box>
                          <Box mb={3}>
                            <Controller
                              name={`scheduleNormal.${index}.intoTwo`}
                              control={control}
                              render={({ field }) => (
                                <TextField
                                  label="Entrada 2"
                                  type="time"
                                  {...field}
                                  error={Boolean(errors.scheduleNormal?.[index]?.intoTwo)}
                                  helperText={errors.scheduleNormal?.[index]?.intoTwo?.message}
                                  fullWidth
                                />
                              )}
                            />
                          </Box>
                          <Box mb={3}>
                            <Controller
                              name={`scheduleNormal.${index}.outTwo`}
                              control={control}
                              render={({ field }) => (
                                <TextField
                                  label="Salida 2"
                                  type="time"
                                  {...field}
                                  error={Boolean(errors.scheduleNormal?.[index]?.outTwo)}
                                  helperText={errors.scheduleNormal?.[index]?.outTwo?.message}
                                  fullWidth
                                />
                              )}
                            />
                          </Box>
                          <Box mb={3}>
                            <Controller
                              name={`scheduleNormal.${index}.toleranceInto`}
                              control={control}
                              render={({ field }) => (
                                <TextField
                                  label="Tolerancia Entrada"
                                  type="number"
                                  {...field}
                                  error={Boolean(errors.scheduleNormal?.[index]?.toleranceInto)}
                                  helperText={errors.scheduleNormal?.[index]?.toleranceInto?.message}
                                  fullWidth
                                />
                              )}
                            />
                          </Box>
                          <Controller
                            name={`scheduleNormal.${index}.toleranceOut`}
                            control={control}
                            render={({ field }) => (
                              <TextField
                                label="Tolerancia Salida"
                                type="number"
                                {...field}
                                error={Boolean(errors.scheduleNormal?.[index]?.toleranceOut)}
                                helperText={errors.scheduleNormal?.[index]?.toleranceOut?.message}
                                fullWidth
                              />
                            )}
                          />
                        </Grid>
                      ))}
                    </Grid>
                  </TabPanel>
                  <form onSubmit={handleSubmit(handleSave)}>
                    <TabPanel value="Horario Especial">
                      {dias.map((dia, index) => (
                        <Grid item xs={6} sm={4} key={dia.value}>
                          <FormControlLabel
                            control={
                              <Controller
                                name={`scheduleSpecial.${dia.value}.day`}
                                control={control}
                                render={({ field: { onChange, value } }) => (
                                  <Checkbox
                                    edge="start"
                                    checked={!!specialDaysData[dia.value.toString()]}  // Convertido a string aquí
                                    onChange={() => handleDaySpecialSelect(dia.value.toString())}  // Y aquí también
                                    color="primary"
                                  />
                                )}
                              />
                            }
                            label={dia.nombre}
                          />


                          <Collapse in={selectedDaysSpecial.includes(dia.value)}>
                            <Box>
                              <Controller
                                name={`scheduleSpecial.${index}.name`}
                                control={control}
                                rules={{ required: true }}
                                render={({ field: { value, onChange } }) => (
                                  <TextField
                                    value={value}
                                    label='Descripcion'
                                    onChange={onChange}
                                    error={Boolean(errors.name)}
                                    inputProps={{ autoComplete: "off" }}
                                    sx={{ marginBottom: theme => theme.spacing(5) }}
                                    fullWidth
                                  />
                                )}
                              />
                            </Box>

                            <Grid container spacing={2}>
                              <Grid item xs={6}>
                                <Box mb={2}>
                                  <Controller
                                    name={`scheduleSpecial.${index}.into`}
                                    control={control}
                                    render={({ field }) => (
                                      <TextField
                                        // className={classes.hideTimePlaceholder}
                                        label="Entrada 1"
                                        type="time"
                                        {...field}
                                        error={Boolean(errors.scheduleNormal?.[index]?.into)}
                                        helperText={errors.scheduleNormal?.[index]?.into?.message}
                                        fullWidth
                                      />
                                    )}
                                  />
                                </Box>
                              </Grid>

                              <Grid item xs={6}>
                                <Box mb={2}>
                                  <Controller
                                    name={`scheduleSpecial.${index}.out`}
                                    control={control}
                                    render={({ field }) => (
                                      <TextField
                                        // className={classes.hideTimePlaceholder}
                                        label='Salida 1'
                                        type="time"
                                        {...field}
                                        error={Boolean(errors.scheduleNormal?.[index]?.out)}
                                        helperText={errors.scheduleNormal?.[index]?.out?.message}
                                        fullWidth
                                      />
                                    )}
                                  />
                                </Box>
                              </Grid>

                              <Grid item xs={6}>
                                <Box mb={2}>
                                  <Controller
                                    name={`scheduleSpecial.${index}.intoTwo`}
                                    control={control}
                                    render={({ field }) => (
                                      <TextField
                                        // className={classes.hideTimePlaceholder}
                                        label='Entrada 2'
                                        type="time"
                                        {...field}
                                        error={Boolean(errors.scheduleNormal?.[index]?.intoTwo)}
                                        helperText={errors.scheduleNormal?.[index]?.intoTwo?.message}
                                        fullWidth
                                      />
                                    )}
                                  />
                                </Box>
                              </Grid>

                              <Grid item xs={6}>
                                <Box mb={2}>
                                  <Controller
                                    name={`scheduleSpecial.${index}.outTwo`}
                                    control={control}
                                    render={({ field }) => (
                                      <TextField
                                        // className={classes.hideTimePlaceholder}
                                        label='Salida 2'
                                        type="time"
                                        {...field}
                                        error={Boolean(errors.scheduleNormal?.[index]?.outTwo)}
                                        helperText={errors.scheduleNormal?.[index]?.outTwo?.message}
                                        fullWidth
                                      />
                                    )}
                                  />
                                </Box>
                              </Grid>

                              <Grid item xs={6}>
                                <Box mb={2}>
                                  <Controller
                                    name={`scheduleSpecial.${index}.toleranceInto`}
                                    control={control}
                                    render={({ field }) => (
                                      <TextField
                                        // className={classes.hideTimePlaceholder}
                                        label='Tolerancia Entrada'
                                        type="number"
                                        {...field}
                                        error={Boolean(errors.scheduleNormal?.[index]?.toleranceInto)}
                                        helperText={errors.scheduleNormal?.[index]?.toleranceInto?.message}
                                        fullWidth
                                      />
                                    )}
                                  />
                                </Box>
                              </Grid>

                              <Grid item xs={6}>
                                <Box mb={2}>
                                  <Controller
                                    name={`scheduleSpecial.${index}.toleranceOut`}
                                    control={control}
                                    render={({ field }) => (
                                      <TextField
                                        // className={classes.hideTimePlaceholder}
                                        label='Tolerancia Salida'
                                        type="number"
                                        {...field}
                                        error={Boolean(errors.scheduleNormal?.[index]?.toleranceOut)}
                                        helperText={errors.scheduleNormal?.[index]?.toleranceOut?.message}
                                        fullWidth
                                      />
                                    )}
                                  />
                                </Box>
                              </Grid>
                              {/* <Grid item xs={6}>
                                <Box mb={2}>
                                  <FormControl component="fieldset">
                                    <FormLabel component="legend">Seleccionar usuarios</FormLabel>
                                    <Box display="flex" alignItems="center" mb={2}>
                                      <TextField
                                        variant="outlined"
                                        placeholder="Buscar usuario..."
                                        value={searchValue}
                                        onChange={(e) => setSearchValue(e.target.value)}
                                        fullWidth
                                      />
                                      <Button onClick={handleSearch} color="primary">
                                        Buscar
                                      </Button>
                                    </Box>

                                    <List dense>
                                      {filteredUsers.map((user) => (
                                        <ListItem key={user._id}>
                                          <ListItemIcon>
                                            <Checkbox
                                              edge="start"
                                              checked={specialDaysData[dia.value.toString()]?.selectedUsers?.includes(user._id) || false}
                                              onChange={(e) => handleUserCheckboxChange(dia.value.toString(), user._id, e.target.checked)}
                                              color="primary"
                                            />
                                          </ListItemIcon>
                                          <ListItemText primary={`${user.name} ${user.lastName}`} />
                                        </ListItem>
                                      ))}
                                    </List>
                                  </FormControl>
                                </Box>
                              </Grid> */}
                              <Grid item xs={12}>
                                <Box mb={2}>
                                  <FormControl component="fieldset">
                                    <FormLabel component="legend">Seleccionar usuarios</FormLabel>
                                    <br />
                                    {/* Agregando buscador */}
                                    <Box display="flex" alignItems="center" mb={2}>
                                      {/* Selector para elegir la propiedad por la cual buscar */}

                                      <Box mb={2}>
                                        <FormControl variant="outlined" style={{ marginRight: '30px' }}>
                                          <InputLabel>Buscar por</InputLabel>
                                          <Select
                                            value={searchBy}
                                            onChange={(e) => setSearchBy(e.target.value)}
                                            label="Buscar por"
                                          >
                                            <MenuItem value="name">Nombre</MenuItem>
                                            <MenuItem value="lastName">Apellido</MenuItem>
                                            <MenuItem value="nationality">Nacionalidad</MenuItem>
                                            <MenuItem value="ci">CI</MenuItem>
                                            <MenuItem value="address">Dirección</MenuItem>
                                            <MenuItem value="phone">Teléfono</MenuItem>
                                            <MenuItem value="email">Email</MenuItem>
                                            <MenuItem value="isActive">Estado Activo</MenuItem>
                                          </Select>
                                        </FormControl>
                                      </Box>


                                      {/* <TextField
                                        variant="outlined"
                                        placeholder="Buscar usuario..."
                                        value={searchValue}
                                        onChange={(e) => setSearchValue(e.target.value)}
                                        fullWidth
                                      />
                                      <Button onClick={handleSearch} color="primary">
                                        <SearchIcon />
                                        Buscar
                                      </Button> */}

                                      <Box mb={2}>
                                        <TextField
                                          variant="outlined"
                                          placeholder="Buscar usuario..."
                                          value={searchValue}
                                          onChange={(e) => setSearchValue(e.target.value)}
                                          fullWidth
                                          InputProps={{
                                            endAdornment: (
                                              <InputAdornment position="end">
                                                <Button onClick={handleSearch} color="primary">
                                                  <SearchIcon />
                                                  Buscar
                                                </Button>
                                              </InputAdornment>
                                            ),
                                          }}
                                        />
                                      </Box>

                                    </Box>

                                    {searchValue && (
                                      <Box className={classes.listContainer}>
                                        <List dense>
                                          {filteredUsers.map((user) => (
                                            <ListItem key={user._id}>
                                              <ListItemIcon>
                                                <Checkbox
                                                  edge="start"
                                                  checked={specialDaysData[dia.value.toString()]?.selectedUsers?.includes(user._id) || false}
                                                  onChange={(e) => handleUserCheckboxChange(dia.value.toString(), user._id, e.target.checked)}
                                                  color="primary"
                                                />
                                              </ListItemIcon>
                                              <ListItemText primary={`${user.name} ${user.lastName}`} />
                                            </ListItem>
                                          ))}
                                        </List>
                                      </Box>
                                    )}

                                  </FormControl>
                                </Box>
                              </Grid>

                              <Grid item xs={12}>
                                <Box mb={2}>
                                  <FormControlLabel
                                    control={
                                      <Switch
                                        checked={!specialDaysData[dia.value]?.permanente}
                                        onChange={() => togglePermanentForDay(String(dia.value))}
                                      />
                                    }
                                    label={specialDaysData[dia.value]?.permanente ? 'Permanente' : 'Temporal'}
                                  />

                                  {!specialDaysData[dia.value]?.permanente && (
                                    <DatePickerWrapper>
                                      <PickersRange
                                        selectedDateRange={selectedDateRange}
                                        onDateRangeChange={(newRange: [string, string]) => {
                                          // setSelectedDateRange(newRange);
                                          handleDateRangeChange(String(dia.value), newRange);
                                        }}
                                        popperPlacement='bottom'
                                      />
                                    </DatePickerWrapper>
                                  )}

                                  {/* {isPermanent && (
                                    <Collapse in={isPermanent} >
                                      <DatePickerWrapper>
                                        <PickersRange
                                          selectedDateRange={selectedDateRange}
                                          onDateRangeChange={(newRange: [string, string]) => {
                                            setSelectedDateRange(newRange);
                                            handleDateRangeChange(newRange);
                                          }}
                                          popperPlacement="bottom"
                                        />
                                      </DatePickerWrapper>
                                    </Collapse>
                                  )} */}
                                </Box>
                              </Grid>
                            </Grid>
                          </Collapse>
                        </Grid>
                      ))}

                    </TabPanel>
                  </form>

                </CardContent>
                <Divider sx={{ m: '0 !important' }} />
                <CardActions>
                  <Button type="submit" size="large" sx={{ mr: 2 }} variant="contained" disabled={!isAtLeastOneDaySelected} >
                    Aceptar
                  </Button>
                  <Button type="reset" size="large" variant="outlined" color="secondary" onClick={handleClose}>
                    Cancelar
                  </Button>
                </CardActions>
              </form>
            </TabContext>
          </Card>
        </ScrollBar>
      </Drawer>
    </>
  );
};


export default SidebarAddHorario;
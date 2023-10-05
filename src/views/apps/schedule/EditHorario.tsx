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
  Grid,
} from '@mui/material';
import TabContext from '@mui/lab/TabContext';
import TabList from '@mui/lab/TabList';
import TabPanel from '@mui/lab/TabPanel';
import Drawer from '@mui/material/Drawer';
import ScrollBar from 'react-perfect-scrollbar';
import axios from 'axios';
import DatePickerWrapper from 'src/@core/styles/libs/react-datepicker';
import { ReactDatePickerProps } from 'react-datepicker';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { editSchedule } from 'src/store/apps/schedule/index'
import { AppDispatch } from 'src/redux/store';
import { useDispatch } from 'react-redux';
import { useSelector } from 'react-redux';
import { RootState } from 'src/store';

interface SidebarEditHorarioType {
  scheduleId: string;
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


const SidebarEditHorario = ({ scheduleId, open, toggle }: SidebarEditHorarioType) => {
  console.log(scheduleId)
  // const [schedule, setSchedule] = useState<ScheduleData>({
  //   name: '',
  //   scheduleNormal: [],
  //   scheduleSpecial: [],
  // });


  const [tabValue, setTabValue] = useState("Horario Normal");
  const [selectedDays, setSelectedDays] = useState<number[]>([]);
  const [selectedDaysSpecial, setSelectedDaysSpecial] = useState<number[]>([]);
  const [isAtLeastOneDaySelected, setIsAtLeastOneDaySelected] = useState(false);
  // const [value, setValue] = useState('Horario Normal');
  const [usersError, setUsersError] = useState('');
  const [selectedDateRange, setSelectedDateRange] = useState<string[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [specialDaysData, setSpecialDaysData] = useState<SpecialDaysData>({});
  const dispatch: AppDispatch = useDispatch();
  const allSchedules = useSelector((state: RootState) => state.schedules.list);
  const selectedSchedule = allSchedules.find(schedule => schedule._id === scheduleId);
  const { handleSubmit, control, setValue, errors, reset }: any = useForm({
    defaultValues: selectedSchedule ? selectedSchedule : defaultValues
  });

  console.log(selectedSchedule)

  useEffect(() => {
    if (selectedSchedule) {
      setValue('name', selectedSchedule.name);

      // Para scheduleNormal
      if (selectedSchedule.scheduleNormal) {
        dias.forEach((dia, index) => {
          const normal = selectedSchedule.scheduleNormal.find(normal => normal.day === dia.value);
          if (normal) {
            // Si se encuentra un valor en selectedSchedule, lo establece
            setValue(`scheduleNormal[${index}].day`, normal.day);
            setValue(`scheduleNormal[${index}].into`, normal.into);
            setValue(`scheduleNormal[${index}].out`, normal.out);
            setValue(`scheduleNormal[${index}].intoTwo`, normal.intoTwo);
            setValue(`scheduleNormal[${index}].outTwo`, normal.outTwo);
            setValue(`scheduleNormal[${index}].toleranceInto`, normal.toleranceInto);
            setValue(`scheduleNormal[${index}].toleranceOut`, normal.toleranceOut);
          }
        });
      }

      // Para scheduleSpecial
      if (selectedSchedule.scheduleSpecial) {
        dias.forEach((dia, index) => {
          const special = selectedSchedule.scheduleSpecial.find(special => special.day === dia.value);
          if (special) {
            // Si se encuentra un valor en selectedSchedule, lo establece
            setValue(`scheduleSpecial[${index}].day`, special.day);
            setValue(`scheduleSpecial[${index}].into`, special.into);
            setValue(`scheduleSpecial[${index}].out`, special.out);
            setValue(`scheduleSpecial[${index}].intoTwo`, special.intoTwo);
            setValue(`scheduleSpecial[${index}].outTwo`, special.outTwo);
            setValue(`scheduleSpecial[${index}].toleranceInto`, special.toleranceInto);
            setValue(`scheduleSpecial[${index}].toleranceOut`, special.toleranceOut);
            setValue(`scheduleSpecial[${index}].name`, special.name);
            setValue(`scheduleSpecial[${index}].permanente`, special.permanente);
            special.dateRange.forEach((date, dateIndex) => {
              setValue(`scheduleSpecial[${index}].dateRange[${dateIndex}]`, date);
            });
            special.usersAssigned.forEach((user, userIndex) => {
              setValue(`scheduleSpecial[${index}].usersAssigned[${userIndex}]`, user);
            });
          }
        });
      }
    }
  }, [scheduleId, selectedSchedule, setValue, dias]);






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

  // const { reset, control, handleSubmit, formState: { errors } } = useForm({
  //   defaultValues,
  //   mode: 'onChange',
  //   resolver: yupResolver(schema),
  // });

  const handleDaySelect = (dayValue: number) => {
    if (selectedDays.includes(dayValue)) {
      setSelectedDays(selectedDays.filter((day) => day !== dayValue));
    } else {
      setSelectedDays([...selectedDays, dayValue]);
    }
  }

  const handleDaySpecialSelect = (dayValue: string) => {
    const dayNumber = parseInt(dayValue, 10);
    // const currentDay = getValues(`scheduleSpecial.${day}.day`);

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

    console.log('entraa 1',);
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

  const onSubmit = async (data: ScheduleData) => {
    try {
      await dispatch(editSchedule({ ...data, _id: scheduleId })).unwrap();
      toggle();
      // setOpenSnackbar(true);
    } catch (error: any) {
      // Manejar el error
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
        Editar
      </Button>
      <Drawer
        open={open}
        anchor="right"
        variant="temporary"
        onClose={handleClose}
        ModalProps={{ keepMounted: true }}
        sx={{ '& .MuiDrawer-paper': { width: { xs: 300, sm: 500, md: 800, lg: 800 } } }}
      >
        <ScrollBar>
          <Card>
            <TabContext value={tabValue}>
              <TabList
                variant="scrollable"
                scrollButtons={false}
                onChange={(event: any, newValue: React.SetStateAction<string>) => setTabValue(newValue)}
                sx={{ borderBottom: (theme) => `1px solid ${theme.palette.divider}` }}
              >
                <Tab value="Horario Normal" label="Horario Normal" />
                <Tab value="Horario Especial" label="Horario Especial" />
              </TabList>
              <form onSubmit={handleSubmit(onSubmit)}>
                <CardContent>
                  <TabPanel value="Horario Normal">
                    <Grid item xs={12} md={12}>
                      <FormControl fullWidth sx={{ mb: 4 }}>
                        <Controller
                          name='name'
                          control={control}
                          rules={{ required: true, minLength: 2 }} // Puedes ajustar estas reglas
                          render={({ field }) => (
                            <TextField
                              {...field}
                              label='Nombre'
                              autoComplete='off'
                            />
                          )}
                        />
                      </FormControl>
                    </Grid>
                    <Grid container spacing={10}>
                      {dias.map((dia, index) => (
                        <Grid item xs={6} sm={4} key={dia.value}>
                          <Controller
                            name={`scheduleNormal.${index}.day`}
                            control={control}
                            defaultValue={false}
                            render={({ field }) => (
                              <FormControlLabel
                                control={
                                  <Checkbox
                                    {...field}
                                    checked={field.value}
                                    color="primary"
                                  />
                                }
                                label={dia.nombre}
                              />
                            )}
                          />

                          <Box mb={2}>
                            <Controller
                              name={`scheduleNormal.${index}.into`}
                              control={control}
                              render={({ field }) => (
                                <TextField
                                  label="Entrada 1"
                                  type="time"
                                  {...field}
                                  // error={Boolean(errors.scheduleNormal?.[index]?.into)}
                                  // helperText={errors.scheduleNormal?.[index]?.into?.message}
                                  fullWidth
                                />
                              )}
                            />
                          </Box>
                          <Box mb={2}>
                            <Controller
                              name={`scheduleNormal.${index}.out`}
                              control={control}
                              render={({ field }) => (
                                <TextField
                                  label="Salida 1"
                                  type="time"
                                  {...field}
                                  // error={Boolean(errors.scheduleNormal?.[index]?.out)}
                                  // helperText={errors.scheduleNormal?.[index]?.out?.message}
                                  fullWidth
                                />
                              )}
                            />
                          </Box>
                          <Box mb={2}>
                            <Controller
                              name={`scheduleNormal.${index}.intoTwo`}
                              control={control}
                              render={({ field }) => (
                                <TextField
                                  label="Entrada 2"
                                  type="time"
                                  {...field}
                                  // error={Boolean(errors.scheduleNormal?.[index]?.intoTwo)}
                                  // helperText={errors.scheduleNormal?.[index]?.intoTwo?.message}
                                  fullWidth
                                />
                              )}
                            />
                          </Box>
                          <Box mb={2}>
                            <Controller
                              name={`scheduleNormal.${index}.outTwo`}
                              control={control}
                              render={({ field }) => (
                                <TextField
                                  label="Salida 2"
                                  type="time"
                                  {...field}
                                  // error={Boolean(errors.scheduleNormal?.[index]?.outTwo)}
                                  // helperText={errors.scheduleNormal?.[index]?.outTwo?.message}
                                  fullWidth
                                />
                              )}
                            />
                          </Box>
                          <Box mb={2}>
                            <Controller
                              name={`scheduleNormal.${index}.toleranceInto`}
                              control={control}
                              render={({ field }) => (
                                <TextField
                                  label="Tolerancia Entrada"
                                  type="number"
                                  {...field}
                                  // error={Boolean(errors.scheduleNormal?.[index]?.toleranceInto)}
                                  // helperText={errors.scheduleNormal?.[index]?.toleranceInto?.message}
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
                                // error={Boolean(errors.scheduleNormal?.[index]?.toleranceOut)}
                                // helperText={errors.scheduleNormal?.[index]?.toleranceOut?.message}
                                fullWidth
                              />
                            )}
                          />
                        </Grid>
                      ))}
                    </Grid>
                  </TabPanel>
                  <form onSubmit={handleSubmit(onSubmit)}>
                    <TabPanel value="Horario Especial">
                      {dias.map((dia, index) => (
                        <Grid item xs={6} sm={4} key={dia.value}>
                          <FormControlLabel
                            control={
                              <Controller
                                name={`scheduleSpecial.${index}.day`}
                                control={control}
                                render={({ field: { onChange, value } }) => (
                                  <Checkbox
                                    edge="start"
                                    checked={value} // Usa el value de field para controlar el estado checked del Checkbox
                                    onChange={(e) => {
                                      onChange(e.target.checked); // Actualiza el valor en el formulario
                                      handleDaySpecialSelect(dia.value.toString()); // Llama a tu función handleDaySpecialSelect
                                    }}
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
                                render={({ field }) => (
                                  <TextField
                                    {...field}
                                    label='Descripción'
                                    // error={Boolean(errors.scheduleSpecial?.[index]?.name)}
                                    inputProps={{ autoComplete: "off" }}
                                    sx={{ marginBottom: (theme) => theme.spacing(5) }}
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
                                        label="Entrada 1"
                                        type="time"
                                        {...field}
                                        // error={Boolean(errors.scheduleSpecial?.[index]?.into)}
                                        // helperText={errors.scheduleSpecial?.[index]?.into?.message}
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
                                        label='Salida 1'
                                        type="time"
                                        {...field}
                                        // error={Boolean(errors.scheduleSpecial?.[index]?.out)}
                                        // helperText={errors.scheduleSpecial?.[index]?.out?.message}
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
                                        label='Entrada 2'
                                        type="time"
                                        {...field}
                                        // error={Boolean(errors.scheduleSpecial?.[index]?.intoTwo)}
                                        // helperText={errors.scheduleSpecial?.[index]?.intoTwo?.message}
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
                                        label='Salida 2'
                                        type="time"
                                        {...field}
                                        // error={Boolean(errors.scheduleSpecial?.[index]?.outTwo)}
                                        // helperText={errors.scheduleSpecial?.[index]?.outTwo?.message}
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
                                        label='Tolerancia Entrada'
                                        type="number"
                                        {...field}
                                        // error={Boolean(errors.scheduleSpecial?.[index]?.toleranceInto)}
                                        // helperText={errors.scheduleSpecial?.[index]?.toleranceInto?.message}
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
                                        label='Tolerancia Salida'
                                        type="number"
                                        {...field}
                                        // error={Boolean(errors.scheduleSpecial?.[index]?.toleranceOut)}
                                        // helperText={errors.scheduleSpecial?.[index]?.toleranceOut?.message}
                                        fullWidth
                                      />
                                    )}
                                  />
                                </Box>
                              </Grid>
                              <Grid item xs={6}>
                                <Box mb={2}>
                                  <FormControl component="fieldset">
                                    <FormLabel component="legend">Seleccionar usuarios</FormLabel>
                                    <List dense>
                                      {users.map((user, index) => (
                                        <ListItem key={user._id}>
                                          {/* <ListItemIcon>
                                            <Controller
                                              name={`users.${index}`}
                                              control={control}
                                              defaultValue={selectedUsers.includes(user._id)} 
                                              render={({ field }) => (
                                                <Checkbox
                                                  {...field}
                                                  checked={field.value}
                                                  onChange={(e) => field.onChange(e.target.checked)}
                                                  edge="start"
                                                  color="primary"
                                                />
                                              )}
                                            />
                                          </ListItemIcon> */}

                                          <ListItemText primary={`${user.name} ${user.lastName}`} />
                                        </ListItem>
                                      ))}

                                    </List>
                                  </FormControl>
                                </Box>
                              </Grid>

                              <Grid item xs={6}>
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


export default SidebarEditHorario;
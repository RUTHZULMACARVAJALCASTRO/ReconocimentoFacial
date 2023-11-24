import React, { useEffect, useState } from 'react';
import {
  useForm,
  Controller,
} from 'react-hook-form';
import {
  Card, CardContent, Checkbox, TextField, Button, Box, Tab, Divider, CardActions, FormControlLabel, Collapse, FormLabel, List, ListItem, ListItemIcon, ListItemText, FormControl, Switch, useTheme, Grid, InputAdornment, InputLabel, MenuItem, Select,
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
import SearchIcon from '@material-ui/icons/Search';

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
  scheduleNormal: dias.filter(dia => dia.value !== 0).map(dia => ({
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
  const [tabValue, setTabValue] = useState("Horario Normal");
  const [selectedDays, setSelectedDays] = useState<number[]>([]);
  const [selectedDaysSpecial, setSelectedDaysSpecial] = useState<number[]>([]);
  const [isAtLeastOneDaySelected, setIsAtLeastOneDaySelected] = useState(false);
  const [usersError, setUsersError] = useState('');
  const [selectedDateRange, setSelectedDateRange] = useState<string[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [specialDaysData, setSpecialDaysData] = useState<SpecialDaysData>({});
  const dispatch: AppDispatch = useDispatch();
  const allSchedules = useSelector((state: RootState) => state.schedules.paginatedSchedule);
  const selectedSchedule = allSchedules.find(schedule => schedule._id === scheduleId);
  const { handleSubmit, control, setValue, errors, reset }: any = useForm({
    defaultValues: selectedSchedule ? selectedSchedule : defaultValues
  });

  console.log(selectedSchedule)

  useEffect(() => {
    if (selectedSchedule) {
      setValue('name', selectedSchedule.name);
      if (Array.isArray(selectedSchedule.scheduleNormal)) {
        dias.forEach((dia, index) => {
          if (dia) {
            const normal = selectedSchedule.scheduleNormal.find(n => n && n.day === dia.value);
            if (normal) {
              setValue(`scheduleNormal[${index}].day`, normal.day);
              setValue(`scheduleNormal[${index}].into`, normal.into);
              setValue(`scheduleNormal[${index}].out`, normal.out);
              setValue(`scheduleNormal[${index}].intoTwo`, normal.intoTwo);
              setValue(`scheduleNormal[${index}].outTwo`, normal.outTwo);
              setValue(`scheduleNormal[${index}].toleranceInto`, normal.toleranceInto);
              setValue(`scheduleNormal[${index}].toleranceOut`, normal.toleranceOut);
            }
          }
        });
      }
      if (Array.isArray(selectedSchedule.scheduleSpecial)) {
        dias.forEach((dia, index) => {
          if (dia) {
            const special = selectedSchedule.scheduleSpecial.find(s => s && s.day === dia.value);
            if (special) {
              setValue(`scheduleSpecial[${index}].day`, special.day);
              setValue(`scheduleSpecial[${index}].into`, special.into);
              setValue(`scheduleSpecial[${index}].out`, special.out);
              setValue(`scheduleSpecial[${index}].intoTwo`, special.intoTwo);
              setValue(`scheduleSpecial[${index}].outTwo`, special.outTwo);
              setValue(`scheduleSpecial[${index}].toleranceInto`, special.toleranceInto);
              setValue(`scheduleSpecial[${index}].toleranceOut`, special.toleranceOut);
              setValue(`scheduleSpecial[${index}].name`, special.name);
              setValue(`scheduleSpecial[${index}].permanente`, special.permanente);

              if (Array.isArray(special.dateRange)) {
                special.dateRange.forEach((date, dateIndex) => {
                  setValue(`scheduleSpecial[${index}].dateRange[${dateIndex}]`, date);
                });
              }

              if (Array.isArray(special.usersAssigned)) {
                special.usersAssigned.forEach((user, userIndex) => {
                  setValue(`scheduleSpecial[${index}].usersAssigned[${userIndex}]`, user);
                });
              }
            }
          }
        });
      }
    }
  }, [scheduleId, selectedSchedule, setValue, dias]);


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
    } catch (error: any) {

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
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [searchBy, setSearchBy] = useState('name');
  const [searchRequested, setSearchRequested] = useState(false);
  const [isSearching, setIsSearching] = useState(false);


  useEffect(() => {
    if (searchRequested) {
      handleSearch();
      setSearchRequested(false);
    }
  }, [searchRequested]);


  const handleSearch = async () => {
    setIsSearching(true);

    let queryParams = [];

    if (searchValue) {
      try {
        const terms = searchValue.split(' ');

        if (terms.length > 1) {
          queryParams.push(`name=${terms[0]}`);
          queryParams.push(`lastName=${terms[1]}`);
        } else {
          queryParams.push(`${searchBy}=${terms[0]}`);
        }

        const queryString = queryParams.join('&');
        const url = `${process.env.NEXT_PUBLIC_PERSONAL}filtered?${queryString}`;

        const response = await axios.get(url);
        setFilteredUsers(response.data.data);
      } catch (error) {
        console.error("Error buscando usuarios:", error);
      }
    } else {

      setFilteredUsers([]);
    }

    setIsSearching(false);
  };

  return (
    <>
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
                          rules={{ required: true, minLength: 2 }}
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
                                    checked={value}
                                    onChange={(e) => {
                                      onChange(e.target.checked);
                                      handleDaySpecialSelect(dia.value.toString());
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
                                        fullWidth
                                      />
                                    )}
                                  />
                                </Box>
                              </Grid>
                              <Grid item xs={12}>
                                <Box mb={2}>
                                  <FormControl component="fieldset">
                                    <FormLabel component="legend">Seleccionar usuarios</FormLabel>
                                    <br />
                                    <Box display="flex" alignItems="center" justifyContent="space-between" mb={2}>
                                      <Box flex="0 1 auto" mr={2}>
                                        <FormControl variant="outlined" style={{ width: '220px' }}>
                                          <InputLabel>Buscar por</InputLabel>
                                          <Select
                                            value={searchBy}
                                            onChange={(e) => setSearchBy(e.target.value)}
                                            label="Buscar por"
                                          >
                                            <MenuItem value="all">Todos los campos</MenuItem>
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
                                      <Box flex="1">
                                        <TextField
                                          variant="outlined"
                                          placeholder="Buscar usuario..."
                                          value={searchValue}
                                          onChange={(e) => setSearchValue(e.target.value)}
                                          fullWidth
                                          InputProps={{
                                            endAdornment: (
                                              <InputAdornment position="end">
                                                <Button
                                                  onClick={() => setSearchRequested(true)}
                                                  color="primary"
                                                >
                                                  <SearchIcon />
                                                  Buscar
                                                </Button>
                                              </InputAdornment>
                                            ),
                                          }}
                                        />
                                      </Box>
                                    </Box>
                                    {isSearching && <p>Buscando...</p>}

                                    {!isSearching && filteredUsers.length > 0 && (
                                      // <Box className={classes.listContainer}>
                                      <List dense>
                                        {filteredUsers.map((user: any) => (
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
                                      // </Box>
                                    )}
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
                  <Button type="submit" size="large" sx={{ mr: 2 }} variant="contained">
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

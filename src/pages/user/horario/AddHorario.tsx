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
  day: number,
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
  [index: number]: Schedule;
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
})

const defaultValues = {
  name: '',
  schedules: [
    // {
    //   day: 0,
    //   morningEntry: '',
    //   morningExit: '',
    //   afternoonEntry: '',
    //   afternoonExit: '',
    //   entryTolerance: 0,
    //   exitTolerance: 0,
    // } 
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
      const response = await axios.post(`${process.env.NEXT_PUBLIC_PERSONAL_SCHEDULES}`, {
        name: data.name,
        schedules: data.schedules.map(schedule => ({
          day: schedule.day,
          morningEntry: schedule.morningEntry,
          morningExit: schedule.morningExit,
          afternoonEntry: schedule.afternoonEntry,
          afternoonExit: schedule.afternoonExit,
          entryTolerance: schedule.entryTolerance,
          exitTolerance: schedule.exitTolerance,
        })),
      });
      if( response.status === 200 ) {
        toggle();
        reset();
        // Realiar cualquier otra acccion al momento de crear un horario
      }
    } catch (error) {
      console.log('Error al crear un horario',error);
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

  function handleScheduleChange(index: number, arg1: string, value: string): void {
    
  }

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
        sx={{ '& .MuiDrawer-paper': { width: { xs: '100%', sm: '90%', md: '80%', lg: '70%' } } }} >
        <Header>
          <Typography variant='h6'> Crear Horario</Typography>
          <IconButton size='large' onClick={handleClose} sx={{ color: 'text.primary' }}>
            <Icon icon='mdi:close' fontSize={20} />
          </IconButton>
        </Header>

        <Box sx={{ p: { xs: 2, sm: 4, md: 6 }  }}>
          <form onSubmit={handleSubmit(handleSave)}>
            <Typography variant="subtitle1" sx={{ fontWeight: 'bold', marginBottom: 2 }}>
              Nombre
            </Typography>

            <Controller
              name="name"
              control={control}
              render={({ field }) => (
                <TextField
                  label="Nombre de Horario"
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
                        control={<Checkbox name={`schedules[${index}].selected`} />}
                        label={day}
                      />
                      <Grid container spacing={2}>
                        <Grid item xs={2}>
                          <Typography variant="subtitle2">Entrada mañana</Typography>
                          <TextField
                            type="time"
                            value={schedule[index]?.morningEntry}
                            onChange={(e) => handleScheduleChange(index, 'morningEntry', e.target.value)}
                            fullWidth
                          />
                        </Grid>
                        <Grid item xs={2}>
                          <Typography variant="subtitle2">Salida mañana</Typography>
                          <TextField
                            type="time"
                            value={schedule[index]?.morningExit}
                            onChange={(e) => handleScheduleChange(index, 'morningExit', e.target.value)}
                            fullWidth
                          />
                        </Grid>
                        <Grid item xs={2}>
                          <Typography variant="subtitle2">Entrada Tarde</Typography>
                          <TextField
                            type="time"
                            value={schedule[index]?.afternoonEntry}
                            onChange={(e) => handleScheduleChange(index, 'afternoonEntry', e.target.value)}
                            fullWidth
                          />
                        </Grid>
                        <Grid item xs={2}>
                          <Typography variant="subtitle2">Salida Tarde</Typography>
                          <TextField
                            type="time"
                            value={schedule[index]?.afternoonExit}
                            onChange={(e) => handleScheduleChange(index, 'afternoonExit', e.target.value)}
                            fullWidth
                          />
                        </Grid>
                        <Grid item xs={2}>
                          <Typography variant="subtitle2"> Tolerancia entrada</Typography>
                          <TextField
                            type="number"
                            value={schedule[index]?.entryTolerance}
                            onChange={(e) => handleScheduleChange(index, 'entryTolerance', e.target.value)}
                            fullWidth
                          />
                        </Grid>
                        <Grid item xs={2}>
                          <Typography variant="subtitle2">Tolerancia Salida</Typography>
                          <TextField
                            type="number"
                            value={schedule[index]?.exitTolerance}
                            onChange={(e) => handleScheduleChange(index, 'exitTolerance', e.target.value)}
                            fullWidth
                          />
                        </Grid>

                        {/* Repite el mismo patrón para los otros campos de horario y tolerancia */}
                      </Grid>
                    </Grid>
                  ))}
                </Grid>
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







// import { Button, Checkbox, Drawer, FormControlLabel, FormGroup, Grid, IconButton, TextField, Typography } from '@mui/material';
// import Box from '@mui/material/Box';
// import { styled } from '@mui/material/styles';
// import { useState } from 'react';
// import axios from 'axios';

// import Icon from 'src/@core/components/icon'
// import * as yup from 'yup';

// // Creacion de Interfaces
// interface SidebarAddScheduleType {
//   open: boolean;
//   toggle: () => void;
// }

// interface Schedule {
//   day: number;
//   morningEntry: string;
//   morningExit: string;
//   afternoonEntry: string;
//   afternoonExit: string;
//   entryTolerance: number;
//   exitTolerance: number;
// }

// interface ScheduleData {
//   name: string;
//   schedules: Schedule[];
// }

// // Variables  -  Constantes
// const showErrors = (field: string, valueLen: number, min: number) => {
//   if (valueLen === 0) {
//     return `El campo ${field} es requerido`;
//   } else if (valueLen > 0 && valueLen < min) {
//     return `${field} debe tener al menos ${min} caracteres`;
//   } else {
//     return '';
//   }
// };

// const Header = styled(Box)(({ theme }) => ({
//   display: 'flex',
//   alignItems: 'center',
//   padding: theme.spacing(3, 4, '4', '5'),
//   justifyContent: 'space-between',
//   backgroundColor: theme.palette.background.default,
// }));

// const schema = yup.object().shape({
//   name: yup
//     .string()
//     .min(4, obj => showErrors('Nombre', obj.value.length, obj.min))
//     .required(),

//   schedules: yup
//     .array().of(
//       yup.object().shape({
//         day: yup.number().required(),
//         morningEntry: yup.string().required(),
//         morningExit: yup.string().required(),
//         afternoonEntry: yup.string().required(),
//         afternoonExit: yup.string().required(),
//         entryTolerance: yup.number().required(),
//         exitTolerance: yup.number().required(),
//       })
//     ),
// });

// const defaultSchedule: Schedule = {
//   day: 0,
//   morningEntry: '',
//   morningExit: '',
//   afternoonEntry: '',
//   afternoonExit: '',
//   entryTolerance: 0,
//   exitTolerance: 0,
// };

// const SidebarAddHorario = (props: SidebarAddScheduleType)=> {
//   const { open, toggle } = props;

//   const [name, setName] = useState('');
//   const [schedules, setSchedules] = useState<Schedule[]>([defaultSchedule]);
//   const handleScheduleChange = (index: number, field: keyof Schedule, value: any) => {
//   const handleScheduleChange = (index: number, field: keyof Schedule, value: any) => {
//     const updatedSchedules: Schedule[] = [...schedules]; // Anotación de tipos aquí
//       updatedSchedules[index] = {
//         ...updatedSchedules[index],
//         [field]: value,
//       };
//       setSchedules(updatedSchedules);
//     };

//   const [openList, setOpenList] = useState(true);

//   const handleSave = async () => {
//     try {
//       const response = await axios.post(`${process.env.NEXT_PUBLIC_PERSONAL_SCHEDULES}`, {
//         name: name,
//         schedules: schedules.map(schedule => ({
//           day: schedule.day,
//           morningEntry: schedule.morningEntry,
//           morningExit: schedule.morningExit,
//           afternoonEntry: schedule.afternoonEntry,
//           afternoonExit: schedule.afternoonExit,
//           entryTolerance: schedule.entryTolerance,
//           exitTolerance: schedule.exitTolerance,
//         })),
//       });
      
//       if (response.status === 200) {
//         toggle();
//         setName('');
//         setSchedules([defaultSchedule]);
//         // Realizar cualquier otra acción después de crear el horario
//       }
//     } catch (error) {
//       console.log('Error al crear un horario', error);
//     }
  
//   };

//   const handleClose = () => {
//     toggle();
//     setName('');
//     setSchedules([defaultSchedule]);
//   };

//   const handleClick = () => {
//     setOpenList(!openList);
//   };
  
//   return (
//     <>
//       <Button onClick={handleClose} variant="contained" color="primary"
//         sx={{
//           borderRadius: '8px',
//           marginBottom: '15px',
//           fontSize: '12px',
//           fontWeight: 'bold',
//           padding: '10px 20px',
//           boxShadow: '0 3px 5px rgba(0, 0, 0, 0.2)',
//           '&:hover': {
//             backgroundColor: '#1565c0',
//           },
//         }}
//       >
//         Crear Horario
//       </Button>

//       <Drawer
//         open={open}
//         anchor='right'
//         variant='temporary'
//         onClose={handleClose}
//         ModalProps={{ keepMounted: true }}
//         sx={{ '& .MuiDrawer-paper': { width: { xs: '100%', sm: '90%', md: '80%', lg: '70%' } } }} >
//         <Header>
//           <Typography variant='h6'> Crear Horario</Typography>
//           <IconButton size='large' onClick={handleClose} sx={{ color: 'text.primary' }}>
//             <Icon icon='mdi:close' fontSize={20} />
//           </IconButton>
//         </Header>

//         <Box sx={{ p: { xs: 2, sm: 4, md: 6 }  }}>
//           <form onSubmit={handleSave}>
//             <Typography variant="subtitle1" sx={{ fontWeight: 'bold', marginBottom: 2 }}>
//               Nombre
//             </Typography>
//             <TextField
//               label="Nombre de Horario"
//               value={name}
//               onChange={(e) => setName(e.target.value)}
//               fullWidth
              
//             />

//             <Box sx={{ marginTop: 4 }}>
//               <Typography variant="subtitle1" sx={{ fontWeight: 'bold', marginBottom: 2 }}>
//                 Horarios
//               </Typography>
//               Copy code
                // <Grid container spacing={2}>
                //   {['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo'].map((day, index) => (
                //     <Grid item xs={12} key={index}>
                //       <FormControlLabel
                //         control={<Checkbox name={`schedules[${index}].selected`} />}
                //         label={day}
                //       />
                //       <Grid container spacing={2}>
                //         <Grid item xs={6}>
                //           <Typography variant="subtitle2">Entrada mañana</Typography>
                //           <TextField
                //             type="time"
                //             value={schedules[index]?.morningEntry}
                //             onChange={(e) => handleScheduleChange(index, 'morningEntry', e.target.value)}
                //             fullWidth
                //           />
                //         </Grid>
                //         {/* Repite el mismo patrón para los otros campos de horario y tolerancia */}
                //       </Grid>
                //     </Grid>
                //   ))}
                // </Grid>
//             </Box>

//             <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', marginTop: 10 }}>
//               <Button size='large' type='submit' variant='contained' sx={{ mr: 6 }}>
//                 Aceptar
//               </Button>
//               <Button size='large' variant='outlined' color='secondary' onClick={handleClose}>
//                 Cancelar
//               </Button>
//             </Box>
//           </form>
//         </Box>
//       </Drawer>
//     </>
//   );
// };
// }

// export default SidebarAddHorario;
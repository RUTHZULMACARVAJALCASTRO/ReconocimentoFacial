// import React, { useEffect, useState } from 'react';
// import {
//   Collapse,
//   Dialog,
//   DialogActions,
//   DialogContent,
//   DialogContentText,
//   DialogTitle,
//   IconButton,
//   TableCell,
//   TableRow,
//   Button,
//   TableHead,
//   Paper,
//   Table,
//   TableBody,
//   TableContainer,
//   useTheme,
//   Typography,
// } from '@mui/material';
// import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
// import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
// import axios from 'axios';
// import { makeStyles } from '@mui/styles';
// import SidebarAddHorario from '../../../views/apps/schedule/AddHorario';
// import SidebarEditHorario from '../../../views/apps/schedule/EditHorario';

// import { fetchSchedules } from 'src/store/apps/schedule/index';
// import { useDispatch, useSelector } from 'react-redux'
// import { RootState } from 'src/store';
// import { AppDispatch } from 'src/redux/store';


// interface ScheduleNormal {
//   day: number;
//   into: string;
//   out: string;
//   intoTwo: string;
//   outTwo: string;
//   toleranceInto: number;
//   toleranceOut: number;
// }

// interface ScheduleSpecial {
//   name: string;
//   day: number;
//   into: string;
//   out: string;
//   intoTwo: string;
//   outTwo: string;
//   toleranceInto: number;
//   toleranceOut: number;
//   permanente: boolean;
//   dateRange: [string | null, string | null];
//   usersAssigned: string[];
// }


// interface Docu {
//   _id?: string;
//   name: string;
//   scheduleNormal: ScheduleNormal[];
//   scheduleSpecial: ScheduleSpecial[];
//   isActive?: boolean;
// }

// interface RowProps {
//   row: Docu;
// }

// const useStyles = makeStyles((theme: any) => ({
//   tableRowLight: {
//     backgroundColor: theme.palette.background.paper,
//   },
//   tableRowDark: {
//     backgroundColor: theme.palette.background.default,
//   },
//   tableCell: {
//     textAlign: 'center',
//   },
// }));

// const dias = ['DOMINGO', 'LUNES', 'MARTES', 'MIÉRCOLES', 'JUEVES', 'VIERNES', 'SÁBADO'];

// function Row(props: RowProps) {
//   const { row } = props;
//   const classes = useStyles();
//   const [open, setOpen] = React.useState(false);
//   const theme = useTheme();
//   const [editHorarioOpen, setEditHorarioOpen] = useState<boolean>(false);
//   const toggleEditHorario = () => {
//     setEditHorarioOpen(!editHorarioOpen);
//   };

//   const handleToggleActive = async (scheduleId: string, newStatus: boolean) => {
//     try {
//       const response = await axios.put(`${process.env.NEXT_PUBLIC_PERSONAL_SCHEDULE}/${scheduleId}/active`, {
//         isActive: newStatus,
//       });

//       if (response.status === 200 || response.status === 201) {

//         console.log(`Horario ${newStatus ? 'activado' : 'dado de baja'} con éxito:`, response.data);
//       } else {
//         console.error('Respuesta inesperada del servidor:', response);
//       }
//     } catch (error) {
//       console.error('Error al cambiar el estado del horario:', error);
//     }
//   };

//   return (
//     <React.Fragment>
//       <TableRow
//         className={row.isActive ? classes.tableRowLight : classes.tableRowDark}
//         sx={{ '& > *': { borderBottom: 'unset', border: '1px solid #e0e0e0' } }}
//       >
//         <TableCell align='center'>
//           <IconButton aria-label="expand row" size="small" onClick={() => setOpen(!open)}>
//             {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
//           </IconButton>
//         </TableCell>
//         <TableCell align='center'>{row.name}</TableCell>
//         <TableCell colSpan={7}>
//           <Typography align='center'>{open ? '' : '...'}</Typography>

//           <Collapse in={open} timeout="auto" unmountOnExit>
//             {open ? (
//               <Table>
//                 <TableHead>
//                   <TableRow sx={{
//                     '&:nth-of-type(odd)': {
//                       backgroundColor: open ? theme.palette.mode === 'dark' ? '#263238' : '#263238' : theme.palette.mode === 'dark' ? '#263238' : '#263238',
//                       boxShadow: 'inset 0px 0px 5px rgba(0, 0, 0, 0.5)',
//                       color: '#ffffff',
//                     },
//                     '& > *': {
//                       borderBottom: '1px solid #ccc',
//                       color: '#ffffff',
//                     }
//                   }}>
//                     <TableCell className={classes.tableCell} align="center" style={{ fontWeight: 'bold', padding: '3px 10px', borderRight: '1px solid rgba(224, 224, 224, 1)', borderBottom: '1px solid rgba(224, 224, 224, 1)', color: '#ffffff' }}>
//                       DÍA
//                     </TableCell>
//                     <TableCell className={classes.tableCell} align="center" style={{ fontWeight: 'bold', padding: '3px 50px', borderRight: '1px solid rgba(224, 224, 224, 1)', borderBottom: '1px solid rgba(224, 224, 224, 1)', color: '#ffffff' }}>
//                       MAÑANA ENTRADA
//                     </TableCell>
//                     <TableCell className={classes.tableCell} align="center" style={{ fontWeight: 'bold', padding: '3px 50px', borderRight: '1px solid rgba(224, 224, 224, 1)', borderBottom: '1px solid rgba(224, 224, 224, 1)', color: '#ffffff' }}>
//                       MAÑANA SALIDA
//                     </TableCell>
//                     <TableCell className={classes.tableCell} align="center" style={{ fontWeight: 'bold', padding: '3px 50px', borderRight: '1px solid rgba(224, 224, 224, 1)', borderBottom: '1px solid rgba(224, 224, 224, 1)', color: '#ffffff' }}>
//                       TARDE ENTRADA
//                     </TableCell>
//                     <TableCell className={classes.tableCell} align="center" style={{ fontWeight: 'bold', padding: '3px 50px', borderRight: '1px solid rgba(224, 224, 224, 1)', borderBottom: '1px solid rgba(224, 224, 224, 1)', color: '#ffffff' }}>
//                       TARDE SALIDA
//                     </TableCell>
//                     <TableCell className={classes.tableCell} align="center" style={{ fontWeight: 'bold', padding: '3px 24px', borderRight: '1px solid rgba(224, 224, 224, 1)', borderBottom: '1px solid rgba(224, 224, 224, 1)', color: '#ffffff' }}>
//                       TOLERANCIA ENTRADA
//                     </TableCell>
//                     <TableCell className={classes.tableCell} align="center" style={{ fontWeight: 'bold', padding: '3px 24px', borderRight: '1px solid rgba(224, 224, 224, 1)', borderBottom: '1px solid rgba(224, 224, 224, 1)', color: '#ffffff' }}>
//                       TOLERANCIA SALIDA
//                     </TableCell>
//                     <TableCell className={classes.tableCell} align="center" style={{ fontWeight: 'bold', padding: '3px 24px', borderRight: '1px solid rgba(224, 224, 224, 1)', borderBottom: '1px solid rgba(224, 224, 224, 1)', color: '#ffffff' }}>
//                       ...
//                     </TableCell>
//                   </TableRow>
//                 </TableHead>
//                 <TableBody sx={{ '& > *': { borderBottom: '1px solid #ccc', borderLeft: '1px solid #ccc', borderRight: '1px solid #ccc' } }}>
//                   {row.scheduleNormal && row.scheduleNormal.map((schedule, index) => (
//                     <TableRow
//                       key={index}
//                       sx={{
//                         '&:nth-of-type(odd)': {
//                           backgroundColor: theme.palette.mode === 'dark' ? '#9e9e9e ' : '#F4F4F4',
//                           color: theme.palette.mode === 'dark' ? '#000000' : '#000000',
//                         },
//                         '& > *': {
//                           borderBottom: '1px solid #ccc',
//                         },
//                       }}
//                     >
//                       <TableCell align="center">{dias[schedule.day]}</TableCell>
//                       <TableCell align="center">{schedule.into || 'N/A'}</TableCell>
//                       <TableCell align="center">{schedule.out || 'N/A'}</TableCell>
//                       <TableCell align="center">{schedule.intoTwo || 'N/A'}</TableCell>
//                       <TableCell align="center">{schedule.outTwo || 'N/A'}</TableCell>
//                       <TableCell align="center">{schedule.toleranceInto || 'N/A'}</TableCell>
//                       <TableCell align="center">{schedule.toleranceOut || 'N/A'}</TableCell>
//                       <TableCell align="center">{ }</TableCell>
//                     </TableRow>
//                   ))}

//                   {row.scheduleSpecial && row.scheduleSpecial.length > 0 && (
//                     <TableRow
//                       sx={{
//                         '&:nth-of-type(odd)': {
//                           backgroundColor: theme.palette.mode === 'dark' ? '#9e9e9e' : '#F4F4F4',
//                           color: '#000000',
//                         },
//                         '& > *': {
//                           borderBottom: '1px solid #ccc',
//                         }
//                       }}
//                     >
//                       <TableCell
//                         colSpan={8} // El número de columnas debe coincidir con la cantidad de datos en tu horario especial
//                         className={classes.tableCell}
//                         align="center"
//                         sx={{
//                           '&:nth-of-type(odd)': {
//                             backgroundColor: open ? theme.palette.mode === 'dark' ? '#263238' : '#263238' : theme.palette.mode === 'dark' ? '#263238' : '#263238',
//                             boxShadow: 'inset 0px 0px 5px rgba(0, 0, 0, 0.5)',
//                             color: '#ffffff',
//                           },
//                           '& > *': {
//                             borderBottom: '1px solid #ccc',
//                             color: '#ffffff',
//                           }
//                         }}
//                       >
//                         HORARIO ESPECIAL
//                       </TableCell>
//                     </TableRow>
//                   )}

//                   {row.scheduleSpecial && row.scheduleSpecial.map((schedule, index) => (
//                     <TableRow
//                       key={`${row._id}-special-${index}`}
//                       sx={{
//                         '&:nth-of-type(odd)': {
//                           backgroundColor: theme.palette.mode === 'dark' ? '#9e9e9e' : '#F4F4F4',
//                           color: '#000000',
//                         },
//                         '& > *': {
//                           borderBottom: '1px solid #ccc',
//                         }
//                       }}
//                     >
//                       <TableCell align="center">{dias[schedule.day]} {schedule.name} </TableCell>
//                       <TableCell align="center">{schedule.into || 'N/A'}</TableCell>
//                       <TableCell align="center">{schedule.out || 'N/A'}</TableCell>
//                       <TableCell align="center">{schedule.intoTwo || 'N/A'}</TableCell>
//                       <TableCell align="center">{schedule.outTwo || 'N/A'}</TableCell>
//                       <TableCell align="center">{schedule.toleranceInto || 'N/A'}</TableCell>
//                       <TableCell align="center">{schedule.toleranceOut || 'N/A'}</TableCell>
//                       {/* <TableCell align="center">{schedule.permanente || 'N/A'}</TableCell> */}
//                       <TableCell align="center">
//                         {schedule.dateRange && schedule.dateRange.map((date, dateIndex) => (
//                           date !== null ? (
//                             <div key={dateIndex}>{new Date(date).toLocaleDateString()}</div>
//                           ) : null
//                         ))}
//                       </TableCell>
//                       {/* <TableCell align="center">{schedule.usersAssigned || 'N/A'}</TableCell> */}
//                     </TableRow>
//                   ))}
//                 </TableBody>
//               </Table>
//             ) : (
//               <>
//                 <Typography variant="body1" style={{ padding: '16px' }}>
//                   Haga clic en la flecha para ver el horario.
//                 </Typography>
//               </>
//             )}

//             <>
//               <br />
//               <SidebarEditHorario open={editHorarioOpen} toggle={toggleEditHorario} scheduleId={row._id || ''} />
//               {/* <Button
//                 variant="contained"
//                 color={row.isActive ? 'secondary' : 'primary'}
//                 onClick={() => handleToggleActive(row._id, !row.isActive)}
//                 style={{ marginLeft: '8px' }} // Agrega un margen izquierdo para crear espacio
//               >
//                 {row.isActive ? 'Dar de baja' : 'Activar'}
//               </Button> */}
//             </>
//           </Collapse>
//         </TableCell>
//       </TableRow>
//     </React.Fragment>
//   );
// }

// export default function CollapsibleTable() {
//   const [data, setData] = useState<Docu[]>([]);
//   const [addHorarioOpen, setAddHorarioOpen] = useState<boolean>(false);
//   const toggleAddHorario = () => setAddHorarioOpen(!addHorarioOpen);
//   const classes = useStyles();
//   const theme = useTheme();
//   const [open, setOpen] = React.useState(false);
//   const [editHorarioOpen, setEditHorarioOpen] = useState<boolean>(false);
//   const dispatch = useDispatch<AppDispatch>()
//   const schedules: Docu[] = useSelector((state: RootState) => state.schedules.list);

//   const toggleEditHorario = (scheduleId: string | null) => {

//   };

//   useEffect(() => {
//     dispatch(fetchSchedules());
//   }, [dispatch])

//   console.log(schedules)

//   return (
//     <>
//       <SidebarAddHorario open={addHorarioOpen} toggle={toggleAddHorario} />
//       <TableContainer component={Paper}>
//         <Table aria-label="collapsible table">
//           <TableHead>
//             <TableRow
//               sx={{
//                 '&:nth-of-type(odd)': {
//                   backgroundColor: open ? theme.palette.mode === 'dark' ? '#263238' : '#263238' : theme.palette.mode === 'dark' ? '#263238' : '#263238',
//                   boxShadow: 'inset 0px 0px 5px rgba(0, 0, 0, 0.5)',
//                   color: '#ffffff',
//                 },
//                 '& > *': {
//                   borderBottom: '1px solid #ccc',
//                   color: '#ffffff',
//                 }
//               }}>
//               <TableCell className={classes.tableCell} align="center" style={{ fontWeight: 'bold', padding: '3px 10px', borderRight: '1px solid rgba(224, 224, 224, 1)', borderBottom: '1px solid rgba(224, 224, 224, 1)', color: '#ffffff' }}>
//                 N°
//               </TableCell>
//               <TableCell className={classes.tableCell} align="center" style={{ fontWeight: 'bold', padding: '3px 50px', borderRight: '1px solid rgba(224, 224, 224, 1)', borderBottom: '1px solid rgba(224, 224, 224, 1)', color: '#ffffff' }}>
//                 NOMBRE HORARIO
//               </TableCell>
//               <TableCell align="center" style={{ fontWeight: 'bold', padding: '3px 50px', borderRight: '1px solid rgba(224, 224, 224, 1)', borderBottom: '1px solid rgba(224, 224, 224, 1)', color: '#ffffff' }}>
//                 vista de horario
//               </TableCell>
//             </TableRow>
//           </TableHead>
//           <TableBody>
//             {schedules.map((row) => (
//               <Row key={row._id} row={row} />
//             ))}
//           </TableBody>
//         </Table>
//       </TableContainer>
//     </>
//   );
// }
// function setData(updatedData: any) {
//   throw new Error('Function not implemented.');
// }
import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from 'src/store';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import SidebarAddHorario from '../../../views/apps/schedule/AddHorario';
import { fetchSchedules } from 'src/store/apps/schedule/index';
import { AppDispatch } from 'src/redux/store';
import { Box } from '@mui/system';
import { Link as StyledLink, Typography } from '@mui/material';
import CustomChip from 'src/@core/components/mui/chip'
import { ThemeColor } from 'src/@core/layouts/types';

interface ScheduleNormal {
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

interface Docu {
  id: string;
  name: string;
  scheduleNormal: ScheduleNormal[];
  scheduleSpecial: ScheduleSpecial[] | [];
  isActive: boolean;
  createdAt: Date;
}

interface CellType {
  row: Docu
}

interface ScheduleStatusType {
  [key: string]: ThemeColor
}

const scheduleStatusObj: ScheduleStatusType = {
  activo: 'success',
  inactivo: 'secondary'
}

const columns = [
  {
    field: 'name',
    headerName: 'Nombre de Horario',
    flex: 0.2,
    minWidth: 230,
    renderCell: ({ row }: CellType) => {
      return (
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <StyledLink
            href={`/user/horario/view/${row.id}`}
            style={{
              textDecoration: 'none',
            }}
          >
            <Typography variant="body2" fontWeight="bold" sx={{ color: 'grey' }}>
              {row.name}
            </Typography>
          </StyledLink>
        </Box>
      );
    },
  },
  {
    field: 'createdAt',
    headerName: 'Fecha de Creación',
    flex: 1,
    valueFormatter: (params: any) => {
      const date = new Date(params.value);
      return date.toLocaleDateString();
    },
  },

  {
    field: 'isActive',
    headerName: 'Estado',
    flex: 0.1,
    minWidth: 110,
    renderCell: ({ row }: CellType) => {
      const status = row.isActive ? 'activo' : 'inactivo';
      return (
        <CustomChip
          skin='light'
          size='small'
          label={status}
          color={scheduleStatusObj[status]}
          sx={{ textTransform: 'capitalize', '& .MuiChip-label': { lineHeight: '18px' } }}
        />
      )
    }
  },
  {
    field: 'hasSpecial',
    headerName: 'Horario Especial',
    flex: 1,
    // valueGetter: (params) => (params.row && params.row.scheduleSpecial && params.row.scheduleSpecial.length > 0 ? 'Sí' : 'No'),
  },
];

function HorarioTable() {
  const dispatch = useDispatch<AppDispatch>();
  const schedules = useSelector((state: RootState) => state.schedules.list);
  const [addHorarioOpen, setAddHorarioOpen] = useState<boolean>(false);
  const toggleAddHorario = () => setAddHorarioOpen(!addHorarioOpen);


  useEffect(() => {
    dispatch(fetchSchedules());
  }, [dispatch, schedules]);


  const rows = schedules.map(row => {
    return {
      id: row._id || '',
      name: row.name,
      scheduleNormal: row.scheduleNormal,
      scheduleSpecial: row.scheduleSpecial,
      createdAt: new Date(row.createdAt),
      isActive: row.isActive || false,
    };
  });
  return (
    <>
      <SidebarAddHorario open={addHorarioOpen} toggle={toggleAddHorario} />
      <div style={{ height: 500, width: '100%' }}>
        <DataGrid
          rows={rows}
          columns={columns}
          pageSize={10}
        />
      </div>
    </>
  );
}

export default HorarioTable;


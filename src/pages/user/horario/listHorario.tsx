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
// import React, { useEffect, useState } from 'react';
// import { useSelector, useDispatch } from 'react-redux';
// import { RootState } from 'src/store';
// import { DataGrid, GridColDef } from '@mui/x-data-grid';
// import SidebarAddHorario from '../../../views/apps/schedule/AddHorario';
// import { fetchSchedules } from 'src/store/apps/schedule/index';
// import { AppDispatch } from 'src/redux/store';
// import { Box } from '@mui/system';
// import { Link as StyledLink, Typography } from '@mui/material';
// import CustomChip from 'src/@core/components/mui/chip'
// import { ThemeColor } from 'src/@core/layouts/types';

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
//   id: string;
//   name: string;
//   scheduleNormal: ScheduleNormal[];
//   scheduleSpecial: ScheduleSpecial[] | [];
//   isActive: boolean;
//   createdAt: Date;
// }

// interface CellType {
//   row: Docu
// }

// interface ScheduleStatusType {
//   [key: string]: ThemeColor
// }

// const scheduleStatusObj: ScheduleStatusType = {
//   activo: 'success',
//   inactivo: 'secondary'
// }

// const columns = [
//   {
//     field: 'name',
//     headerName: 'Nombre de Horario',
//     flex: 0.2,
//     minWidth: 230,
//     renderCell: ({ row }: CellType) => {
//       return (
//         <Box sx={{ display: 'flex', alignItems: 'center' }}>
//           <StyledLink
//             href={`/user/horario/view/${row.id}`}
//             style={{
//               textDecoration: 'none',
//             }}
//           >
//             <Typography variant="body2" fontWeight="bold" sx={{ color: 'grey' }}>
//               {row.name}
//             </Typography>
//           </StyledLink>
//         </Box>
//       );
//     },
//   },
//   {
//     field: 'createdAt',
//     headerName: 'Fecha de Creación',
//     flex: 1,
//     valueFormatter: (params: any) => {
//       const date = new Date(params.value);
//       return date.toLocaleDateString();
//     },
//   },

//   {
//     field: 'isActive',
//     headerName: 'Estado',
//     flex: 0.1,
//     minWidth: 110,
//     renderCell: ({ row }: CellType) => {
//       const status = row.isActive ? 'activo' : 'inactivo';
//       return (
//         <CustomChip
//           skin='light'
//           size='small'
//           label={status}
//           color={scheduleStatusObj[status]}
//           sx={{ textTransform: 'capitalize', '& .MuiChip-label': { lineHeight: '18px' } }}
//         />
//       )
//     }
//   },
//   {
//     field: 'hasSpecial',
//     headerName: 'Horario Especial',
//     flex: 1,
//     // valueGetter: (params) => (params.row && params.row.scheduleSpecial && params.row.scheduleSpecial.length > 0 ? 'Sí' : 'No'),
//   },
// ];

// function HorarioTable() {
//   const dispatch = useDispatch<AppDispatch>();
//   const schedules = useSelector((state: RootState) => state.schedules.list);
//   const [addHorarioOpen, setAddHorarioOpen] = useState<boolean>(false);
//   const toggleAddHorario = () => setAddHorarioOpen(!addHorarioOpen);


//   useEffect(() => {
//     dispatch(fetchSchedules());
//   }, [dispatch, schedules]);


//   const rows = schedules.map(row => {
//     return {
//       id: row._id || '',
//       name: row.name,
//       scheduleNormal: row.scheduleNormal,
//       scheduleSpecial: row.scheduleSpecial,
//       createdAt: new Date(row.createdAt),
//       isActive: row.isActive || false,
//     };
//   });
//   return (
//     <>
//       <SidebarAddHorario open={addHorarioOpen} toggle={toggleAddHorario} />
//       <div style={{ height: 500, width: '100%' }}>
//         <DataGrid
//           rows={rows}
//           columns={columns}
//           pageSize={10}
//         />
//       </div>
//     </>
//   );
// }

// export default HorarioTable;

import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from 'src/store';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import SidebarAddHorario from '../../../views/apps/schedule/AddHorario';
import { fetchSchedules, toggleScheduleStatus } from 'src/store/apps/schedule/index';
import { AppDispatch } from 'src/redux/store';
import { Box } from '@mui/system';
import { Link as StyledLink, Typography } from '@mui/material';
import CustomChip from 'src/@core/components/mui/chip'
import { ThemeColor } from 'src/@core/layouts/types';
import { GridValueFormatterParams } from '@mui/x-data-grid';
import IconButton from '@mui/material/IconButton';
import Icon from 'src/@core/components/icon';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import Tooltip from '@mui/material/Tooltip';
import { GridRenderCellParams } from '@mui/x-data-grid';
import SidebarEditHorario from 'src/views/apps/schedule/EditHorario';
import Swal from 'sweetalert2';
import TableHeader from 'src/views/apps/schedule/TableHeaderSchedule';
import CircularProgress from '@material-ui/core/CircularProgress/CircularProgress';



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

export interface Docu {
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
function HorarioTable() {
  const dispatch = useDispatch<AppDispatch>();
  const schedules = useSelector((state: RootState) => state.schedules.list);
  const [addHorarioOpen, setAddHorarioOpen] = useState<boolean>(false);
  const [editHorarioOpen, setEditHorarioOpen] = useState<boolean>(false)
  const toggleAddHorario = () => setAddHorarioOpen(!addHorarioOpen);
  const [selectedScheduleId, setSelectedScheduleId] = useState<string | null>(null);
  const scheduleStatus = useSelector((state: RootState) => state.schedules.status);

  const handleRowOptionsClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget)
  };
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const rowOptionsOpen = Boolean(anchorEl)

  const handleRowOptionsClose = () => {
    setAnchorEl(null);
  };

  const handleUpdate = (chargeId: string) => () => {
    setSelectedScheduleId(chargeId);
    setEditHorarioOpen(true);
    console.log("handleUpdate called:", chargeId, editHorarioOpen);
  };

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

  const swalWithBootstrapButtons = Swal.mixin({
    customClass: {
      confirmButton: 'btn btn-success',
      cancelButton: 'btn btn-danger'
    },
    buttonsStyling: true,
    confirmButtonColor: '#3085d6',
    cancelButtonColor: '#d33'
  });

  const columns = [
    {
      flex: 0.1,
      minWidth: 230,
      field: 'name',
      headerName: 'Nombre del Horario',
      renderCell: ({ row }: CellType) => {
        const { name } = row

        return (

          <Box sx={{ display: 'flex', alignItems: 'flex-start', flexDirection: 'column' }}>
            <StyledLink href={`/user/horario/view/${row.id}/`}>{[name]}</StyledLink>
          </Box>

        )
      },
    },
    {
      flex: 0.1,
      field: 'createdAt',
      headerName: 'Fecha de Creación',

      valueFormatter: (params: any) => {
        const date = new Date(params.value);
        return date.toLocaleDateString();
      },
    },

    {
      flex: 0.1,
      field: 'isActive',
      headerName: 'Estado',

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
    // {
    //   flex: 0.1,
    //   field: 'scheduleSpecial',
    //   headerName: 'Horario Especial',
    //   valueFormatter: (params: GridValueFormatterParams) => (params.value ? 'Sí' : 'No'),
    // },
    {
      flex: 0.1,
      field: 'options',
      headerName: 'Opciones',
      sortable: false,
      filterable: false,
      disableColumnMenu: true,
      renderCell: (params: GridRenderCellParams) => {
        const { id, isActive } = params.row;

        return (
          <>
            <IconButton size='small' onClick={handleRowOptionsClick}>
              <Icon icon='mdi:dots-vertical' />
            </IconButton>
            <Menu
              keepMounted
              anchorEl={anchorEl}
              open={rowOptionsOpen}
              onClose={handleRowOptionsClose}
              anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'right'
              }}
              transformOrigin={{
                vertical: 'top',
                horizontal: 'right'
              }}
              PaperProps={{ style: { minWidth: '8rem' } }}
            >
              <Tooltip
                title={isActive ? '' : 'No se puede editar este cargo porque no está activo'}
                arrow
                placement="top"
              >
                <span>
                  <MenuItem
                    onClick={isActive ? handleUpdate(id.toString()) : undefined}
                    sx={{
                      '& svg': { mr: 2 },
                      pointerEvents: isActive ? 'auto' : 'none',
                      opacity: isActive ? 1 : 0.5,
                    }}
                  >
                    <Icon icon='mdi:edit' fontSize={20} />
                    Editar
                  </MenuItem>
                </span>
              </Tooltip>
              <MenuItem
                onClick={() => {

                  swalWithBootstrapButtons.fire({
                    title: isActive ? '¿Dar de Baja?' : '¿Activar?',
                    text: isActive
                      ? 'Realmente quieres dar de baja este horario?'
                      : 'Realmente quieres activar este horario?',
                    icon: 'warning',
                    showCancelButton: true,
                    confirmButtonText: isActive ? 'Sí, dar de baja' : 'Sí, activar',
                    cancelButtonText: 'No, cancelar',
                    reverseButtons: true
                  }).then((result) => {
                    if (result.isConfirmed) {
                      // Desactivar o activar el cargo
                      dispatch(
                        toggleScheduleStatus({
                          scheduleId: id.toString(),
                          isActive: !isActive, // Invertir el estado actual
                        })
                      )
                        .then(() => {
                          swalWithBootstrapButtons.fire(
                            isActive ? 'Baja Exitosa' : 'Activación Exitosa',
                            isActive
                              ? 'El horario ha sido dado de baja.'
                              : 'El horario ha sido activado.',
                            'success'
                          );
                        })
                        .catch((error) => {
                          swalWithBootstrapButtons.fire(
                            'Error',
                            'Hubo un error en la acción.',
                            'error'
                          );
                        });
                    } else if (result.dismiss === Swal.DismissReason.cancel) {
                      swalWithBootstrapButtons.fire(
                        'Cancelado',
                        'El horario está seguro :)',
                        'error'
                      )
                    }
                  });

                  handleRowOptionsClose();
                }}
                sx={{ '& svg': { mr: 2 } }}
              >
                <Icon
                  icon={isActive ? 'mdi:delete-outline' : 'mdi:account-check-outline'}
                  fontSize={20}
                />
                {isActive ? 'Dar de Baja' : 'Activar'}
              </MenuItem>
            </Menu>
          </>
        );
      },
    }
  ];
  function CustomLoadingOverlay() {
    return (
      <div style={{ position: 'absolute', top: 0, width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(255, 255, 255, 0.7)' }}>
        <CircularProgress color="inherit" />
      </div>
    );
  }


  return (
    <>
      <SidebarAddHorario open={addHorarioOpen} toggle={toggleAddHorario} />
      {selectedScheduleId && <SidebarEditHorario scheduleId={selectedScheduleId} open={editHorarioOpen} toggle={() => setEditHorarioOpen(false)} />}

      <DataGrid
        loading={scheduleStatus === 'loading'}
        autoHeight
        rows={rows}
        columns={columns}
        disableSelectionOnClick
        components={{
          LoadingOverlay: CustomLoadingOverlay, // Aquí se asigna el componente de carga personalizado
          // ...
        }}
        sx={{
          '& .MuiDataGrid-columnHeaders': { borderRadius: 0 }, '& .MuiDataGrid-window': {
            overflow: 'hidden'
          }
        }}
        disableColumnMenu={true}
        hideFooterPagination
        hideFooterSelectedRowCount

      />
    </>
  );
}

export default HorarioTable;


// import React, { useEffect, useState } from 'react';
// import { useSelector, useDispatch } from 'react-redux';
// import { RootState } from 'src/store';
// import { DataGrid, GridColDef } from '@mui/x-data-grid';
// import SidebarAddHorario from '../../../views/apps/schedule/AddHorario';
// import { fetchSchedules, fetchSchedulesByPage, toggleScheduleStatus } from 'src/store/apps/schedule/index';
// import { AppDispatch } from 'src/redux/store';
// import { Box } from '@mui/system';
// import { Card, FormControl, Grid, Pagination, Select, Link as StyledLink, Typography } from '@mui/material';
// import CustomChip from 'src/@core/components/mui/chip'
// import { ThemeColor } from 'src/@core/layouts/types';
// import { GridValueFormatterParams } from '@mui/x-data-grid';
// import IconButton from '@mui/material/IconButton';
// import Icon from 'src/@core/components/icon';
// import Menu from '@mui/material/Menu';
// import MenuItem from '@mui/material/MenuItem';
// import Tooltip from '@mui/material/Tooltip';
// import { GridRenderCellParams } from '@mui/x-data-grid';
// import SidebarEditHorario from 'src/views/apps/schedule/EditHorario';
// import Swal from 'sweetalert2';
// import TableHeader from 'src/views/apps/schedule/TableHeaderSchedule';
// import CircularProgress from '@material-ui/core/CircularProgress/CircularProgress';




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

// export interface Docu {
//   id: string;
//   name: string;
//   scheduleNormal: ScheduleNormal[];
//   scheduleSpecial: ScheduleSpecial[] | [];
//   isActive: boolean;
//   createdAt: Date;
// }


// interface CellType {
//   row: Docu
// }

// interface ScheduleStatusType {
//   [key: string]: ThemeColor
// }

// const scheduleStatusObj: ScheduleStatusType = {
//   activo: 'success',
//   inactivo: 'secondary'
// }
// const HorarioTable = () => {

//   const [addHorarioOpen, setAddHorarioOpen] = useState<boolean>(false);
//   const [editHorarioOpen, setEditHorarioOpen] = useState<boolean>(false)
//   const toggleAddHorario = () => setAddHorarioOpen(!addHorarioOpen);
//   const [selectedScheduleId, setSelectedScheduleId] = useState<string | null>(null);
//   const [value, setValue] = useState<string>('')
//   const [page, setPage] = useState(1);
//   const [pageSize, setPageSize] = useState(10);
//   const dispatch = useDispatch<AppDispatch>()
//   const schedules: Docu[] = useSelector((state: RootState) => state.schedules.list);
//   const scheduleStatus = useSelector((state: RootState) => state.schedules.status);
//   const totalPages = useSelector((state: RootState) => state.schedules.pageSize) || 0;
//   const paginatedSchedules = useSelector((state: RootState) => state.schedules.paginatedSchedule);

//   const handleRowOptionsClick = (event: React.MouseEvent<HTMLButtonElement>) => {
//     setAnchorEl(event.currentTarget)
//   };
//   const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
//   const rowOptionsOpen = Boolean(anchorEl)

//   const handleRowOptionsClose = () => {
//     setAnchorEl(null);
//   };

//   const handleUpdate = (chargeId: string) => () => {
//     setSelectedScheduleId(chargeId);
//     setEditHorarioOpen(true);
//     console.log("handleUpdate called:", chargeId, editHorarioOpen);
//   };

//   // useEffect(() => {
//   //   dispatch(fetchSchedules());
//   // }, [dispatch, schedules]);
//   useEffect(() => {
//     dispatch(fetchSchedulesByPage({ page, pageSize }));
//     //dispatch(setCurrentPage(page));
//     console.log(page)
//     console.log('pageSize', pageSize)
//   }, [page, pageSize, dispatch]);

//   const rows = schedules.map(row => {
//     return {
//       id: reversedPaginatedSchedules || '',
//       name: row.name,
//       scheduleNormal: row.scheduleNormal,
//       scheduleSpecial: row.scheduleSpecial,
//       createdAt: new Date(row.createdAt),
//       isActive: row.isActive || false,
//     };
//   });

//   const swalWithBootstrapButtons = Swal.mixin({
//     customClass: {
//       confirmButton: 'btn btn-success',
//       cancelButton: 'btn btn-danger'
//     },
//     buttonsStyling: true,
//     confirmButtonColor: '#3085d6',
//     cancelButtonColor: '#d33'
//   });

//   const columns = [
//     {
//       flex: 0.1,
//       minWidth: 230,
//       field: 'name',
//       headerName: 'Nombre del Horario',
//       renderCell: ({ row }: CellType) => {
//         const { name } = row

//         return (

//           <Box sx={{ display: 'flex', alignItems: 'flex-start', flexDirection: 'column' }}>
//             <StyledLink href={`/user/horario/view/${row.id}/`}>{[name]}</StyledLink>
//           </Box>

//         )
//       },
//     },
//     {
//       flex: 0.1,
//       field: 'createdAt',
//       headerName: 'Fecha de Creación',

//       valueFormatter: (params: any) => {
//         const date = new Date(params.value);
//         return date.toLocaleDateString();
//       },
//     },

//     {
//       flex: 0.1,
//       field: 'isActive',
//       headerName: 'Estado',

//       minWidth: 110,
//       renderCell: ({ row }: CellType) => {
//         const status = row.isActive ? 'activo' : 'inactivo';
//         return (
//           <CustomChip
//             skin='light'
//             size='small'
//             label={status}
//             color={scheduleStatusObj[status]}
//             sx={{ textTransform: 'capitalize', '& .MuiChip-label': { lineHeight: '18px' } }}
//           />
//         )
//       }
//     },
//     // {
//     //   flex: 0.1,
//     //   field: 'scheduleSpecial',
//     //   headerName: 'Horario Especial',
//     //   valueFormatter: (params: GridValueFormatterParams) => (params.value ? 'Sí' : 'No'),
//     // },
//     {
//       flex: 0.1,
//       field: 'options',
//       headerName: 'Opciones',
//       sortable: false,
//       filterable: false,
//       disableColumnMenu: true,
//       renderCell: (params: GridRenderCellParams) => {
//         const { id, isActive } = params.row;


//         return (
//           <>
//             <IconButton size='small' onClick={handleRowOptionsClick}>
//               <Icon icon='mdi:dots-vertical' />
//             </IconButton>
//             <Menu
//               keepMounted
//               anchorEl={anchorEl}
//               open={rowOptionsOpen}
//               onClose={handleRowOptionsClose}
//               anchorOrigin={{
//                 vertical: 'bottom',
//                 horizontal: 'right'
//               }}
//               transformOrigin={{
//                 vertical: 'top',
//                 horizontal: 'right'
//               }}
//               PaperProps={{ style: { minWidth: '8rem' } }}
//             >
//               <Tooltip
//                 title={isActive ? '' : 'No se puede editar este cargo porque no está activo'}
//                 arrow
//                 placement="top"
//               >
//                 <span>
//                   <MenuItem
//                     onClick={isActive ? handleUpdate(id.toString()) : undefined}
//                     sx={{
//                       '& svg': { mr: 2 },
//                       pointerEvents: isActive ? 'auto' : 'none',
//                       opacity: isActive ? 1 : 0.5,
//                     }}
//                   >
//                     <Icon icon='mdi:edit' fontSize={20} />
//                     Editar
//                   </MenuItem>
//                 </span>
//               </Tooltip>
//               <MenuItem
//                 onClick={() => {

//                   swalWithBootstrapButtons.fire({
//                     title: isActive ? '¿Dar de Baja?' : '¿Activar?',
//                     text: isActive
//                       ? 'Realmente quieres dar de baja este horario?'
//                       : 'Realmente quieres activar este horario?',
//                     icon: 'warning',
//                     showCancelButton: true,
//                     confirmButtonText: isActive ? 'Sí, dar de baja' : 'Sí, activar',
//                     cancelButtonText: 'No, cancelar',
//                     reverseButtons: true
//                   }).then((result) => {
//                     if (result.isConfirmed) {
//                       // Desactivar o activar el cargo
//                       dispatch(
//                         toggleScheduleStatus({
//                           scheduleId: id.toString(),
//                           isActive: !isActive, // Invertir el estado actual
//                         })
//                       )
//                         .then(() => {
//                           swalWithBootstrapButtons.fire(
//                             isActive ? 'Baja Exitosa' : 'Activación Exitosa',
//                             isActive
//                               ? 'El horario ha sido dado de baja.'
//                               : 'El horario ha sido activado.',
//                             'success'
//                           );
//                         })
//                         .catch((error) => {
//                           swalWithBootstrapButtons.fire(
//                             'Error',
//                             'Hubo un error en la acción.',
//                             'error'
//                           );
//                         });
//                     } else if (result.dismiss === Swal.DismissReason.cancel) {
//                       swalWithBootstrapButtons.fire(
//                         'Cancelado',
//                         'El horario está seguro :)',
//                         'error'
//                       )
//                     }
//                   });

//                   handleRowOptionsClose();
//                 }}
//                 sx={{ '& svg': { mr: 2 } }}
//               >
//                 <Icon
//                   icon={isActive ? 'mdi:delete-outline' : 'mdi:account-check-outline'}
//                   fontSize={20}
//                 />
//                 {isActive ? 'Dar de Baja' : 'Activar'}
//               </MenuItem>
//             </Menu>
//           </>
//         );
//       },
//     }
//   ];

//   function CustomLoadingOverlay() {
//     return (
//       <div style={{ position: 'absolute', top: 0, width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(255, 255, 255, 0.7)' }}>
//         <CircularProgress color="inherit" />
//       </div>
//     );
//   }
//   const reversedPaginatedSchedules = [...paginatedSchedules].reverse();
//   return (
//     <>
//       {/* <SidebarAddHorario open={addHorarioOpen} toggle={toggleAddHorario} />
//       {selectedScheduleId && <SidebarEditHorario scheduleId={selectedScheduleId} open={editHorarioOpen} toggle={() => setEditHorarioOpen(false)} />}

//       <DataGrid
//         autoHeight
//         rows={rows}
//         columns={columns}
//         disableSelectionOnClick
//         sx={{
//           '& .MuiDataGrid-columnHeaders': { borderRadius: 0 }, '& .MuiDataGrid-window': {
//             overflow: 'hidden'
//           }
//         }}
//         disableColumnMenu={true}
//         hideFooterPagination
//         hideFooterSelectedRowCount

//       /> */}
//       <Grid container spacing={50}>
//         <Grid item xs={12}>
//           <Card>
//             <TableHeader
//               value={value}
//               toggle={toggleAddHorario}
//               pageSize={pageSize}
//             />
//             <DataGrid
//               autoHeight
//               getRowId={(row) => row.id}
//               rows={reversedPaginatedSchedules}
//               columns={columns}
//               disableSelectionOnClick
//               pageSize={pageSize}
//               sx={{
//                 '& .MuiDataGrid-columnHeaders': { borderRadius: 0 }, '& .MuiDataGrid-window': {
//                   overflow: 'hidden'
//                 }
//               }}
//               disableColumnMenu={true}
//               hideFooterPagination
//               hideFooterSelectedRowCount
//               components={{
//                 LoadingOverlay: CustomLoadingOverlay,
//                 Pagination: () =>
//                   <>
//                     <Box display="flex" alignItems="center">
//                       <FormControl variant="standard" sx={{ m: 1, minWidth: 60 }}>
//                         <Select
//                           value={pageSize}
//                           onChange={(e) => setPageSize(Number(e.target.value))}
//                           style={{
//                             border: 'none',
//                             outline: 'none',
//                             boxShadow: 'none',
//                             fontSize: '15px',
//                             width: '70px',
//                           }}
//                         >
//                           <MenuItem value={5}>5</MenuItem>
//                           <MenuItem value={10}>10</MenuItem>
//                           <MenuItem value={20}>20</MenuItem>
//                           <MenuItem value={50}>50</MenuItem>
//                           <MenuItem value={100}>100</MenuItem>
//                           <MenuItem value={300}>300</MenuItem>
//                           <MenuItem value={500}>500</MenuItem>
//                           <MenuItem value={800}>800</MenuItem>
//                           <MenuItem value={1000}>1000</MenuItem>
//                         </Select>
//                       </FormControl>
//                       <Pagination count={totalPages} page={page} onChange={(event, value) => setPage(value)} />
//                     </Box>
//                   </>,
//               }}
//             />
//           </Card>
//         </Grid>

//         <SidebarAddHorario open={addHorarioOpen} toggle={toggleAddHorario} />
//         {selectedScheduleId && <SidebarEditHorario scheduleId={selectedScheduleId} open={editHorarioOpen} toggle={() => setEditHorarioOpen(false)} />}

//       </Grid>
//     </>
//   );
// }

// export default HorarioTable;





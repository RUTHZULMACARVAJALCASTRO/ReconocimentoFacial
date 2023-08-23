import React, { useEffect, useState } from 'react';
import {
  Collapse,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  IconButton,
  TableCell,
  TableRow,
  Button,
  TableHead,
  Paper,
  Table,
  TableBody,
  TableContainer,
  Icon,
  useTheme,
} from '@mui/material';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import axios from 'axios';
import { makeStyles } from '@mui/styles';
import EditSchedule from './EditSchedule';

interface Schedule {
  day: number;
  morningEntry: string;
  morningExit: string;
  afternoonEntry: string;
  afternoonExit: string;
  entranceTolerance: number;
}

interface Docu {
  _id: string;
  name: string;
  schedules: Schedule[];
  isActive: boolean;
}

interface RowProps {
  row: Docu;
}

const useStyles = makeStyles((theme: any) => ({
  tableRowLight: {
    backgroundColor: theme.palette.background.paper,
  },
  tableRowDark: {
    backgroundColor: theme.palette.background.default,
  },
  tableCell: {
    textAlign: 'center',
  },
}));

const dias = ['LUNES', 'MARTES', 'MIERCOLES', 'JUEVES', 'VIERNES', 'SABADO', 'DOMINGO'];

function Row(props: RowProps) {
  const { row } = props;
  const [isDeleteConfirmationOpen, setIsDeleteConfirmationOpen] = useState<boolean>(false);
  const [userIdToDelete, setUserIdToDelete] = useState<string>('');
  const classes = useStyles();
  const [open, setOpen] = React.useState(false);

  const handleDeleteCancelled = () => {
    setIsDeleteConfirmationOpen(false);
  };

  const handleDelete = (userId: string) => {
    setUserIdToDelete(userId);
    setIsDeleteConfirmationOpen(true);
  };

  const handleDeleteConfirmed = async () => {
    setIsDeleteConfirmationOpen(false);
    try {
      await axios.delete(`${process.env.NEXT_PUBLIC_PERSONAL}/${userIdToDelete}`);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <>
      <TableRow
        className={row.isActive ? classes.tableRowLight : classes.tableRowDark}
        sx={{ '& > *': { borderBottom: 'unset', border: '1px solid #e0e0e0' } }}
      >
        <TableCell>
          <IconButton aria-label="expand row" size="small" onClick={() => setOpen(!open)}>
            {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
          </IconButton>
        </TableCell>
        {row.schedules.map((schedule, index) => (
          <React.Fragment key={index}>
            <TableCell align="center">{dias[schedule.day]}</TableCell>
            <TableCell align="center">{schedule.morningEntry}</TableCell>
            <TableCell align="center">{schedule.morningExit}</TableCell>
            <TableCell align="center">{schedule.afternoonEntry}</TableCell>
            <TableCell align="center">{schedule.afternoonExit}</TableCell>
            <TableCell align="center">{schedule.entranceTolerance}</TableCell>
          </React.Fragment>
        ))}
      </TableRow>
      {/* ... (delete confirmation dialog) */}
    </>
  );
}

export default function CollapsibleTable() {
  const [data, setData] = useState<Docu[]>([]);
  const [editScheduleOpen, setEditScheduleOpen] = useState<boolean>(false);
  const toggleEditHorario = () => setEditScheduleOpen(!editScheduleOpen);
  const classes = useStyles();
  const theme = useTheme()
  const [open, setOpen] = React.useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const { data } = await axios.get<Docu[]>(`${process.env.NEXT_PUBLIC_PERSONAL_SCHEDULE}`);
      setData(data);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
        <TableContainer component={Paper}>
        <Table aria-label="collapsible table" >
          <TableHead>
            <TableRow sx={{
              '&:nth-of-type(odd)': {
                backgroundColor: open ? (theme.palette.mode === 'dark' ? '#5c6bc0' : '#E0F2FE') : (theme.palette.mode === 'dark' ? '#5c6bc0' : '#ffffff'),
              },
            }}>
              <TableCell className={classes.tableCell} align="center" style={{ fontWeight: 'bold' }}>
                NOMBRE HORARIO
              </TableCell>
              <TableCell className={classes.tableCell} align="center" style={{ fontWeight: 'bold' }}>
                DÍA
              </TableCell>
              <TableCell className={classes.tableCell} align="center" style={{ fontWeight: 'bold' }}>
                MAÑANA ENTRADA
              </TableCell>
              <TableCell className={classes.tableCell} align="center" style={{ fontWeight: 'bold' }}>
                MAÑANA SALIDA
              </TableCell>
              <TableCell className={classes.tableCell} align="center" style={{ fontWeight: 'bold' }}>
                TARDE ENTRADA
              </TableCell>
              <TableCell className={classes.tableCell} align="center" style={{ fontWeight: 'bold' }}>
                TARDE SALIDA
              </TableCell>
              <TableCell className={classes.tableCell} align="center" style={{ fontWeight: 'bold' }}>
                TOLERANCIA
              </TableCell>
              {/* <TableCell align="center">Acciones</TableCell> */}
            </TableRow>
          </TableHead>
          <TableBody>
            {data.map((row) => (
              <Row key={row._id} row={row} />
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </>
  );
}

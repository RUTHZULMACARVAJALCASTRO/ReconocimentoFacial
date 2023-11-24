import React, { useEffect, useState, MouseEvent } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from 'src/store';
import { DataGrid } from '@mui/x-data-grid';
import SidebarAddHorario from '../../../views/apps/schedule/AddHorario';
import { fetchScheduleByPage, toggleScheduleStatus } from 'src/store/apps/schedule/index';
import { AppDispatch } from 'src/redux/store';
import { Box } from '@mui/system';
import { Card, FormControl, Grid, Link, Pagination, Select } from '@mui/material';
import CustomChip from 'src/@core/components/mui/chip'
import { ThemeColor } from 'src/@core/layouts/types';
import IconButton from '@mui/material/IconButton';
import Icon from 'src/@core/components/icon';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import Tooltip from '@mui/material/Tooltip';
import SidebarEditHorario from 'src/views/apps/schedule/EditHorario';
import Swal from 'sweetalert2';
import TableHeader from 'src/views/apps/schedule/TableHeaderSchedule'
import CircularProgress from '@material-ui/core/CircularProgress/CircularProgress';
import { styled } from '@mui/material/styles'

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
  _id: string;
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
  inactivo: 'secondary',
}
const StyledLink = styled(Link)(({ theme }) => ({
  fontWeight: 600,
  fontSize: '1rem',
  cursor: 'pointer',
  textDecoration: 'none',
  color: theme.palette.text.secondary,
  '&:hover': {
    color: theme.palette.primary.main
  }
}))

// Componente Principal

function HorarioTable() {
  const dispatch = useDispatch<AppDispatch>();
  const [addHorarioOpen, setAddHorarioOpen] = useState<boolean>(false);
  const [editHorarioOpen, setEditHorarioOpen] = useState<boolean>(false)
  const toggleAddHorario = () => setAddHorarioOpen(!addHorarioOpen);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(5);
  const scheduleStatus = useSelector((state: RootState) => state.schedules.status);
  const totalPages = useSelector((state: RootState) => state.schedules.pageSize) || 0;
  const [selectedScheduleId, setSelectedScheduleId] = useState<string | null>(null);
  const paginatedSchedule = useSelector((state: RootState) => state.schedules.paginatedSchedule);
  const [currentFilters, setCurrentFilters] = useState({});



  useEffect(() => {
    dispatch(fetchScheduleByPage({ page, pageSize, ...currentFilters }));
  }, [page, pageSize, currentFilters, dispatch]);

  const rows = paginatedSchedule.map(row => {
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



  const RowOptions = ({ id, isActive }: { id: number | string, isActive: boolean }) => {

    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)
    const rowOptionsOpen = Boolean(anchorEl)


    const handleRowOptionsClick = (event: MouseEvent<HTMLElement>) => {
      console.log('click aqui')
      setAnchorEl(event.currentTarget)
    }
    const handleRowOptionsClose = () => {
      setAnchorEl(null)
    }


    const handleUpdate = (scheduleId: string) => () => {
      setSelectedScheduleId(scheduleId);
      setEditHorarioOpen(true);
      console.log("handleUpdate called:", scheduleId, editHorarioOpen);
    };

    const swalWithBootstrapButtons = Swal.mixin({
      customClass: {
        confirmButton: 'btn btn-success',
        cancelButton: 'btn btn-danger'
      },
      buttonsStyling: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33'
    });


    return (
      <>
        <IconButton
          size='small'
          data-action-button="true"
          onClick={handleRowOptionsClick}
          style={{ height: '500%', width: '100%', display: 'flex', justifyContent: 'center' }}
        >
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
            title={isActive ? '' : 'No se puede editar este horario porque no está activo'}
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
                    'El cargo está seguro :)',
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

    )
  }

  const columns = [
    {
      flex: 0.1,
      minWidth: 90,
      sortable: false,
      field: 'actions',
      headerName: 'Acciones',
      renderCell: ({ row }: CellType) => <RowOptions id={row._id} isActive={row.isActive} />
    },
    {
      flex: 0.1,
      field: 'isActive',
      headerName: 'Estado',
      minWidth: 200,
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
      flex: 0.1,
      minWidth: 450,
      field: 'name',
      headerName: 'Nombre del Horario',
      renderCell: ({ row }: CellType) => {
        const { name } = row

        return (
          <StyledLink href={`/user/horario/view/${row._id}/`}>
            <Box sx={{ display: 'flex', alignItems: 'flex-start', flexDirection: 'column' }}>
              {name}
            </Box>
          </StyledLink>
        )
      },
    },
    {
      flex: 0.1,
      minWidth: 300,
      field: 'createdAt',
      headerName: 'Fecha de Creación',

      valueFormatter: (params: any) => {
        const date = new Date(params.value);
        return date.toLocaleDateString();
      },
    },

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
      <Grid>
        <SidebarAddHorario open={addHorarioOpen} toggle={toggleAddHorario} setPage={setPage} />
        {selectedScheduleId && <SidebarEditHorario scheduleId={selectedScheduleId} open={editHorarioOpen} toggle={() => setEditHorarioOpen(false)} />}
        <Grid item xs={12}>
          <Card>
            <TableHeader
              toggle={toggleAddHorario}
              pageSize={pageSize}
              page={page} setPage={setPage} setCurrentFilters={setCurrentFilters}
            />
            <DataGrid
              loading={scheduleStatus === 'loading'}
              getRowId={row => row._id}
              autoHeight
              rows={paginatedSchedule}
              columns={columns}
              onRowClick={(params, event) => {
                const target = event.target as Element; // <- Aquí hacemos el type assertion
                if (!target.closest('[data-action-button="true"]')) {
                  window.location.href = `/user/horario/view/${params.id}/`;
                }
              }}
              disableSelectionOnClick
              pageSize={pageSize}
              components={{
                LoadingOverlay: CustomLoadingOverlay,
                Pagination: () =>
                  <>
                    <Box display="flex" alignItems="center">
                      <FormControl variant="standard" sx={{ m: 1, minWidth: 60 }}>
                        <Select
                          value={pageSize}
                          onChange={(e) => setPageSize(Number(e.target.value))}
                          style={{
                            border: 'none',
                            outline: 'none',
                            boxShadow: 'none',
                            fontSize: '15px',
                            width: '70px',
                          }}
                        >
                          <MenuItem value={2}>2</MenuItem>
                          <MenuItem value={5}>5</MenuItem>
                          <MenuItem value={10}>10</MenuItem>
                          <MenuItem value={20}>20</MenuItem>
                          <MenuItem value={50}>50</MenuItem>
                        </Select>
                      </FormControl>
                      <Pagination count={totalPages} page={page} onChange={(event, value) => setPage(value)} />
                    </Box>
                  </>,
              }}
              disableColumnMenu={true}
              localeText={{

                noRowsLabel: 'No hay filas',
                noResultsOverlayLabel: 'No se encontraron resultados.',
                errorOverlayDefaultLabel: 'Ocurrió un error.'
              }}
            />
          </Card>
        </Grid>

      </Grid>
    </>
  );
}

export default HorarioTable;
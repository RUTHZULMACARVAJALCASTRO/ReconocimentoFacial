
import Box from '@mui/material/Box'
import Card from '@mui/material/Card'
import Menu from '@mui/material/Menu'
import Grid from '@mui/material/Grid'
import { DataGrid } from '@mui/x-data-grid'
import { styled } from '@mui/material/styles'
import MenuItem from '@mui/material/MenuItem'
import IconButton from '@mui/material/IconButton'
import Typography from '@mui/material/Typography'
import Icon from 'src/@core/components/icon';
import { useState, useEffect, MouseEvent } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { toggleChargeStatus, fetchChargesByPage } from 'src/store/apps/charge/index';
import { RootState } from 'src/store';
import { AppDispatch } from 'src/redux/store';
import CustomChip from 'src/@core/components/mui/chip'
import { ThemeColor } from 'src/@core/layouts/types'
import TableHeader from 'src/views/apps/charge/TableHeaderCharge'
import SidebarAddCharge from 'src/views/apps/charge/AddCharge'
import SidebarEditCharge from 'src/views/apps/charge/EditCharge'
import Tooltip from '@mui/material/Tooltip';
interface HTMLElement extends Element { }
import Swal from 'sweetalert2';
import { CircularProgress, FormControl } from '@mui/material'
import { Pagination, Select } from '@mui/material';
import { makeStyles, Theme } from '@material-ui/core/styles';

export interface Docu {
  _id: string
  name: string
  description: string
  salary: string
  isActive: boolean
}

interface CellType {
  row: Docu
}

interface ChargeStatusType {
  [key: string]: ThemeColor
}

// Componente Principal
const ChargeList = () => {
  const [addChargeOpen, setAddChargeOpen] = useState<boolean>(false)
  const [editChargeOpen, setEditChargeOpen] = useState<boolean>(false)
  const [selectedChargeId, setSelectedChargeId] = useState<string | null>(null);
  const toggleAddCharge = () => setAddChargeOpen(!addChargeOpen)
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(5);
  const dispatch = useDispatch<AppDispatch>()
  const chargeStatus = useSelector((state: RootState) => state.charges.status);
  const totalPages = useSelector((state: RootState) => state.charges.pageSize) || 0;
  const paginatedCharges = useSelector((state: RootState) => state.charges.paginatedCharges);
  const [currentFilters, setCurrentFilters] = useState({});

  const useStyles = makeStyles((theme: Theme) => ({
    selectContainer: {
      marginRight: theme.spacing(2),
    },
    selectControl: {
      minWidth: 50,
    },
    customSelect: {
      '& .MuiSelect-select.MuiSelect-outlined.MuiInputBase-input.MuiOutlinedInput-input': {
        minWidth: 50,
      },
    },
    menuPaper: {
      border: 'none',
      boxShadow: 'none',
    },
  }));

  useEffect(() => {
    dispatch(fetchChargesByPage({ page, pageSize, ...currentFilters }));

  }, [page, pageSize, currentFilters, dispatch]);


  const chargeStatusObj: ChargeStatusType = {
    disponible: 'success',
    No_disponible: 'secondary',
  }

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


    const handleUpdate = (chargeId: string) => () => {
      setSelectedChargeId(chargeId);
      setEditChargeOpen(true);

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
                  ? 'Realmente quieres dar de baja este cargo?'
                  : 'Realmente quieres activar este cargo?',
                icon: 'warning',
                showCancelButton: true,
                confirmButtonText: isActive ? 'Sí, dar de baja' : 'Sí, activar',
                cancelButtonText: 'No, cancelar',
                reverseButtons: true
              }).then((result) => {
                if (result.isConfirmed) {

                  dispatch(
                    toggleChargeStatus({
                      chargeId: id.toString(),
                      isActive: !isActive,
                    })
                  )
                    .then(() => {
                      swalWithBootstrapButtons.fire(
                        isActive ? 'Baja Exitosa' : 'Activación Exitosa',
                        isActive
                          ? 'El cargo ha sido dado de baja.'
                          : 'El cargo ha sido activado.',
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
      minWidth: 60,
      sortable: false,
      textAlign: 'center',
      field: 'actions',
      headerName: 'Acciones',
      renderCell: ({ row }: CellType) => <RowOptions id={row._id} isActive={row.isActive} />
    },
    {
      flex: 0.1,
      minWidth: 150,
      field: 'status',
      headerName: 'Estado',
      renderCell: ({ row }: CellType) => {
        const status = row.isActive ? 'disponible' : 'No disponible';
        return (
          <CustomChip
            skin='light'
            size='small'
            label={status}
            color={chargeStatusObj[status]}
            sx={{ textTransform: 'capitalize', '& .MuiChip-label': { lineHeight: '18px' } }}
          />
        )
      }
    },


    {
      flex: 0.1,
      minWidth: 150,
      field: 'name',
      headerName: 'Nombre de Cargo',
      renderCell: ({ row }: CellType) => {
        return (
          <Typography noWrap variant='body2'>
            {row.name}
          </Typography>
        )
      }
    },
    {
      flex: 0.1,
      minWidth: 450,
      field: 'description',
      headerName: 'Descripcion',
      renderCell: ({ row }: CellType) => {
        return (
          <Tooltip title={row.description || ''}>
            <div style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
              <Typography noWrap variant='body2'>
                {row.description}
              </Typography>
            </div>
          </Tooltip>
        )
      }
    },
    {
      flex: 0.1,
      minWidth: 200,
      field: 'salary',
      headerName: 'Salario',
      renderCell: ({ row }: CellType) => {
        return (
          <Tooltip title={row.salary || ''}>
            <div>
              <Typography noWrap variant='body2'>
                {row.salary}
              </Typography>
            </div>
          </Tooltip>
        )
      }
    }

  ]
  function CustomLoadingOverlay() {
    return (
      <div style={{ position: 'absolute', top: 0, width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(255, 255, 255, 0.7)' }}>
        <CircularProgress color="inherit" />
      </div>
    );
  }



  return (
    <>
      <Grid container spacing={50}>
        <Grid item xs={12}>
          <Card>
            <TableHeader
              toggle={toggleAddCharge}
              pageSize={pageSize}
              page={page}
              setPage={setPage}
              setCurrentFilters={setCurrentFilters}
            />
            <DataGrid

              loading={chargeStatus === 'loading'}
              getRowId={row => row._id}
              autoHeight
              rows={paginatedCharges}
              columns={columns}
              pageSize={pageSize}
              disableSelectionOnClick
              sx={{
                '& .MuiDataGrid-columnHeaders': { borderRadius: 0 }, '& .MuiDataGrid-window': {
                  overflow: 'hidden'
                }
              }}
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

              localeText={{

                noRowsLabel: 'No hay Cargos',
                noResultsOverlayLabel: 'No se encontraron resultados.',
                errorOverlayDefaultLabel: 'Ocurrió un error.'
              }}
              disableColumnMenu={true}

            />
          </Card>
        </Grid>

        <SidebarAddCharge open={addChargeOpen} toggle={toggleAddCharge} setPage={setPage} page={0} pageSize={0} />
        {selectedChargeId && <SidebarEditCharge chargeId={selectedChargeId} open={editChargeOpen} toggle={() => setEditChargeOpen(false)} />}
      </Grid>
    </>
  )
}


export default ChargeList



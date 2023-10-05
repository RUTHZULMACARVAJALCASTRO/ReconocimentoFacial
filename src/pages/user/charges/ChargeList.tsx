
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
import { useState, useEffect, MouseEvent, useCallback } from 'react'
import charge, { fetchCharges } from 'src/store/apps/charge/index';
import { useDispatch, useSelector } from 'react-redux'
import { toggleChargeStatus } from 'src/store/apps/charge/index';
import { RootState } from 'src/store';
import { AppDispatch } from 'src/redux/store';
import CustomChip from 'src/@core/components/mui/chip'
import { ThemeColor } from 'src/@core/layouts/types'
import TableHeader from 'src/views/apps/user/TableHeaderCharge'
import SidebarAddCharge from 'src/views/apps/charge/AddCharge'
import SidebarEditCharge from 'src/views/apps/charge/EditCharge'
import Tooltip from '@mui/material/Tooltip';
interface HTMLElement extends Element { }
import Swal from 'sweetalert2';
import { CircularProgress } from '@mui/material'

export interface Docu {
  _id: string
  name: string
  description: string
  isActive: boolean
}

interface ChargeData {
  _id: string
  name: string
  description: string
  isActive: boolean
}

interface CellType {
  row: Docu
}

interface ChargeStatusType {
  [key: string]: ThemeColor
}


const ChargeList = () => {
  // ** State
  const [data, setData] = useState<Docu[]>([])
  const [value, setValue] = useState<string>('')
  const [pageSize, setPageSize] = useState<number>(10)
  const [addChargeOpen, setAddChargeOpen] = useState<boolean>(false)
  const [editChargeOpen, setEditChargeOpen] = useState<boolean>(false)
  const [selectedChargeId, setSelectedChargeId] = useState<string | null>(null);
  const toggleAddCharge = () => setAddChargeOpen(!addChargeOpen)

  const dispatch = useDispatch<AppDispatch>()

  const charges: Docu[] = useSelector((state: RootState) => state.charges.list);
  const chargeStatus = useSelector((state: RootState) => state.charges.status);

  useEffect(() => {
    dispatch(fetchCharges());
  }, [dispatch]);


  const toggleChargeActivation = async (chargeId: string, isActive: boolean) => {
    console.log(`Setting charge with ID ${chargeId} active status to: ${isActive}`);

    try {
      await dispatch(toggleChargeStatus({ chargeId, isActive })).unwrap();

    } catch (error) {
      console.error("Error making the PUT request to update status:", error);
    }
  };

  const chargeStatusObj: ChargeStatusType = {
    activo: 'success',
    inactivo: 'secondary'
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
      console.log("handleUpdate called:", chargeId, editChargeOpen);
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
                  pointerEvents: isActive ? 'auto' : 'none', // Deshabilita el clic si el usuario está inactivo.
                  opacity: isActive ? 1 : 0.5, // Cambia la opacidad si el usuario está inactivo.
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
                  // Desactivar o activar el cargo
                  dispatch(
                    toggleChargeStatus({
                      chargeId: id.toString(),
                      isActive: !isActive, // Invertir el estado actual
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

  const handleFilter = useCallback((val: string) => {
    setValue(val)
  }, [])
  const [open, setOpen] = useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };
  const columns = [
    {
      flex: 0.1,
      minWidth: 110,
      field: 'status',
      headerName: 'Estado',
      renderCell: ({ row }: CellType) => {
        const status = row.isActive ? 'activo' : 'inactivo';
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
      headerName: 'Nombre',
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
      minWidth: 110,
      field: 'description',
      headerName: 'Descripcion',
      renderCell: ({ row }: CellType) => {
        return (
          <Tooltip title={row.description || ''}>
            <div>
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
      minWidth: 90,
      sortable: false,
      field: 'actions',
      headerName: 'Acciones',
      renderCell: ({ row }: CellType) => <RowOptions id={row._id} isActive={row.isActive} />
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
            <TableHeader value={value} handleFilter={handleFilter} toggle={toggleAddCharge} />
            <DataGrid
              loading={chargeStatus === 'loading'}
              getRowId={row => row._id}
              autoHeight
              rows={[...charges].reverse()}
              columns={columns}
              pageSize={pageSize}
              // rowsPerPageOptions={[10, 25, 50]}
              disableSelectionOnClick
              sx={{
                '& .MuiDataGrid-columnHeaders': { borderRadius: 0 }, '& .MuiDataGrid-window': {
                  overflow: 'hidden'
                }
              }}
              components={{
                LoadingOverlay: CustomLoadingOverlay
              }}
              onPageSizeChange={(newPageSize: number) => setPageSize(newPageSize)}
              localeText={{
                filterOperatorAfter: 'después de',
                filterOperatorOnOrAfter: 'en o después de',
                filterOperatorBefore: 'antes de',
                filterOperatorOnOrBefore: 'en o antes de',
                filterOperatorEquals: 'igual a',
                filterOperatorStartsWith: 'comienza con',
                filterOperatorEndsWith: 'termina con',
                filterOperatorContains: 'contiene',
                columnMenuLabel: 'Menú de columna',
                columnMenuShowColumns: 'Mostrar columnas',
                columnMenuFilter: 'Filtrar',
                columnMenuHideColumn: 'Ocultar',
                columnMenuUnsort: 'Desordenar',
                columnMenuSortAsc: 'Ordenar Asc',
                columnMenuSortDesc: 'Ordenar Desc',
                toolbarDensity: 'Densidad',
                toolbarDensityLabel: 'Densidad',
                toolbarDensityCompact: 'Compacto',
                toolbarDensityStandard: 'Estándar',
                toolbarDensityComfortable: 'Cómodo',
                noRowsLabel: 'No hay filas',
                noResultsOverlayLabel: 'No se encontraron resultados.',
                errorOverlayDefaultLabel: 'Ocurrió un error.'
              }}

            />
          </Card>
        </Grid>

        <SidebarAddCharge open={addChargeOpen} toggle={toggleAddCharge} />
        {selectedChargeId && <SidebarEditCharge chargeId={selectedChargeId} open={editChargeOpen} toggle={() => setEditChargeOpen(false)} />}
      </Grid>
    </>
  )
}


export default ChargeList
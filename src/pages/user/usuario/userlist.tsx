// ** Next Imports
import Router, { useRouter } from 'next/router';

// ** MUI Imports
import Image from 'next/image'

// ** MUI Imports
import Box from '@mui/material/Box'
import Card from '@mui/material/Card'
import Menu from '@mui/material/Menu'
import Grid from '@mui/material/Grid'

import { DataGrid, GridFilterModel } from '@mui/x-data-grid'
import { styled } from '@mui/material/styles'
import MenuItem from '@mui/material/MenuItem'
import IconButton from '@mui/material/IconButton'
import Typography from '@mui/material/Typography'
import Icon from 'src/@core/components/icon';
import { useState, useEffect, MouseEvent, useCallback, SyntheticEvent } from 'react'
import Link from 'next/link'
import user, { fetchUsers, fetchUsersByPage, toggleUserStatus, fetchFilteredUsers } from 'src/store/apps/user/index';
import { useDispatch, useSelector } from 'react-redux'
import { RootState } from 'src/store';
import { AppDispatch } from 'src/redux/store';
import CustomChip from 'src/@core/components/mui/chip'
import CustomAvatar from 'src/@core/components/mui/avatar'
import { getInitials } from 'src/@core/utils/get-initials'
import { ThemeColor } from 'src/@core/layouts/types'
import { rows } from 'src/@fake-db/table/static-data';
import axios from 'axios';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import Button from '@mui/material/Button';
import Warning from '@mui/icons-material/Warning';
import CheckCircle from '@mui/icons-material/CheckCircle';
import Swal from 'sweetalert2';
import { FormControl, InputLabel, Pagination, Select, TextField, Tooltip } from '@mui/material';
import { toggleChargeStatus } from 'src/store/apps/charge';
import TableHeader from 'src/views/apps/user/TableHeaderUser';
import SidebarEditUser from 'src/views/apps/user/EditUserDrawer';
import SidebarAddUser from 'src/views/apps/user/AddUserDrawer';

import CircularProgress from '@mui/material/CircularProgress';

import { makeStyles, Theme } from '@material-ui/core/styles';




// Interfaces
export interface Docu {
  _id: string;
  name: string;
  lastName: string;
  ci: string;
  email: string;
  phone: string;
  address: string;
  nationality: string;
  unity: string;
  charge: string;
  schedule: string;
  file: string;
  isActive: boolean;
  avatarColor?: ThemeColor;
}

interface CellType {
  row: Docu
}

interface UserStatusType {
  [key: string]: ThemeColor
}

// Componente Principal
const UserList = () => {
  // ** State
  // const [data, setData] = useState<Docu[]>([])
  const [value, setValue] = useState<string>('')
  const [addUserOpen, setAddUserOpen] = useState<boolean>(false)
  const [editUserOpen, setEditUserOpen] = useState<boolean>(false)
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);

  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(5);

  // const dispatch = useDispatch();
  const dispatch = useDispatch<AppDispatch>()
  const users: Docu[] = useSelector((state: RootState) => state.users.list);
  const userStatus = useSelector((state: RootState) => state.users.status);
  const totalPages = useSelector((state: RootState) => state.users.pageSize) || 0;
  const paginatedUsers = useSelector((state: RootState) => state.users.paginatedUsers);
  console.log(userStatus)

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
  }));

  const classes = useStyles();

  const toggleUserActivation = async (userId: string, isActive: boolean) => {
    console.log(`Setting charge with ID ${userId} active status to: ${isActive}`);

    try {
      await dispatch(toggleUserStatus({ userId, isActive })).unwrap();

    } catch (error) {
      console.error("Error making the PUT request to update status:", error);
    }
  };

  useEffect(() => {
    dispatch(fetchUsersByPage({ page, pageSize }));
    console.log(page)
    console.log(pageSize)
  }, [page, pageSize, dispatch]);

  // useEffect(() => {
  //   const fetchData = async () => {
  //     await dispatch(fetchUsers());
  //   };
  //   fetchData();
  // }, [dispatch]);

  const userStatusObj: UserStatusType = {
    activo: 'success',
    inactivo: 'secondary'
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

  const convertBase64ToImageUrl = (base64String: string) => {
    return `data:image/png;base64,${base64String}`
  }

  const renderClient = (row: Docu) => {
    let imageSrc = convertBase64ToImageUrl(row.file);

    if (row.file) {
      // return <img src={imageSrc} style={{ width: '34px', height: '34px' }} />;
      return <CustomAvatar src={imageSrc} sx={{ mr: 3, width: 34, height: 34 }} />;
    } else {
      return (
        <CustomAvatar
          skin='light'
          color={row.avatarColor || 'primary'}
          sx={{ mr: 3, width: 34, height: 34, fontSize: '1rem' }}
        >
          {getInitials(row.name ? row.name : '')}
        </CustomAvatar>
      )
    }
  }

  const RowOptions = ({ id, isActive }: { id: number | string, isActive: boolean }) => {

    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)

    const rowOptionsOpen = Boolean(anchorEl)



    const handleRowOptionsClick = (event: MouseEvent<HTMLElement>) => {
      setAnchorEl(event.currentTarget)
    }
    const handleRowOptionsClose = () => {
      setAnchorEl(null)
    }


    const handleUpdate = (userId: string) => () => {
      setSelectedUserId(userId);
      setEditUserOpen(true);
    };

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
            title={isActive ? '' : 'No se puede editar este personal porque no está activo'}
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
              Swal.fire({
                title: isActive ? '¿Dar de Baja?' : '¿Activar?',
                text: isActive
                  ? 'Realmente quieres dar de baja este Personal?'
                  : 'Realmente quieres activar este Personal?',
                icon: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#3085d6',
                cancelButtonColor: '#d33',
                confirmButtonText: isActive ? 'Sí, dar de baja' : 'Sí, activar',
              }).then((result) => {
                if (result.isConfirmed) {
                  // Desactivar o activar el cargo
                  dispatch(toggleUserStatus({
                    userId: id.toString(),
                    isActive: !isActive,
                  }))
                    .unwrap()
                    .then(() => {
                      Swal.fire(
                        isActive ? 'Baja Exitosa' : 'Activación Exitosa',
                        isActive
                          ? 'El personal ha sido dado de baja.'
                          : 'El personal ha sido activado.',
                        'success'
                      );

                      // dispatch(fetchUsersByPage({ page, pageSize }));
                    })
                    .catch((error) => {
                      Swal.fire('Error', 'Hubo un error en la acción.', error);
                    });
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

  const toggleAddUserDrawer = () => setAddUserOpen(!addUserOpen)
  // const toggleEditUserDrawer = () => setEditUserOpen(!editUserOpen)
  // const [open, setOpen] = useState(false);

  // const handleClickOpen = () => {
  //   setOpen(true);
  // };

  // const handleClose = () => {
  //   setOpen(false);
  // }

  const columns = [

    {
      flex: 0.1,
      minWidth: 90,
      sortable: false,
      field: 'actions',
      headerName: 'Acciones',
      disableColumnMenu: true,
      renderCell: ({ row }: CellType) => <RowOptions id={row._id} isActive={row.isActive} />
    },
    {
      flex: 0.1,
      minWidth: 110,
      field: 'status',
      headerName: 'Estado',
      disableColumnMenu: true,
      renderCell: ({ row }: CellType) => {
        const status = row.isActive ? 'activo' : 'inactivo';
        return (
          <CustomChip
            skin='light'
            size='small'
            label={status}
            color={userStatusObj[status]}
            sx={{ textTransform: 'capitalize', '& .MuiChip-label': { lineHeight: '18px' } }}
          />
        )
      }
    },
    {
      flex: 0.2,
      minWidth: 230,
      field: 'fullName',
      headerName: 'Usuario',
      disableColumnMenu: true,
      renderCell: ({ row }: CellType) => {
        const { name, lastName } = row

        return (
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            {row.file ?
              (
                <CustomAvatar src={convertBase64ToImageUrl(row.file)} sx={{ mr: 3, width: 34, height: 34 }} />
              )
              : (
                <CustomAvatar
                  skin='light'
                  color={row.avatarColor || 'primary'}
                  sx={{ mr: 3, width: 34, height: 34, fontSize: '1rem' }}
                >
                  {getInitials(row.name ? row.name : '')}
                </CustomAvatar>
              )}
            <Box sx={{ display: 'flex', alignItems: 'flex-start', flexDirection: 'column' }}>
              <StyledLink href={`/user/usuario/view/${row._id}/`}>{[name, ' ', lastName]}</StyledLink>
            </Box>
          </Box>
        )
      },
    },
    {
      flex: 0.1,
      minWidth: 150,
      field: 'ci',
      headerName: 'CI',
      disableColumnMenu: true,
      renderCell: ({ row }: CellType) => {
        return (
          <Tooltip title={row.ci || ''}>
            <div style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
              <Typography noWrap variant='body2'>
                {row.ci}
              </Typography>
            </div>
          </Tooltip>
        );
      },
    },
    {
      flex: 0.1,
      minWidth: 110,
      field: 'email',
      headerName: 'Email',
      renderCell: ({ row }: CellType) => {
        return (
          <Tooltip title={row.email || ''}>
            <div style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
              <Typography noWrap variant='body2'>
                {row.email}
              </Typography>
            </div>
          </Tooltip>
        );
      },
    },
    {
      flex: 0.1,
      minWidth: 110,
      field: 'phone',
      headerName: 'Celular',
      disableColumnMenu: true,
      renderCell: ({ row }: CellType) => {
        return (
          <Tooltip title={row.phone || ''}>
            <div style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
              <Typography noWrap variant='body2'>
                {row.phone}
              </Typography>
            </div>
          </Tooltip>
        );
      },
    },
    {
      flex: 0.1,
      minWidth: 110,
      field: 'address',
      headerName: 'Dirección',
      renderCell: ({ row }: CellType) => {
        return (
          <Tooltip title={row.address || ''}>
            <div style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
              <Typography noWrap variant='body2'>
                {row.address}
              </Typography>
            </div>
          </Tooltip>
        );
      },
    },
    {
      flex: 0.1,
      minWidth: 110,
      field: 'nationality',
      headerName: 'Nacionalidad',
      disableColumnMenu: true,
      renderCell: ({ row }: CellType) => {
        return (
          <Tooltip title={row.nationality || ''}>
            <div style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
              <Typography noWrap variant='body2'>
                {row.nationality}
              </Typography>
            </div>
          </Tooltip>
        );
      },
    },



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
      <Grid container spacing={6} >
        <Grid item xs={12}>
          <Card>
            <TableHeader value={value} toggle={toggleAddUserDrawer} pageSize={0} />
            <DataGrid
              loading={userStatus === 'loading'}
              rowHeight={60}
              getRowId={row => row._id}
              autoHeight
              rows={paginatedUsers}
              columns={columns}
              sx={{
                '& .MuiDataGrid-columnHeaders': { borderRadius: 0 },
                '& .MuiDataGrid-window': { overflow: 'hidden' }
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

                          <MenuItem value={5}>5</MenuItem>
                          <MenuItem value={10}>10</MenuItem>
                          <MenuItem value={20}>20</MenuItem>
                          <MenuItem value={50}>50</MenuItem>
                          <MenuItem value={100}>100</MenuItem>
                          <MenuItem value={300}>300</MenuItem>
                          <MenuItem value={500}>500</MenuItem>
                          <MenuItem value={800}>800</MenuItem>
                          <MenuItem value={1000}>1000</MenuItem>
                        </Select>
                      </FormControl>
                      <Pagination count={totalPages} page={page} onChange={(event, value) => setPage(value)} />
                    </Box>
                  </>,
              }}

              localeText={{

                noRowsLabel: 'No hay filas',
                noResultsOverlayLabel: 'No se encontraron resultados.',
                errorOverlayDefaultLabel: 'Ocurrió un error.'
              }}

            />
          </Card>
        </Grid>
        <SidebarAddUser open={addUserOpen} toggle={toggleAddUserDrawer} page={page} pageSize={pageSize} />
        {selectedUserId && <SidebarEditUser userId={selectedUserId} open={editUserOpen} toggle={() => setEditUserOpen(false)} />}
      </Grid>
    </>
  )
}

export default UserList
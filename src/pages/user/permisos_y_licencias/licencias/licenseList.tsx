
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
import { useDispatch, useSelector } from 'react-redux'

import { RootState } from 'src/store';
import { AppDispatch } from 'src/redux/store';
import CustomChip from 'src/@core/components/mui/chip'
import { ThemeColor } from 'src/@core/layouts/types'

import Tooltip from '@mui/material/Tooltip';
interface HTMLElement extends Element { }
import Swal from 'sweetalert2';
import { CircularProgress, FormControl } from '@mui/material'
import { Pagination, Select } from '@mui/material';
import { makeStyles, Theme } from '@material-ui/core/styles';
import { fetchLicensesByPage, toggleLicenseStatus } from 'src/store/apps/license'
import SidebarEditLicense from 'src/views/apps/licencias/EditarLicencia'
import SidebarAddLicense from 'src/views/apps/licencias/AddLicense'
import TableHeader from 'src/views/apps/licencias/TableHeaderLicense'

export interface AsignacionLicencia {
    _id: string;
    personal: string;
    licenseType: string;
    description: string;
    startDate: string;
    endDate: string;
    isActive: boolean;
}

interface User {
    _id: string;
    name: string;
    lastName: string;
}

interface CellType {
    row: AsignacionLicencia
}

interface licenseStatusType {
    [key: string]: ThemeColor
}

const licenseList = () => {
    // ** State
    const [data, setData] = useState<AsignacionLicencia[]>([])
    const [value, setValue] = useState<string>('')
    const [addLicenseOpen, setAddLicenseOpen] = useState<boolean>(false)
    const [editLicenseOpen, setEditLicenseOpen] = useState<boolean>(false)
    const [selectedLicenseId, setSelectedLicenseId] = useState<string | null>(null);
    const toggleAddLicense = () => setAddLicenseOpen(!addLicenseOpen)
    const [page, setPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);
    const dispatch = useDispatch<AppDispatch>()

    const licenseStatus = useSelector((state: RootState) => state.licenses.status);
    const totalPages = useSelector((state: RootState) => state.licenses.pageSize) || 0;
    const paginatedLicenses = useSelector((state: RootState) => state.licenses.paginatedLicenses);

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

    const classes = useStyles();


    useEffect(() => {
        dispatch(fetchLicensesByPage({ page, pageSize }));
        console.log(page)
        console.log('pageSize', pageSize)
    }, [page, pageSize, dispatch]);


    const licenseStatusObj: licenseStatusType = {
        asignado: 'success',
        finalizado: 'secondary',
    };

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


        const handleUpdate = (licenseId: string) => () => {
            setSelectedLicenseId(licenseId);
            setEditLicenseOpen(true);
            console.log("handleUpdate called:", licenseId, editLicenseOpen);
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
                        title={isActive ? '' : 'No se puede editar este licencia porque no está activo'}
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
                                    ? 'Realmente quieres dar de baja este licencia?'
                                    : 'Realmente quieres activar este licencia?',
                                icon: 'warning',
                                showCancelButton: true,
                                confirmButtonText: isActive ? 'Sí, dar de baja' : 'Sí, activar',
                                cancelButtonText: 'No, cancelar',
                                reverseButtons: true
                            }).then((result) => {
                                if (result.isConfirmed) {
                                    // Desactivar o activar el licencia
                                    dispatch(
                                        toggleLicenseStatus({
                                            licenseId: id.toString(),
                                            isActive: !isActive, // Invertir el estado actual
                                        })
                                    )
                                        .then(() => {
                                            swalWithBootstrapButtons.fire(
                                                isActive ? 'Baja Exitosa' : 'Activación Exitosa',
                                                isActive
                                                    ? 'El licencia ha sido dado de baja.'
                                                    : 'El licencia ha sido activado.',
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
                                        'El licencia está seguro :)',
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
    const [open, setOpen] = useState(false);
    const columns = [
        {
            flex: 0.1,
            minWidth: 90,
            sortable: false,
            field: 'actions',
            headerName: 'Acciones',
            renderCell: ({ row }: CellType) => <RowOptions id={row._id} isActive={row.isActive} />,
        },
        {
            flex: 0.1,
            minWidth: 110,
            field: 'licenseStatus', // Cambia esto según tus necesidades
            headerName: 'Estado de Licencia',
            renderCell: ({ row }: CellType) => {
                const status = row.isActive ? 'asignado' : 'finalizado'; // Asegúrate de que 'isActive' es la propiedad correcta
                return (
                    <CustomChip
                        skin='light'
                        size='small'
                        label={status}
                        color={licenseStatusObj[status]}
                        sx={{ textTransform: 'capitalize', '& .MuiChip-label': { lineHeight: '18px' } }}
                    />
                )
            },
        },
        {
            flex: 0.1,
            minWidth: 200,
            field: 'personal',
            headerName: 'Personal',
            renderCell: ({ row }: CellType) => {
                return (
                    <Tooltip title={row.personal || ''}>
                        <div style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                            <Typography noWrap variant='body2'>
                                {row.personal}
                            </Typography>
                        </div>
                    </Tooltip>
                );
            },
        },
        {
            flex: 0.1,
            minWidth: 200,
            field: 'licenseType',
            headerName: 'Tipo de Licencia',
            renderCell: ({ row }: CellType) => {
                return (
                    <Tooltip title={row.licenseType || ''}>
                        <div style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                            <Typography noWrap variant='body2'>
                                {row.licenseType}
                            </Typography>
                        </div>
                    </Tooltip>
                );
            },
        },
        {
            flex: 0.1,
            minWidth: 200,
            field: 'description',
            headerName: 'Descripción',
            renderCell: ({ row }: CellType) => {
                return (
                    <Tooltip title={row.description || ''}>
                        <div style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                            <Typography noWrap variant='body2'>
                                {row.description}
                            </Typography>
                        </div>
                    </Tooltip>
                );
            },
        },
        {
            flex: 0.1,
            minWidth: 200,
            field: 'startDate',
            headerName: 'Fecha de Inicio',
            renderCell: ({ row }: CellType) => {
                return (
                    <Tooltip title={row.startDate || ''}>
                        <div style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                            <Typography noWrap variant='body2'>
                                {row.startDate}
                            </Typography>
                        </div>
                    </Tooltip>
                );
            },
        },
        {
            flex: 0.1,
            minWidth: 200,
            field: 'endDate',
            headerName: 'Fecha de Finalización',
            renderCell: ({ row }: CellType) => {
                return (
                    <Tooltip title={row.endDate || ''}>
                        <div style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                            <Typography noWrap variant='body2'>
                                {row.endDate}
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
            <Grid container spacing={50}>
                <Grid item xs={12}>
                    <Card>
                        <TableHeader
                            //value={value}
                            toggle={toggleAddLicense}
                            pageSize={pageSize}
                        />
                        <DataGrid

                            loading={licenseStatus === 'loading'}
                            getRowId={row => row._id}
                            autoHeight
                            rows={paginatedLicenses}
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

                                noRowsLabel: 'No hay Licencias',
                                noResultsOverlayLabel: 'No se encontraron resultados.',
                                errorOverlayDefaultLabel: 'Ocurrió un error.'
                            }}
                            disableColumnMenu={true}

                        />
                    </Card>
                </Grid>

                <SidebarAddLicense open={addLicenseOpen} toggle={toggleAddLicense} />
                {selectedLicenseId && <SidebarEditLicense licenseId={selectedLicenseId} open={editLicenseOpen} toggle={() => setEditLicenseOpen(false)} />}
            </Grid>
        </>
    )
}


export default licenseList



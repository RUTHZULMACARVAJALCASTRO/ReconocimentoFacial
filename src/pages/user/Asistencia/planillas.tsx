import { useState, useEffect } from 'react';
import Card from '@mui/material/Card';
import { DataGrid } from '@mui/x-data-grid';
import axios from 'axios';
import Button from '@mui/material/Button';
import SaveIcon from '@mui/icons-material/Save';
import { IconButton, TableCell, Tooltip, Typography } from '@mui/material';
import Link from 'next/link'
import { GridRenderCellParams } from '@mui/x-data-grid';
import { useRouter } from 'next/router';
import VisibilityIcon from '@mui/icons-material/Visibility';


interface EntranceExit {
    hour: string;
    tolerance: number;
    marketHour: string;
    infraccion: string;
    type: string;
    status: string;
    shift: string
}

interface AttendanceDetail {
    date: string;
    specialDay?: string;
    entrances: EntranceExit[];
    exits: EntranceExit[];
}

interface PersonalData {
    id: string;
    personalId: string;
    name: string;
    lastName: string;
    ci: string;
    schedule: string;
    attendanceDetail: AttendanceDetail[];
}

const Planillas = () => {
    const router = useRouter();
    const [data, setData] = useState<PersonalData[]>([]);
    const [pageSize, setPageSize] = useState<number>(10);

    useEffect(() => {
        fetchData();
    }, []);



    const procesarDatos = async (data: PersonalData[]) => {
        const processedData: any = {};

        // Mapea los datos a un array de Promises
        const promises = data.map(async personal => {
            const latestAttendanceDetail = personal.attendanceDetail[personal.attendanceDetail.length - 1];
            const entrances = latestAttendanceDetail.entrances;
            const exits = latestAttendanceDetail.exits;
            const latestEntrance = entrances[entrances.length - 1];
            const latestExit = exits[exits.length - 1];

            // Comprueba si debería usar la última entrada o la última salida
            let useEntrance = true;
            if (latestExit && latestEntrance) {
                // Compara las horas para decidir si usar la entrada o la salida
                useEntrance = new Date(latestEntrance.hour).getTime() > new Date(latestExit.hour).getTime();
            } else if (latestExit) {
                useEntrance = false;
            }

            const horario = await axios.get(`${process.env.NEXT_PUBLIC_PERSONAL_SCHEDULE}${personal.schedule}`);
            const infoHorario = horario.data;

            processedData[personal.personalId] = {
                id: personal.personalId,
                nombre: personal.name,
                apellido: personal.lastName,
                ci: personal.ci,
                horario: infoHorario.name,
                turno: useEntrance ? latestEntrance.shift : latestExit.shift,
                tipo: useEntrance ? 'ENTRADA' : 'SALIDA',
                estado: useEntrance ? latestEntrance.status : latestExit.status,
                fecha: latestAttendanceDetail.date,
                horaDeRegistro: useEntrance ? latestEntrance.marketHour : latestExit.marketHour,
            };
        });

        // Espera a que todas las Promises se resuelvan
        await Promise.all(promises);

        // Ahora processedData debería estar completo
        return Object.values(processedData);
    };

    // const procesarDatos = async (data: PersonalData[]) => {
    //     const processedData: any = {};

    //     // Mapea los datos a un array de Promises
    //     const promises = data.map(async personal => {
    //         const latestAttendanceDetail = personal.attendanceDetail[personal.attendanceDetail.length - 1];
    //         const entrances = latestAttendanceDetail.entrances;
    //         const exits = latestAttendanceDetail.exits;
    //         const latestEntrance = entrances[entrances.length - 1];
    //         const latestExit = exits[exits.length - 1];
    //         const horario = await axios.get(`http://10.10.214.158:3000/api/schedule/${personal.schedule}`);
    //         const infoHorario = horario.data;

    //         processedData[personal.personalId] = {
    //             id: personal.personalId,
    //             nombre: personal.name,
    //             apellido: personal.lastName,
    //             ci: personal.ci,
    //             horario: infoHorario.name,
    //             turno: latestEntrance ? latestEntrance.shift : latestExit ? latestExit.shift : null,
    //             tipo: latestEntrance ? 'ENTRADA' : 'SALIDA',
    //             estado: latestEntrance ? latestEntrance.status : latestExit ? latestExit.status : null,
    //             fecha: latestAttendanceDetail.date,
    //             horaDeRegistro: latestEntrance ? latestEntrance.marketHour : latestExit ? latestExit.marketHour : null,
    //         };
    //     });

    //     // Espera a que todas las Promises se resuelvan
    //     await Promise.all(promises);

    //     // Ahora processedData debería estar completo
    //     return Object.values(processedData);
    // };


    const fetchData = async () => {
        try {
            const response = await axios.get(`${process.env.NEXT_PUBLIC_PERSONAL_PLANILLA}`);
            const processedData = await procesarDatos(response.data) as PersonalData[];

            console.log('entraa', processedData)
            setData(processedData);
        } catch (error) {
            console.log(error);
        }
    };

    const columns = [

        {
            flex: 0.1,
            field: 'nombre',
            headerName: 'Nombre',
            renderCell: (params: any) => (
                <Tooltip title={params.value || ''}>
                    <div>
                        {params.value}
                    </div>
                </Tooltip>
            ),
        },
        {
            flex: 0.1,
            field: 'apellido',
            headerName: 'Apellido',
            renderCell: (params: any) => (
                <Tooltip title={params.value || ''}>
                    <div>
                        {params.value}
                    </div>
                </Tooltip>
            ),
        },
        {
            flex: 0.1,
            field: 'ci',
            headerName: 'C.I.',
            renderCell: (params: any) => (
                <Tooltip title={params.value || ''}>
                    <div>
                        {params.value}
                    </div>
                </Tooltip>
            ),
        },
        {
            flex: 0.1,
            field: 'horario',
            headerName: 'Horario',
            renderCell: (params: any) => (
                <Tooltip title={params.value || ''}>
                    <div style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                        {params.value}
                    </div>
                </Tooltip>
            ),
        },
        {
            flex: 0.1,
            field: 'turno',
            headerName: 'Turno',
            renderCell: (params: any) => (
                <Tooltip title={params.value || ''}>
                    <div>
                        {params.value}
                    </div>
                </Tooltip>
            ),
        },
        {
            flex: 0.1,
            field: 'tipo',
            headerName: 'Tipo',
            renderCell: (params: any) => (
                <Tooltip title={params.value || ''}>
                    <div>
                        {params.value}
                    </div>
                </Tooltip>
            ),
        },
        {
            flex: 0.1,
            field: 'estado',
            headerName: 'Estado',
            renderCell: (params: any) => (
                <Tooltip title={params.value || ''}>
                    <div>
                        {params.value}
                    </div>
                </Tooltip>
            ),
        },
        {
            flex: 0.1,
            field: 'fecha',
            headerName: 'Fecha',
            renderCell: (params: any) => (
                <Tooltip title={params.value || ''}>
                    <div>
                        {params.value}
                    </div>
                </Tooltip>
            ),
        },
        {
            flex: 0.1,
            field: 'horaDeRegistro',
            headerName: 'Hora',
            renderCell: (params: any) => (
                <Tooltip title={params.value || ''}>
                    <div>
                        {params.value}
                    </div>
                </Tooltip>
            ),
        },
        {
            flex: 0.1,
            minWidth: 100,
            field: 'view',
            headerName: 'Vista',
            renderCell: (params: { row: { id: any; }; }) => (
                <IconButton
                    color="primary"
                    onClick={() => router.push(`/user/usuario/view/${params.row.id}/`)}
                >
                    <VisibilityIcon />
                </IconButton>
            )
        }

    ];

    return (
        <>
            <Typography
                variant="h4"
                component="h1"
                align="center"
                style={{ margin: '20px 0', fontWeight: 'bold' }}
            >
                PLANILLA DE ASISTENCIA
            </Typography>
            <Button
                variant="contained"
                color="primary"
                startIcon={<SaveIcon />}
                style={{ marginBottom: '16px' }}
            >
                Exportar a PDF
            </Button>
            <Card>
                <DataGrid
                    getRowId={(row) => row.id}
                    autoHeight
                    rows={[...data].reverse()}
                    columns={columns.map(column => ({
                        ...column,
                        width: 150, // ancho fijo para cada columna
                    }))}
                    pageSize={pageSize}
                    disableSelectionOnClick
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
        </>
    );
};

export default Planillas;
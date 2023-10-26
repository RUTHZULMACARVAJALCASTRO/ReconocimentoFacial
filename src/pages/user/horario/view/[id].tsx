import React, { useEffect, useState } from 'react';
import { DataGrid } from '@mui/x-data-grid';
import { Box, Paper, Typography } from '@mui/material';
import axios from 'axios';
import { useRouter } from 'next/router';
import { GridValueFormatterParams } from '@mui/x-data-grid';

// Define las interfaces para los tipos de horario
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
    scheduleSpecial: ScheduleSpecial[];
    isActive?: boolean;
}

interface PlanillaHorarioProps {
    scheduleId: string;
}

const PlanillaHorario = () => {
    const [normalData, setNormalData] = useState<any[]>([]);
    const [specialData, setSpecialData] = useState<any[]>([]);
    const [specialScheduleUsers, setSpecialScheduleUsers] = useState<string[]>([]);
    const [allUsers, setAllUsers] = useState<any[]>([]); // Nuevo estado para almacenar todos los usuarios
    const [error, setError] = useState<string | null>(null);
    const router = useRouter();
    const { id } = router.query;
    const daysOfWeek = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];

    // Función para cargar los datos del horario normal
    const fetchData = async () => {
        try {
            const { data } = await axios.get(
                `${process.env.NEXT_PUBLIC_PERSONAL_SCHEDULE}${id}`
            );

            // Filtra los datos en función del tipo de horario
            const normalScheduleData = data.scheduleNormal.map((schedule: ScheduleNormal, index: number) => ({
                id: index + 1,
                day: daysOfWeek[schedule.day],
                into: schedule.into,
                out: schedule.out,
                intoTwo: schedule.intoTwo,
                outTwo: schedule.outTwo,
                toleranceInto: schedule.toleranceInto,
                toleranceOut: schedule.toleranceOut,
            }));

            const specialScheduleData = data.scheduleSpecial.map((schedule: ScheduleSpecial, index: number) => ({
                id: index + 1,
                name: schedule.name,
                day: daysOfWeek[schedule.day],
                into: schedule.into,
                out: schedule.out,
                intoTwo: schedule.intoTwo,
                outTwo: schedule.outTwo,
                toleranceInto: schedule.toleranceInto,
                toleranceOut: schedule.toleranceOut,
                permanente: schedule.permanente,
                dateRange: schedule.dateRange.join(' - '),
                usersAssigned: schedule.usersAssigned,
            }));

            setNormalData(normalScheduleData);
            setSpecialData(specialScheduleData);
            setError(null);
        } catch (error) {
            console.error('Error al cargar datos:', error);
            setError('Error al cargar datos');
        }
    };

    // Función para cargar todos los usuarios
    const fetchAllUsers = async () => {
        try {
            const { data } = await axios.get(
                `${process.env.NEXT_PUBLIC_PERSONAL}`
            );
            console.log('Data de usuarios cargada:', data);
            setAllUsers(data.users);
        } catch (error) {
            console.error('Error al cargar todos los usuarios:', error);
        }
    };

    // Función para cargar los usuarios asignados al horario especial
    const fetchSpecialScheduleUsers = async () => {
        try {
            const { data } = await axios.get(
                `${process.env.NEXT_PUBLIC_PERSONAL_SCHEDULE}${id}`
            );

            // Extrae los IDs de los usuarios asignados al horario especial
            const userIds: string[] = data.scheduleSpecial.flatMap((schedule: ScheduleSpecial) => schedule.usersAssigned);

            setSpecialScheduleUsers(userIds);
        } catch (error) {
            console.error('Error al cargar usuarios asignados:', error);
        }
    };

    useEffect(() => {
        if (id) {
            fetchData();
            fetchAllUsers().then(() => {
                fetchSpecialScheduleUsers();
            });
        }
    }, [id]);

    // Define las columnas para el horario normal
    const normalColumns = [
        {
            flex: 0.1,
            field: 'day',
            headerName: 'Día',
            disableColumnMenu: false,
        },
        {
            flex: 0.1,
            field: 'into',
            headerName: 'Entrada Mañana',
            disableColumnMenu: false,
        },
        {
            flex: 0.1,
            field: 'out',
            headerName: 'Salida Mañana',
        },
        {
            flex: 0.1,
            field: 'intoTwo',
            headerName: 'Entrada Tarde',
        },
        {
            flex: 0.1,
            field: 'outTwo',
            headerName: 'Salida Tarde',
        },
        {
            flex: 0.1,
            field: 'toleranceInto',
            headerName: 'Tolerancia Entrada',
        },
        {
            flex: 0.1,
            field: 'toleranceOut',
            headerName: 'Tolerancia Salida',
        },
    ];

    // Define las columnas para el horario especial
    const specialColumns = [
        {
            flex: 0.1,
            field: 'name',
            headerName: 'Nombre Horario',
        },
        {
            flex: 0.1,
            field: 'day',
            headerName: 'Día',
        },
        {
            flex: 0.1,
            field: 'into',
            headerName: 'Entrada Mañana',
        },
        {
            flex: 0.1,
            field: 'out',
            headerName: 'Salida Mañana',
        },
        {
            flex: 0.1,
            field: 'intoTwo',
            headerName: 'Entrada Tarde',
        },
        {
            flex: 0.1,
            field: 'outTwo',
            headerName: 'Salida Tarde',
        },
        {
            flex: 0.1,
            field: 'toleranceInto',
            headerName: 'Tolerancia Entrada',
        },
        {
            flex: 0.1,
            field: 'toleranceOut',
            headerName: 'Tolerancia Salida',
        },

        {
            flex: 0.1,
            field: 'permanente',
            headerName: 'Permanente',
            valueFormatter: (params: GridValueFormatterParams) => (
                params.value ? 'Sí' : 'No'
            ),
        },
        {
            flex: 0.1,
            field: 'dateRange',
            headerName: 'Rango de Fechas',
        },

    ];

    // Columnas para la tabla de usuarios asignados al horario especial
    const specialScheduleUsersColumns = [
        {
            flex: 0.1,
            field: 'usersAssigned',
            headerName: 'Nombre de Usuario',
            valueFormatter: (params: GridValueFormatterParams) => {
                const userIds: string[] = params.value as string[];
                const userNames: string[] = userIds.map((userId) => {
                    if (allUsers) {
                        const user = allUsers.find((user) => user._id === userId);
                        console.log(`ID: ${userId}, User:`, user);
                        return user ? `${user.name} ${user.lastName}` : userId;
                    }
                    return userId;
                });
                return userNames.join(', ');
            },
        },
    ];

    return (
        <Paper elevation={3} style={{ padding: '16px', borderRadius: '12px', marginTop: '30px' }}>
            <Typography
                variant="h5"
                gutterBottom
                style={{
                    marginBottom: '24px',
                    fontWeight: 'bold',
                    letterSpacing: '1px',
                    textTransform: 'uppercase',
                    textShadow: '2px 2px 4px rgba(0, 0, 0, 0.1)',
                }}
                align="center"
            >
                DETALLE DE HORARIO
            </Typography>

            {error ? (
                <Typography variant="body1" color="error">
                    {error}
                </Typography>
            ) : (
                <>
                    {/* Tabla para Horario Normal */}
                    <Typography
                        variant="h6"
                        gutterBottom
                        align="center"
                        style={{
                            backgroundColor: '#6D788D',
                            color: 'white',
                            padding: '10px',
                            borderRadius: '5px',
                            boxShadow: '0px 4px 6px rgba(0, 0, 0, 0.1)',
                        }}
                    >
                        Horario Normal
                    </Typography>
                    <Box >
                        <DataGrid
                            autoHeight
                            rows={normalData}
                            columns={normalColumns.map(column => ({
                                ...column,
                                width: 150,
                            }))}
                            disableColumnMenu={true}
                            localeText={{
                                noRowsLabel: 'No hay Horario',
                            }}
                            hideFooterPagination
                            hideFooterSelectedRowCount
                        />
                    </Box>

                    {/* Tabla para Horario Especial */}
                    <Typography
                        variant="h6"
                        gutterBottom
                        align="center"
                        style={{
                            backgroundColor: '#6D788D',
                            color: 'white',
                            padding: '10px',
                            borderRadius: '5px',
                            boxShadow: '0px 4px 6px rgba(0, 0, 0, 0.1)',
                            marginTop: '20px',
                        }}
                    >
                        Horario Especial
                    </Typography>
                    {/* style={{ height: 400, width: '100%' }} */}
                    <Box >
                        <DataGrid
                            autoHeight
                            rows={specialData}
                            columns={specialColumns.map(column => ({
                                ...column,
                                width: 150,
                            }))}
                            disableColumnMenu={true}
                            localeText={{
                                noRowsLabel: 'No hay ningun Horario Especial para Ver',
                            }}
                            hideFooterPagination
                            hideFooterSelectedRowCount
                        />
                    </Box>

                    {/* Tabla para Usuarios Asignados al Horario Especial */}
                    <Typography
                        variant="h6"
                        gutterBottom
                        align="center"
                        style={{
                            backgroundColor: '#6D788D',
                            color: 'white',
                            padding: '10px',
                            borderRadius: '5px',
                            boxShadow: '0px 4px 6px rgba(0, 0, 0, 0.1)',
                            marginTop: '20px',
                        }}
                    >
                        Personal Asignados al Horario Especial
                    </Typography>
                    <Box>
                        <DataGrid
                            autoHeight
                            rows={specialData}
                            columns={specialScheduleUsersColumns}
                            disableColumnMenu={true}
                            localeText={{
                                noRowsLabel: 'No hay ningun Personal Asignado a un horario Especial',
                            }}
                            hideFooterPagination
                            hideFooterSelectedRowCount
                        />
                    </Box>
                </>
            )}
        </Paper>
    );
};

export default PlanillaHorario;

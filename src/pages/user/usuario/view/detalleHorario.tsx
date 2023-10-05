// import React, { useEffect, useState } from 'react';
// import { DataGrid } from '@mui/x-data-grid';
// import { Box, Paper, Typography } from '@mui/material';
// import axios from 'axios';
// import { useRouter } from 'next/router';

// interface ScheduleNormal {
//     day: number;
//     into: string;
//     out: string;
//     intoTwo: string;
//     outTwo: string;
//     toleranceInto: number;
//     toleranceOut: number;
// }

// interface ScheduleSpecial {
//     name: string;
//     day: number;
//     into: string;
//     out: string;
//     intoTwo: string;
//     outTwo: string;
//     toleranceInto: number;
//     toleranceOut: number;
//     permanente: boolean;
//     dateRange: [string | null, string | null];
//     usersAssigned: string[];
// }

// interface Docu {
//     _id?: string;
//     name: string;
//     scheduleNormal: ScheduleNormal[];
//     scheduleSpecial: ScheduleSpecial[];
//     isActive?: boolean;
// }

// interface PlanillaHorarioProps {
//     horarioId: string;
// }

// const PlanillaHorario: React.FC<PlanillaHorarioProps> = ({ horarioId }) => {
//     const [data, setData] = useState<any[]>([]);
//     const router = useRouter();

//     useEffect(() => {
//         fetchData();
//     }, [horarioId]);

//     const fetchData = async () => {
//         try {
//             const { data } = await axios.get(
//                 `http://10.10.214.24:3000/api/schedule/ ${horarioId}`
//             );

//             // Procesamiento de datos de ScheduleNormal
//             const scheduleNormalData = data.scheduleNormal.map((schedule: ScheduleNormal, index: number) => ({
//                 id: index + 1,
//                 day: schedule.day,
//                 into: schedule.into,
//                 out: schedule.out,
//                 intoTwo: schedule.intoTwo,
//                 outTwo: schedule.outTwo,
//                 toleranceInto: schedule.toleranceInto,
//                 toleranceOut: schedule.toleranceOut,
//             }));

//             // Procesamiento de datos de ScheduleSpecial
//             const scheduleSpecialData = data.scheduleSpecial.map((schedule: ScheduleSpecial, index: number) => ({
//                 id: index + 1,
//                 name: schedule.name,
//                 day: schedule.day,
//                 into: schedule.into,
//                 out: schedule.out,
//                 intoTwo: schedule.intoTwo,
//                 outTwo: schedule.outTwo,
//                 toleranceInto: schedule.toleranceInto,
//                 toleranceOut: schedule.toleranceOut,
//                 permanente: schedule.permanente,
//                 dateRange: schedule.dateRange.join(' - '), // Uniendo fechas como cadena
//                 usersAssigned: schedule.usersAssigned.join(', '), // Uniendo usuarios como cadena
//             }));

//             const processedData = [...scheduleNormalData, ...scheduleSpecialData];

//             setData(processedData);
//         } catch (error) {
//             console.error('Error al cargar datos:', error);
//             // Puedes mostrar un mensaje de error o tomar otras medidas aquí
//         }
//     };

//     const columns = [
//         {
//             flex: 0.1,
//             field: 'day',
//             headerName: 'Día',
//         },
//         {
//             flex: 0.1,
//             field: 'into',
//             headerName: 'Entrada',
//         },
//         {
//             flex: 0.1,
//             field: 'out',
//             headerName: 'Salida',
//         },
//         {
//             flex: 0.1,
//             field: 'intoTwo',
//             headerName: 'Entrada 2',
//         },
//         {
//             flex: 0.1,
//             field: 'outTwo',
//             headerName: 'Salida 2',
//         },
//         {
//             flex: 0.1,
//             field: 'toleranceInto',
//             headerName: 'Tolerancia Entrada',
//         },
//         {
//             flex: 0.1,
//             field: 'toleranceOut',
//             headerName: 'Tolerancia Salida',
//         },
//         {
//             flex: 0.1,
//             field: 'name',
//             headerName: 'Nombre Horario',
//         },
//         {
//             flex: 0.1,
//             field: 'permanente',
//             headerName: 'Permanente',
//         },
//         {
//             flex: 0.1,
//             field: 'dateRange',
//             headerName: 'Rango de Fechas',
//         },
//         {
//             flex: 0.1,
//             field: 'usersAssigned',
//             headerName: 'Usuarios Asignados',
//         },
//     ];

//     return (
//         <Paper elevation={3} style={{ padding: '16px', borderRadius: '12px', marginTop: '30px' }}>
//             <Typography
//                 variant="h5"
//                 gutterBottom
//                 style={{
//                     marginBottom: '24px',
//                     fontWeight: 'bold',
//                     letterSpacing: '1px',
//                     textTransform: 'uppercase',
//                     textShadow: '2px 2px 4px rgba(0, 0, 0, 0.1)',
//                 }}
//                 align="center"
//             >
//                 DETALLE DE HORARIO
//             </Typography>

//             <Box style={{ height: 400, width: '100%' }}>
//                 <DataGrid
//                     autoHeight // añadir esta prop
//                     rows={data}
//                     columns={columns.map(column => ({
//                         ...column,
//                         width: 150,
//                     }))}
//                     localeText={{
//                         // Personaliza los textos de la tabla si es necesario
//                     }}
//                 />
//             </Box>
//         </Paper>
//     );
// };

// export default PlanillaHorario;

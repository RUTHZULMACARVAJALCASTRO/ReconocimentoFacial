import React, { useEffect, useState } from 'react';
import { DataGrid, GridRenderCellParams } from '@mui/x-data-grid';
import { Box, Paper, TableCell, Tooltip, Typography } from '@mui/material';
import axios from 'axios';
import { minifyIconSet } from '@iconify/utils';

type EntranceExit = {
    hour: string;
    tolerance: number;
    marketHour: string;
    infraccion: string;
    type: string;
    status: string;
    shift: string;
};

type AttendanceDetail = {
    date: string;
    specialDay: string;
    entrances: EntranceExit[];
    exits: EntranceExit[];
};

type PersonalData = {
    personalId: string;
    name: string;
    lastName: string;
    ci: string;
    schedule: string;
    attendanceDetail: AttendanceDetail[];
};

interface PlanillaPersonalProps {
    personalId: string;
}

// const renderTooltipCell = (params: GridRenderCellParams) => (
// 	<Tooltip title={params.value} arrow>
// 		<TableCell
// 			style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}
// 		>
// 			{params.value}
// 		</TableCell>
// 	</Tooltip>
// );

const PlanillaPersonal: React.FC<PlanillaPersonalProps> = ({ personalId }) => {
    const [data, setData] = useState<any[]>([]);


    useEffect(() => {
        fetchData();
    }, [personalId]);

    const fetchData = async () => {
        try {
            const { data } = await axios.get<PersonalData>(
                `${process.env.NEXT_PUBLIC_PERSONAL_PLANILLA}${personalId}`
            );

            console.log('mensaje', data)
            const processedData: any[] = [];
            const horarioId = data.schedule;
            const horario = await axios.get(`${process.env.NEXT_PUBLIC_PERSONAL_SCHEDULE}${horarioId}`);
            const infoHorario = horario.data;
            console.log(infoHorario)


            data.attendanceDetail.forEach((detail) => {
                detail.entrances.concat(detail.exits).forEach((entry, index) => {
                    processedData.push({
                        id: `${personalId}-${detail.date}-${entry.hour}-${index}`,
                        fecha: detail.date,
                        marcado: entry.marketHour,
                        infraccion: entry.infraccion,
                        tipo: entry.type,
                        estado: entry.status,
                        turno: entry.shift,
                        nombreHorario: infoHorario.name,
                    });
                });
            });
            setData(processedData);
        } catch (error) {
            console.log(error);
        }
    };


    const columns = [
        {
            //flex: 0.1,
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
            // flex: 0.1,
            field: 'marcado',
            headerName: 'Marcado',
            renderCell: (params: any) => (
                <Tooltip title={params.value || ''}>
                    <div>
                        {params.value}
                    </div>
                </Tooltip>
            ),

        },
        {
            // flex: 0.1,
            field: 'infraccion',
            headerName: 'Infracción',
            renderCell: (params: any) => (
                <Tooltip title={params.value || ''}>
                    <div>
                        {params.value}
                    </div>
                </Tooltip>
            ),
        },
        {
            // flex: 0.1,
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
            // flex: 0.1,
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
            // flex: 0.1,
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
            // flex: 0.1,
            field: 'nombreHorario',
            headerName: 'Horario',
            renderCell: (params: any) => (
                <Tooltip title={params.value || ''}>
                    <div>
                        {params.value}
                    </div>
                </Tooltip>
            ),
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
                CONTROL DE ASISTENCIA
            </Typography>

            <Box style={{ height: 400, width: '100%' }}>
                <DataGrid
                    autoHeight // añadir esta prop
                    rows={data}
                    columns={columns.map(column => ({
                        ...column,
                        width: 150,
                    }))}
                    disableColumnMenu={true}
                    hideFooterPagination
                    hideFooterSelectedRowCount
                />
            </Box>
        </Paper>
    );
};

export default PlanillaPersonal;
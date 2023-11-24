import React, { useEffect, useState } from 'react';
import {
	TextField,
	Button,
	Box,
	Typography,
	Grid,
	useTheme,
	Paper,
	CardContent,
	Divider,
	Card,
	CircularProgress,
} from '@mui/material';
import { Controller, useForm } from 'react-hook-form';
import axios from 'axios';
import Swal from 'sweetalert2';
import { DataGrid, GridColumns } from '@mui/x-data-grid';
import MonetizationOnIcon from '@mui/icons-material/MonetizationOn';
import FileDownloadIcon from '@mui/icons-material/FileDownload';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import BusinessCenterIcon from '@mui/icons-material/BusinessCenter';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import AccountBalanceIcon from '@mui/icons-material/AccountBalance';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import WarningIcon from '@mui/icons-material/Warning';
import AddIcon from '@mui/icons-material/Add';
import { padding } from '@mui/system';



interface ReportData {
	id: string; // Agrega una propiedad 'id' única para cada fila
	date: string;
	type: string;
	specialDay: string;
	entryMorning: string;
	exitMorning: string;
	entryAfternoon: string;
	exitAfternoon: string;
}

interface SalaryData {
	detalle: {
		mes: string;
		gestion: number;
	};
	fechaIngreso: string;
	nombre_apellido: string;
	cargo: string;
	haber_basico: string;
	categoria: string;
	total_categoria: number;
	total_ganado: number;
	descuentos: {
		aporte_afps: number;
		aporte_nacional_solidario: number;
		rc_iva: number;
	};
}

interface ReportGeneratorProps {
	personalId: string;
}

const columns: GridColumns = [
	{ field: 'date', headerName: 'Fecha', flex: 0.1, minWidth: 110, },
	{ field: 'type', headerName: 'Tipo de Asistencia', flex: 0.1, minWidth: 120, },
	{ field: 'specialDay', headerName: 'Día Especial', flex: 0.1, minWidth: 120, },
	{ field: 'entryMorning', headerName: 'Entra Mañana', flex: 0.1, minWidth: 120, },
	{ field: 'exitMorning', headerName: 'Salida Mañana', flex: 0.1, minWidth: 120, },
	{ field: 'entryAfternoon', headerName: 'Entrada Tarde', flex: 0.1, minWidth: 120, },
	{ field: 'exitAfternoon', headerName: 'Salida Tarde', flex: 0.1, minWidth: 120, },
];

const ReportGenerator: React.FC<ReportGeneratorProps> = ({ personalId }) => {
	const [reportData, setReportData] = useState<ReportData[]>([]);
	const [cargo, setCargo] = useState();
	const [categoria, setCategoria] = useState();
	const [fechaIngreso, setFechaIngreso] = useState();
	const [haberBasico, setHaberBasico] = useState();
	const [liquidoPagable, setLiquidoPagable] = useState();
	const [fullName, setFullName] = useState();
	const [totalCategoria, setTotalCategoria] = useState();
	const [totalDescuentos, setTotalDescuentos] = useState();
	const [totalGanado, setTotalGanado] = useState();
	const [gestion, setGestion] = useState();
	const [mes, setMes] = useState();
	const [aporteAfps, setAporteAfps] = useState();
	const [aporteSolidario, setAporteSolidario] = useState();
	const [aporteRciva, setAporteRciva] = useState();
	const [diasDeFalta, setDiasDeFalta] = useState();
	const [minAtraso, setMinAtraso] = useState();
	const [sancionAtrasos, setSancionAtrasos] = useState();
	const [sancionFaltas, setSancionFaltas] = useState();
	const [sancionTotal, setSancionTotal] = useState();
	const [showGenerateButton, setShowGenerateButton] = useState(false);
	const [fronDate, setFromDate] = useState('');
	const [loader, setLoader] = useState(false);
	const [toDate, setToDate] = useState('');
	const theme = useTheme();

	const {
		control,
		getValues,
		handleSubmit,
		formState: { errors },
	} = useForm();

	// useEffect(() => {
	// 	// Verificar si los campos de fecha están llenos
	// 	if (getValues('startDate') && getValues('endDate')) {
	// 		setShowGenerateButton(true); // Mostrar el botón si ambos campos tienen valores
	// 	} else {
	// 		setShowGenerateButton(false); // Ocultar el botón si alguno de los campos está vacío
	// 	}
	// }, [getValues('startDate'), getValues('endDate')]);

	const handleGenerateReport = async () => {
		// const fromDate = getValues('startDate');
		// const toDate = getValues('endDate');
		const dateObject = new Date(fronDate);
		const dateToDate = new Date(toDate);
		// Ajustar el horario si es necesario
		dateObject.setHours(4, 0, 0, 0);
		dateToDate.setHours(4, 0, 0, 0);

		// Convertir a formato UTC
		const formattedDate = dateObject.toISOString();
		const formatted = dateToDate.toISOString();

		const baseURL = 'https://lazy-terms-rule.loca.lt/api/attendance/filtered-report';
		const params = {
			personalId: personalId,
			initialDate: formattedDate,
			endDate: formatted,
		};
		setFromDate('');
		setToDate('');


		const fullURL = `${baseURL}?personalId=${params.personalId}&initialDate=${params.initialDate}&endDate=${params.endDate}`;
		try {
			const response = await axios.get(baseURL, { params });

			if (response.status === 200) {
				// Agrega un identificador único 'id' a cada fila
				const dataWithIds = response.data[0].map((rowData: ReportData, index: number) => ({
					...rowData,
					id: index.toString(),
				}));
				const planillaSueldos = response.data[1];

				setCargo(planillaSueldos.cargo)
				setCategoria(planillaSueldos.categoria)
				setAporteAfps(planillaSueldos.descuentos.aporte_afps)
				setAporteSolidario(planillaSueldos.descuentos.aporte_nacional_solidario)
				setAporteRciva(planillaSueldos.descuentos.rc_iva)
				setGestion(planillaSueldos.detalle.gestion)
				setMes(planillaSueldos.detalle.mes)
				setFechaIngreso(planillaSueldos.fechaIngreso)
				setHaberBasico(planillaSueldos.haber_basico)
				setDiasDeFalta(planillaSueldos.inf_faltas_atrasos.dias_de_falta)
				setMinAtraso(planillaSueldos.inf_faltas_atrasos.min_atrasos)
				setLiquidoPagable(planillaSueldos.liquido_pagable)
				setFullName(planillaSueldos.nombre_apellido)
				setSancionAtrasos(planillaSueldos.otros_descuentos.sancion_atrasos)
				setSancionFaltas(planillaSueldos.otros_descuentos.sancion_faltas)
				setSancionTotal(planillaSueldos.otros_descuentos.total_sanciones)
				setTotalGanado(planillaSueldos.total_ganado)
				setTotalDescuentos(planillaSueldos.total_descuentos)
				setTotalCategoria(planillaSueldos.total_categoria)
				setReportData(dataWithIds);
				setLoader(true);
			}
		} catch (error: any) {
			console.log(error)
			if (error.response && error.response.data && error.response.data.message) {
				return Swal.fire({
					position: 'center',
					icon: 'error',
					title: `${error.response.data.message}`,
					showConfirmButton: false,
					timer: 7000,
				});
			}
		}
	};

	setTimeout(() => {
		setLoader(false)
	}, 2000);

	const handleStartDateChange = (event: any) => {
		const newFromDate = event.target.value;
		setFromDate(newFromDate);
	};

	const handleEndDateChange = (event: any) => {
		const newToDate = event.target.value;
		setToDate(newToDate);
	};

	const handleExportReport = async () => {

		try {
			const response = await axios.get(`${process.env.NEXT_PUBLIC_PERSONAL_DESCARGAS}`, {
				responseType: 'blob',
			});
			const fileURL = window.URL.createObjectURL(new Blob([response.data]));
			const fileLink = document.createElement('a');

			fileLink.href = fileURL;
			fileLink.setAttribute('download', 'planilla_salario.pdf');
			document.body.appendChild(fileLink);

			fileLink.click();
			fileLink.remove();
		} catch (error) {
			console.error('Hubo un error al exportar la planilla de salario:', error);
		}
	};


	return (
		<Box sx={{ p: 4 }}>
			<Typography
				variant="h6"
				gutterBottom
				align="center"
				style={{
					backgroundColor: '#f0f0f0',
					padding: '5px',
					borderRadius: '5px',
					boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
					color: '#333',
				}}
			>
				Generador de Reportes de Asistencia
			</Typography>
			<br />
			<Grid container spacing={3} justifyContent="center">
				<Grid item xs={12} md={6}>
					<Controller
						name="startDate"
						control={control}
						defaultValue=""
						render={({ field }) => (
							<TextField
								{...field}
								fullWidth
								type="date"
								label="Fecha de inicio"
								variant="outlined"
								value={fronDate}
								onChange={handleStartDateChange}
								InputLabelProps={{ shrink: true }}
								error={Boolean(errors.startDate)}
							/>
						)}
					/>
				</Grid>
				<Grid item xs={12} md={6}>
					<Controller
						name="endDate"
						control={control}
						defaultValue=""
						render={({ field }) => (
							<TextField
								{...field}
								fullWidth
								type="date"
								label="Fecha de finalización"
								variant="outlined"
								value={toDate}
								InputLabelProps={{ shrink: true }}
								onChange={handleEndDateChange}
								error={Boolean(errors.endDate)}
							/>
						)}
					/>
				</Grid>

				{fronDate && toDate && (
					<Grid item xs={12}>
						<Box sx={{ display: 'flex', justifyContent: 'center', marginTop: 2 }}>
							<Button
								size="large"
								onClick={handleGenerateReport}
								variant="contained"
								color="primary"
							>
								Generar reporte
							</Button>
						</Box>
					</Grid>
				)}

				{loader && (
					<CircularProgress />
				)}

			</Grid>
			<br />
			{reportData.length > 0 && !loader && (
				<>
					<div style={{ height: 400, width: '100%', marginTop: 0 }}>
						<Typography variant="h6" gutterBottom align="center">
							Reporte de Asistencia
						</Typography>
						<DataGrid
							rows={reportData}
							columns={columns}
							pageSize={5}
							autoHeight
						/>
					</div>

					<Card sx={{
						maxWidth: 500,
						borderRadius: '20px',
						overflow: 'hidden',
						boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
						margin: 'auto',
						position: 'relative',
						marginTop: '-30px',
						mb: 6
					}}>
						<Box sx={{ position: 'relative', height: 80, backgroundColor: '#f0f2f5' }}>

							<Box
								component="img"
								src="/images/banners/card.jpg"
								alt="Salary Report"
								sx={{ width: '100%', height: '100%', objectFit: 'cover' }}
							/>
						</Box>
						<CardContent sx={{ p: 8 }} >
							<div>
								<Typography variant="h6" align="center" sx={{ fontWeight: 'bold', mb: 2 }}>
									Reporte de Salario
								</Typography>
							</div>

							<Grid container spacing={2}>
								<Grid item xs={7}>


									<Typography variant="body2" sx={{ mb: 2 }}>
										<span style={{ fontWeight: 'bold' }}>Nombre: </span>{fullName}
									</Typography>
									<Typography variant="body2" sx={{ mb: 2 }}>
										<span style={{ fontWeight: 'bold' }}>Cargo:</span> {cargo}
									</Typography>
									<Typography variant="body2" sx={{ mb: 2 }}>
										<span style={{ fontWeight: 'bold' }}>Categoría:</span> {categoria}
									</Typography>
									<Typography variant="body2" sx={{ mb: 2 }}>
										<span style={{ fontWeight: 'bold' }}>Fecha de Ingreso:</span> {fechaIngreso}
									</Typography>


								</Grid>
								<Grid item xs={5} sm={4}>

									<Typography variant="body2" sx={{ mb: 2 }}>
										<span style={{ fontWeight: 'bold' }}>Gestión:</span> {gestion}
									</Typography>
									<Typography variant="body2" sx={{ mb: 2 }}>
										<span style={{ fontWeight: 'bold' }}>Mes:</span> {mes}
									</Typography>
									<Typography variant="body2" sx={{ fontWeight: 'bold', mb: 2 }}>
										<span style={{ fontWeight: 'bold' }}>Haber Basico:</span> {haberBasico}Bs
									</Typography>
								</Grid>
							</Grid>
							<Divider sx={{ mt: 4, mb: 2 }} />
							<Grid container spacing={2}>
								<Grid item xs={7}>
									<Typography variant="body1" sx={{ fontWeight: 'bold', mb: 2 }}>
										<AccountBalanceIcon sx={{ verticalAlign: 'bottom', mr: 1 }} />
										Aportes
									</Typography>
									<Typography variant="body2" sx={{ mb: 2 }}>
										<span style={{ fontWeight: 'bold' }}>Aporte afps:</span> {aporteAfps}
									</Typography>
									<Typography variant="body2" sx={{ mb: 2 }}>
										<span style={{ fontWeight: 'bold' }}>Aporte Nacional:</span> {aporteSolidario}
									</Typography>
									<Typography variant="body2" sx={{ mb: 2 }}>
										<span style={{ fontWeight: 'bold' }}>RC IVA:</span> {aporteRciva}
									</Typography>
								</Grid>

								<Grid item xs={5}>
									<Typography variant="body1" sx={{ fontWeight: 'bold', mb: 2 }}>
										<ErrorOutlineIcon sx={{ verticalAlign: 'bottom', mr: 1 }} />
										Faltas y Atrasos
									</Typography>
									<Typography variant="body2" sx={{ mb: 2 }}>
										<span style={{ fontWeight: 'bold' }}>Faltas:</span> {diasDeFalta}
									</Typography>
									<Typography variant="body2" sx={{ mb: 2 }}>
										<span style={{ fontWeight: 'bold' }}>Atrasos:</span> {minAtraso}min
									</Typography>
								</Grid>
							</Grid>
							<Grid container spacing={2}>
								<Grid item xs={7} >
									<Typography variant="body1" sx={{ fontWeight: 'bold', mb: 2 }}>
										<WarningIcon sx={{ verticalAlign: 'bottom', mr: 1 }} />
										Sanciones
									</Typography>
									<Typography variant="body2" sx={{ mb: 2 }}>
										<span style={{ fontWeight: 'bold' }}>Sanción Atrasos:</span> {sancionAtrasos}
									</Typography>
									<Typography variant="body2" sx={{ mb: 2 }}>
										<span style={{ fontWeight: 'bold' }}>Sanción Faltas:</span> {sancionFaltas}
									</Typography>
									<Typography variant="body2" sx={{ mb: 2 }}>
										<span style={{ fontWeight: 'bold' }}>Total Sanciones:</span> {sancionTotal}
									</Typography>
								</Grid>
								<Grid item xs={5}>
									<Typography variant="body1" sx={{ fontWeight: 'bold', mb: 2 }}>
										<AddIcon sx={{ verticalAlign: 'bottom', mr: 1 }} />
										Totales
									</Typography>
									<Typography variant="body2" sx={{ mb: 2 }}>
										<span style={{ fontWeight: 'bold' }}>Total Categoria:</span> {totalCategoria}
									</Typography>
									<Typography variant="body2" sx={{ mb: 2 }}>
										<span style={{ fontWeight: 'bold' }}>Total Descuentos:</span> {totalDescuentos}
									</Typography>
									<Typography variant="body2" sx={{ mb: 2 }}>
										<span style={{ fontWeight: 'bold' }}>Total Ganado:</span> {totalGanado}
									</Typography>
								</Grid>

							</Grid>
							<Divider sx={{ mt: 4, mb: 2 }} />
							<Typography variant="body1" align='center' sx={{ fontWeight: 'bold', mb: 2 }}>
								<MonetizationOnIcon sx={{ verticalAlign: 'bottom', mr: 1 }} />
								Líquido Pagable
							</Typography>
							<Typography variant="h6" align='center'>
								{liquidoPagable}Bs
							</Typography>
							<Divider sx={{ mt: 4, mb: 2 }} />
							<Box sx={{ display: 'flex', justifyContent: 'center' }}>
								<Button
									variant="contained"
									startIcon={<FileDownloadIcon />}
									onClick={handleExportReport}
								>
									Descargar Reporte PDF
								</Button>
							</Box>
						</CardContent>

					</Card>
				</>
			)}
		</Box>
	);
};

export default ReportGenerator;

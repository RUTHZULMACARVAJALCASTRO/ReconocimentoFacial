// ** React Imports
import { ChangeEvent, useEffect, useState } from 'react';

// ** MUI Imports
import Drawer from '@mui/material/Drawer';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Box, { BoxProps } from '@mui/material/Box';
import FormControl from '@mui/material/FormControl';
import TextField from '@mui/material/TextField';
import FormHelperText from '@mui/material/FormHelperText';
import IconButton from '@mui/material/IconButton';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import Grid from '@mui/material/Grid';
import { styled } from '@mui/material/styles';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { useForm, Controller } from 'react-hook-form';
import Icon from 'src/@core/components/icon';
import axios from 'axios';
import Autocomplete from '@mui/material/Autocomplete';

import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch } from 'src/redux/store'
import { addUser, fetchUsersByPage } from 'src/store/apps/user/index';
import { RootState } from 'src/store';

import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'


interface SidebarAddUserType {
	open: boolean;
	toggle: () => void;
	page: number;
	pageSize: number;
}

interface Charge {
	_id: string;
	name: string;
	isActive: boolean;
}
interface Schedule {
	_id: string;
	name: string;
	isActive: boolean;
}
interface Unit {
	_id: string;
	name: string;
}

interface UserData {
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
	_id?: string;
	isActive?: boolean;
}

const UploadButton = styled('label')(({ theme }) => ({
	display: 'flex',
	flexDirection: 'column',
	justifyContent: 'center',
	alignItems: 'center',
	border: '1px solid #ccc',
	borderRadius: theme.spacing(1),
	padding: theme.spacing(2),
	cursor: 'pointer',
	transition: 'background-color 0.3s ease-in-out',
	'&:hover': {
		backgroundColor: '#73737c',
	},
}));

const showErrors = (field: string, valueLen: number, min: number) => {
	if (valueLen === 0) {
		return `El campo ${field} es requerido`;
	} else if (valueLen > 0 && valueLen < min) {
		return `${field} debe tener al menos ${min} caracteres`;
	} else {
		return '';
	}
};

const Header = styled(Box)<BoxProps>(({ theme }) => ({
	display: 'flex',
	alignItems: 'center',
	padding: theme.spacing(3, 4),
	justifyContent: 'space-between',
	backgroundColor: theme.palette.background.default,
}));

const schema = yup.object().shape({
	address: yup
		.string()
		.min(4, obj => showErrors('Dirección', obj.value.length, obj.min))
		.required(),
	nationality: yup
		.string()
		.min(2, obj => showErrors('Nacionalidad', obj.value.length, obj.min))
		.typeError('')
		.required(),
	email: yup
		.string()
		.min(4, obj => showErrors('Email', obj.value.length, obj.min))
		.email()
		.required(),
	ci: yup
		.string()
		.min(4, obj => showErrors('CI', obj.value.length, obj.min))
		.required(),
	phone: yup
		.string()
		.typeError('')
		.min(8, obj => showErrors('Celular', obj.value.length, obj.min))
		.required(),
	name: yup
		.string()
		.min(3, obj => showErrors('Nombre', obj.value.length, obj.min))
		.required(),
	lastName: yup
		.string()
		.min(3, obj => showErrors('Apellido', obj.value.length, obj.min))
		.required(),
	schedule: yup
		.string()
		.min(3, obj => showErrors('Horario', obj.value.length, obj.min))
		.required(),
	unity: yup
		.string()
		.min(3, obj => showErrors('Unidad', obj.value.length, obj.min))
		.required(),
	charge: yup
		.string()
		.min(3, obj => showErrors('Cargo', obj.value.length, obj.min))
		.required(),
});

const defaultValues = {
	name: '',
	lastName: '',
	ci: '',
	email: '',
	phone: '',
	address: '',
	file: '',
	nationality: '',
	unity: '',
	charge: '',
	schedule: '',
};

const SidebarAddUser = (props: SidebarAddUserType) => {
	const { open, toggle, page, pageSize } = props;
	const [previewfile, setPreviewfile] = useState<string | ''>('');
	const [schedules, setSchedules] = useState<Schedule[]>([]);
	const [charges, setCharges] = useState<Charge[]>([]);
	const [units, setUnits] = useState<Unit[]>([]);
	const [message, setMessage] = useState<string | null>(null);
	const [drawerKey, setDrawerKey] = useState('closed');
	const dispatch: AppDispatch = useDispatch();
	const activeCharges = charges.filter(charge => charge.isActive);
	const activeSchedules = schedules.filter(schedule => schedule.isActive);
	//
	// const userStatus = useSelector((state: RootState) => state.users.status);
	const [user, setUser] = useState<UserData>({
		name: '',
		lastName: '',
		ci: '',
		email: '',
		phone: '',
		address: '',
		file: '',
		nationality: '',
		unity: '',
		charge: '',
		schedule: '',
	});

	useEffect(() => {
		fetchCharges();
		fetchSchedules();
		fetchUnits();
	}, []);

	// const usersData = useSelector((state: RootState) => state.user.data);

	//lista de nacionalidades
	const nationalities = [
		{ label: 'Argentina' },
		{ label: 'Brasil' },
		{ label: 'Chile' },
		{ label: 'Bolivia' },
		{ label: 'Peru' },
		{ label: 'Uruguay' },
		{ label: 'Colombia' },
		{ label: 'Ecuador' },
		{ label: 'Estados Unidos' },
		{ label: 'Canada' },
		{ label: 'Mexico' },
	];

	const {
		reset,
		control,
		setValue,
		handleSubmit,
		formState: { errors },
	} = useForm({
		defaultValues,
		mode: 'onChange',
		resolver: yupResolver(schema),
	});

	useEffect(() => {
		const fetchChargesData = async () => {
			try {
				const chargesResponse = await fetchCharges();
				setCharges(chargesResponse);
			} catch (error) {
				console.log(error);
			}
		};
		fetchChargesData();
	}, []);

	useEffect(() => {
		const fetchSchedulesData = async () => {
			try {
				const schedulesResponse = await fetchSchedules();
				setSchedules(schedulesResponse);
			} catch (error) {
				console.log(error);
			}
		};

		fetchSchedulesData();
	}, []);

	useEffect(() => {
		const fetchUnitsData = async () => {
			try {
				const unitsResponse = await fetchUnits();
				setUnits(unitsResponse);
			} catch (error) {
				console.log(error);
			}
		};

		fetchUnitsData();
	}, []);

	const fetchCharges = async () => {
		try {
			const response = await axios.get(`${process.env.NEXT_PUBLIC_PERSONAL_CHARGE}`);
			return response.data;
		} catch (error) {
			console.log(error);
			return [];
		}
	};

	const fetchSchedules = async () => {
		try {
			const response = await axios.get(`${process.env.NEXT_PUBLIC_PERSONAL_SCHEDULE}`);
			return response.data;
		} catch (error) {
			console.log(error);
			return [];
		}
	};

	const fetchUnits = async () => {
		try {
			const response = await axios.get(`${process.env.NEXT_PUBLIC_UNITYS}`);
			return response.data;
		} catch (error) {
			console.log(error);
			return [];
		}
	};

	const handlefileChange = (e: ChangeEvent<HTMLInputElement>) => {
		const reader = new FileReader();

		reader.onload = function () {
			if (reader.readyState === 2) {
				setUser(prevState => ({ ...prevState, file: reader.result as string }));
				setPreviewfile(reader.result as string);
			}
		};

		reader.onerror = (error) => {
			alert('Ocurrió un error al leer el archivo. Por favor, inténtalo de nuevo.');
			console.error("Error reading file:", error);
		};

		if (e.target.files && e.target.files.length > 0) {
			const file = e.target.files[0];

			if (!file.type.startsWith('image/')) {
				alert('Por favor, selecciona una imagen válida.');
				return;
			}

			const MAX_FILE_SIZE = 2 * 1024 * 1024;
			if (file.size > MAX_FILE_SIZE) {
				alert('El tamaño del archivo es demasiado grande. Por favor, selecciona una imagen más pequeña.');
				return;
			}
			reader.readAsDataURL(file);
		}
	};

	const MySwal = withReactContent(Swal)
	const errorFromRedux = useSelector((state: RootState) => state.users.error);
	const [localError, setLocalError] = useState(null);

	const [error, setError] = useState(null);

	const onSubmit = async (userData: UserData) => {
		await dispatch(addUser({ ...userData, file: previewfile }));

		if (errorFromRedux) {
			//setLocalError(errorFromRedux);
		} else {
			dispatch(fetchUsersByPage({ page, pageSize }));
			setPreviewfile('');
			toggle();
			reset(defaultValues);
			MySwal.fire({
				title: <p>Usuario creado con éxito!</p>,
				icon: 'success'
			});
		}
	};


	useEffect(() => {
		if (localError) {
			MySwal.fire({
				title: <p>Error al crear el usuario</p>,
				text: localError,
				icon: 'error'
			});

			// Limpia el error después de mostrarlo
			setLocalError(null);
		}
	}, [localError]);


	const handleClose = () => {
		setPreviewfile('');
		toggle();
		reset(defaultValues);
		open ? 'open' : 'closed'
	}

	useEffect(() => {
		if (!open) {
			const timeout = setTimeout(() => {
				setDrawerKey(open ? 'open' : 'closed');
			}, 500);  // 500ms es la duración de tu animación

			return () => clearTimeout(timeout);
		}
	}, [open]);


	return (
		<>
			<Drawer

				open={open}
				key={open ? 'open' : 'closed'}
				//key={drawerKey}
				anchor='right'
				variant='temporary'
				onClose={handleClose}
				ModalProps={{ keepMounted: true }}
				sx={{ '& .MuiDrawer-paper': { width: { xs: 200, sm: 400, md: 600, xl: 1000 } } }}
			>
				<Header>
					<Typography variant='h6'>Agregar Usuario</Typography>
					<IconButton size='small' onClick={handleClose} sx={{ color: 'text.primary' }}>
						<Icon icon='mdi:close' fontSize={20} />
					</IconButton>
				</Header>

				<Box sx={{ p: 5 }}>
					<form onSubmit={handleSubmit(onSubmit)}>
						<Grid container spacing={3}>
							<Grid item xs={12} >
								<FormControl fullWidth sx={{ mb: 4 }}>

									<UploadButton htmlFor='file'>
										<CloudUploadIcon fontSize='large' />
										<Typography>Seleccionar Imagen</Typography>
										<input
											id='file'
											type='file'
											accept='image/*'
											style={{ display: 'none' }}
											onChange={handlefileChange}
										/>
									</UploadButton>
									{previewfile && (
										<div style={{ textAlign: 'center', marginTop: '16px' }}>
											<img
												src={previewfile}
												alt='Preview'
												style={{ maxWidth: '100%', maxHeight: '300px' }}
											/>
										</div>
									)}

								</FormControl>
							</Grid>
							<Grid item xs={12} md={6}>
								<FormControl fullWidth sx={{ mb: 4 }}>
									<Controller
										name='name'
										control={control}
										rules={{ required: true }}
										render={({ field: { value, onChange } }) => (
											<TextField
												value={value}
												label='Nombre'
												onChange={onChange}
												error={Boolean(errors.name)}
												inputProps={{ autoComplete: "off" }}
											/>
										)}
									/>
									{errors.name && <FormHelperText sx={{ color: 'error.main' }}>{errors.name.message}</FormHelperText>}
								</FormControl>
							</Grid>
							<Grid item xs={12} md={6}>
								<FormControl fullWidth sx={{ mb: 4 }}>
									<Controller
										name='lastName'
										control={control}
										rules={{ required: true }}
										render={({ field: { value, onChange } }) => (
											<TextField
												value={value}
												label='Apellido'
												onChange={onChange}
												error={Boolean(errors.lastName)}
												inputProps={{ autoComplete: "off" }}
											/>
										)}
									/>
									{errors.lastName && <FormHelperText sx={{ color: 'error.main' }}>{errors.lastName.message}</FormHelperText>}
								</FormControl>
							</Grid>
							<Grid item xs={12} md={6}>
								<FormControl fullWidth sx={{ mb: 4 }}>
									<Controller
										name='email'
										control={control}
										rules={{ required: true }}
										render={({ field: { value, onChange } }) => (
											<TextField
												type='email'
												value={value}
												label='Correo Electronico'
												onChange={onChange}
												error={Boolean(errors.email)}
												inputProps={{ autoComplete: "off" }}
											/>
										)}
									/>
									{errors.email && <FormHelperText sx={{ color: 'error.main' }}>{errors.email.message}</FormHelperText>}
								</FormControl>
							</Grid>
							<Grid item xs={12} md={6}>
								<FormControl fullWidth sx={{ mb: 4 }}>
									<Controller
										name='ci'
										control={control}
										rules={{ required: true }}
										render={({ field: { value, onChange } }) => (
											<TextField
												value={value}
												label='CI'
												onChange={onChange}
												error={Boolean(errors.ci)}
												inputProps={{ autoComplete: "off" }}
											/>
										)}
									/>
									{errors.ci && <FormHelperText sx={{ color: 'error.main' }}>{errors.ci.message}</FormHelperText>}
								</FormControl>
							</Grid>
							<Grid item xs={12} md={6}>
								<FormControl fullWidth sx={{ mb: 4 }}>
									<Controller
										name='phone'
										control={control}
										rules={{ required: true }}
										render={({ field: { value, onChange } }) => (
											<TextField
												value={value}
												label='Celular'
												onChange={onChange}
												error={Boolean(errors.phone)}
												inputProps={{ autoComplete: "off" }}
											/>
										)}
									/>
									{errors.phone && <FormHelperText sx={{ color: 'error.main' }}>{errors.phone.message}</FormHelperText>}
								</FormControl>
							</Grid>
							<Grid item xs={12} md={6}>
								<FormControl fullWidth sx={{ mb: 4 }}>
									<Controller
										name='address'
										control={control}
										rules={{ required: true }}
										render={({ field: { value, onChange } }) => (
											<TextField
												value={value}
												label='Direccion'
												onChange={onChange}
												error={Boolean(errors.address)}
												inputProps={{ autoComplete: "off" }}
											/>
										)}
									/>
									{errors.address && <FormHelperText sx={{ color: 'error.main' }}>{errors.address.message}</FormHelperText>}
								</FormControl>
							</Grid>
							<Grid item xs={12} md={6}>
								<FormControl fullWidth sx={{ mb: 4 }}>
									<Controller
										name='nationality'
										control={control}
										rules={{ required: true }}
										render={({ field: { value, onChange } }) => (
											<Autocomplete
												options={nationalities}
												getOptionLabel={(option) => option.label}
												onChange={(_, newValue: { label: string } | null) => {
													onChange(newValue ? newValue.label : '');
												}}
												renderInput={(params) => (
													<TextField
														value={value}
														{...params}
														label='Nacionalidad'
														onChange={onChange}
														error={Boolean(errors.nationality)}
														inputProps={{ ...params.inputProps, autoComplete: "on" }}
													/>
												)}
											/>
										)}
									/>
									{errors.nationality && (
										<FormHelperText sx={{ color: 'error.main' }}>
											{errors.nationality.message}
										</FormHelperText>
									)}
								</FormControl>
							</Grid>
							<Grid item xs={12} md={6}>
								<FormControl fullWidth sx={{ mb: 4 }}>
									<Controller
										name='unity'
										control={control}
										rules={{ required: true }}
										render={({ field: { value, onChange } }) => (
											<Autocomplete
												options={units}
												getOptionLabel={option => option.name}
												isOptionEqualToValue={(option: Unit, value: Unit) => option._id === value._id}
												onChange={(_, newValue: Unit | null) => {
													onChange(newValue ? newValue._id : null);
												}}
												renderInput={(params) => (
													<TextField
														value={value}
														{...params}
														label='Unidad'
														error={Boolean(errors.unity)}
														helperText={errors.unity ? errors.unity.message : ''}
														inputProps={{ ...params.inputProps, autoComplete: 'off' }}
													/>
												)}
											/>
										)}
									/>
								</FormControl>
							</Grid>
							<Grid item xs={12} md={6}>
								<FormControl fullWidth sx={{ mb: 4 }}>
									<Controller
										name='charge'
										control={control}
										rules={{ required: true }}
										render={({ field: { value, onChange } }) => {
											const activeCharges = charges.filter(charge => charge.isActive); // Filtrar los cargos activos
											return (
												<Autocomplete
													options={activeCharges} // Usar solo los cargos activos
													getOptionLabel={option => option.name}
													isOptionEqualToValue={(option: Charge, value: Charge) => option._id === value._id}
													onChange={(_, newValue: Charge | null) => {
														onChange(newValue ? newValue._id : null);
													}}
													renderInput={params => (
														<TextField
															value={value}
															{...params}
															label='Cargos'
															error={Boolean(errors.charge)}
															helperText={errors.charge ? errors.charge.message : ''}
															inputProps={{ ...params.inputProps, autoComplete: 'off' }}
														/>
													)}
												/>
											);
										}}
									/>
								</FormControl>
							</Grid>

							<Grid item xs={12} md={6}>
								<FormControl fullWidth sx={{ mb: 4 }}>
									<Controller
										name='schedule'
										control={control}
										rules={{ required: true }}
										render={({ field: { value, onChange } }) => (
											<Autocomplete
												options={activeSchedules}
												getOptionLabel={option => option.name}
												isOptionEqualToValue={(option: Schedule, value: Schedule) => option._id === value._id}
												onChange={(_, newValue: Schedule | null) => {
													onChange(newValue ? newValue._id : null)
												}}
												renderInput={params => (
													<TextField
														value={value}
														{...params}
														label='Horarios'
														onChange={onChange}
														error={Boolean(errors.schedule)}
														helperText={errors.schedule ? errors.schedule.message : ''}
														inputProps={{ ...params.inputProps, autoComplete: 'off' }}
													/>
												)}
											/>

										)}
									/>
								</FormControl>
							</Grid>
						</Grid>
						<Box sx={{ display: 'flex', alignItems: 'center', columnGap: '20px' }}>
							<Button
								size='large' type='submit' variant='contained' color='primary'
								sx={{ display: 'flex', alignItems: 'center', columnGap: '3px' }}
							>
								<Icon icon='mdi:content-save-edit' fontSize={18} />
								<span>Guardar</span>
							</Button>

							<Button
								size='large' onClick={handleClose} variant='contained' color='primary'
								sx={{ display: 'flex', alignItems: 'center', columnGap: '3px' }}
							>
								<Icon icon='mdi:close-circle' fontSize={20} />
								<span>Cancelar</span>
							</Button>


							{message && (
								<Typography
									variant='body2'
									color='success.main'
									sx={{ ml: 2, fontWeight: 'bold', display: 'flex', alignItems: 'center' }}
								>
									<Icon icon='mdi:check' color='#00a86b' fontSize={16} />
									{message}
								</Typography>
							)}
						</Box>
					</form>
				</Box>
			</Drawer>
		</>
	);
};

export default SidebarAddUser;
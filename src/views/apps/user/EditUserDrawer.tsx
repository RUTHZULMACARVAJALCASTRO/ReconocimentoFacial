// ** React Imports
import React, { ChangeEvent, FormEvent, useEffect, useState } from 'react'

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
import { styled } from '@mui/material/styles';
import * as yup from 'yup'
import { yupResolver } from '@hookform/resolvers/yup'
import { useForm, Controller } from 'react-hook-form'
import Icon from 'src/@core/components/icon'
import axios from 'axios'
import { Autocomplete, Grid, InputLabel, MenuItem, Select, SelectChangeEvent } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from 'src/store'
import { editUser } from 'src/store/apps/user/index'
import { AppDispatch } from 'src/redux/store'
import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'



interface SidebarEditUserType {
    userId: string;
    open: boolean;
    toggle: () => void;
}

interface Charge {
    _id: string;
    name: string;
}

interface Schedule {
    _id: string;
    name: string;
}
interface Unit {
    _id: string;
    name: string;
}

interface UserData {
    _id: string
    name: string
    lastName: string
    ci: string
    email: string
    phone: string
    address: string
    file: string
    nationality: string
    unity: string
    charge: string
    schedule: string
    isActive: boolean
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
    '&:hover': {
        backgroundColor: '#626262',
    },
}));

const showErrors = (field: string, valueLen: number, min: number) => {
    if (valueLen === 0) {
        return `${field} Se requiere campo`
    } else if (valueLen > 0 && valueLen < min) {
        return `${field} al menos debe ser ${min} caracteres`
    } else {
        return ''
    }
}

const Header = styled(Box)<BoxProps>(({ theme }) => ({
    display: 'flex',
    alignItems: 'center',
    padding: theme.spacing(3, 4),
    justifyContent: 'space-between',
    backgroundColor: theme.palette.background.default
}))

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
    _id: '',
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
    isActive: true
}

const SidebarEditUser = ({ userId, open, toggle }: SidebarEditUserType) => {

    console.log(userId);
    const [schedules, setSchedules] = useState<Schedule[]>([]);
    const [units, setUnits] = useState<Unit[]>([]);
    const [previewfile, setPreviewfile] = useState<string | ''>('')
    const [charges, setCharges] = useState<Charge[]>([]);
    const dispatch: AppDispatch = useDispatch();
    const allUsers = useSelector((state: RootState) => state.users.list);
    const selectedUser = allUsers.find(user => user._id === userId);
    const [openSnackbar, setOpenSnackbar] = useState(false);
    const [showImage, setShowImage] = useState(true);


    const { handleSubmit, reset, control, setValue, errors }: any = useForm<UserData>({
        // resolver: yupResolver(schema), // Asegúrate de que estés utilizando el resolver de yup
        defaultValues: selectedUser ? selectedUser : defaultValues
    });

    const [ciError, setCiError] = useState('');
    const [phoneError, setPhoneError] = useState('');
    const [emailError, setEmailError] = useState('');
    const MySwal = withReactContent(Swal)


    useEffect(() => {
        console.log("userId", userId);
        if (selectedUser) {

            setValue('name', selectedUser.name);
            setValue('lastName', selectedUser.lastName);
            setValue('email', selectedUser.email);
            setValue('ci', selectedUser.ci);
            setValue('phone', selectedUser.phone);
            setValue('address', selectedUser.address);
            setValue('file', selectedUser.file);
            setValue('nationality', selectedUser.nationality);
            setValue('unity', selectedUser.unity);
            setValue('charge', selectedUser.charge);
            setValue('schedule', selectedUser.schedule);
        }

    }, [userId, selectedUser, setValue]);


    const [image, setImage] = useState<File | ''>('')

    useEffect(() => {
        fetchCharges();
        fetchSchedules();
        fetchUnits();
    }, []);

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

    useEffect(() => {
        const fetchChargesData = async () => {
            try {
                const chargesResponse = await fetchCharges();
                setCharges(chargesResponse); // La respuesta ya contiene la propiedad "name"
            } catch (error) {
                console.log(error);
            }
        };
        fetchChargesData();
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
            return response.data; // Asegúrate de que response.data tenga la estructura correcta
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

    const convertBase64ToImageUrl = (base64String: string) => {
        // console.log('AAAA', base64String )
        return `data:image/png;base64,${base64String}`
    }

    const handlefileChange = (e: ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
            const file = e.target.files[0];
            const reader = new FileReader();

            reader.onload = function () {
                if (reader.readyState === 2) {
                    setPreviewfile(reader.result as string);
                }
            };

            reader.readAsDataURL(file);
        }
    };

    const onSubmit = async (data: UserData) => {
        try {
            await dispatch(editUser({ ...data, _id: userId })).unwrap();
            setShowImage(true);
            setPreviewfile('');
            toggle();
            reset()
            MySwal.fire({
                title: <p>Personal editado con exito!</p>,
                icon: 'success'
            });

        } catch {

        }
    };

    const handleClose = () => {
        toggle()
    }

    return (
        <>
            <Drawer
                style={{ border: '2px solid white', margin: 'theme.spacing(2)' }}
                open={open}
                onClose={handleClose}
                anchor='right'
                variant='temporary'
                ModalProps={{ keepMounted: true }}
                sx={{ '& .MuiDrawer-paper': { width: { xs: 200, sm: 400, md: 600, xl: 1000 } } }}
            >
                <Header>
                    <Typography variant='h6'>Editar Usuario</Typography>
                    <IconButton size='small' onClick={handleClose} sx={{ color: 'text.primary' }}>
                        <Icon icon='mdi:close' fontSize={20} />
                    </IconButton>
                </Header>
                <Box sx={{ p: 5 }}>
                    <form onSubmit={handleSubmit(onSubmit)} >
                        <Grid container spacing={3}>
                            <FormControl fullWidth sx={{ mb: 4 }}>
                                <Controller
                                    name='file'
                                    control={control}
                                    render={({ field }) => (
                                        <div style={{ textAlign: 'center' }}>
                                            <img
                                                src={previewfile ? convertBase64ToImageUrl(previewfile) : selectedUser?.file ? convertBase64ToImageUrl(selectedUser.file) : ''}
                                                alt='Imagen'
                                                width={150}
                                                height={150}
                                                style={{ borderRadius: '50%', objectFit: 'cover' }}
                                            />
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
                                        </div>
                                    )}
                                />
                            </FormControl>

                            <Grid item xs={12} md={6}>
                                <FormControl fullWidth sx={{ mb: 4 }}>
                                    <Controller
                                        name='name'
                                        control={control}
                                        rules={{ required: true, minLength: 2 }} // Puedes ajustar estas reglas
                                        render={({ field }) => (
                                            <TextField
                                                {...field}
                                                label='Nombre'
                                                autoComplete='off'
                                            />
                                        )}
                                    />
                                </FormControl>
                            </Grid>

                            <Grid item xs={12} md={6}>
                                <FormControl fullWidth sx={{ mb: 4 }}>
                                    <Controller
                                        name='lastName'
                                        control={control}
                                        rules={{ required: true, minLength: 2 }} // Puedes ajustar estas reglas
                                        render={({ field }) => (
                                            <TextField
                                                {...field}
                                                label='Apellido'
                                                autoComplete='off'
                                            />
                                        )}
                                    />
                                </FormControl>
                            </Grid>

                            <Grid item xs={12} md={6}>
                                <FormControl fullWidth sx={{ mb: 4 }}>
                                    <Controller
                                        name='email'
                                        control={control}
                                        rules={{ required: true, minLength: 2 }}
                                        render={({ field }) => (
                                            <>
                                                <TextField
                                                    {...field}
                                                    label='Email'
                                                    autoComplete='off'
                                                />
                                            </>
                                        )}
                                    />
                                </FormControl>
                            </Grid>

                            <Grid item xs={12} md={6}>
                                <FormControl fullWidth sx={{ mb: 4 }}>
                                    <Controller
                                        name='ci'
                                        control={control}
                                        rules={{ required: true, minLength: 2 }}
                                        render={({ field }) => (
                                            <>
                                                <TextField
                                                    {...field}
                                                    label='CI'
                                                    autoComplete='off'

                                                />
                                            </>
                                        )}
                                    />
                                </FormControl>
                            </Grid>


                            <Grid item xs={12} md={6}>
                                <FormControl fullWidth sx={{ mb: 4 }}>
                                    <Controller
                                        name='phone'
                                        control={control}
                                        rules={{
                                            required: 'Se requiere el número de teléfono',
                                            minLength: { value: 2, message: 'El número de teléfono debe tener al menos 2 caracteres' },
                                        }}
                                        render={({ field }) => (
                                            <TextField
                                                {...field}
                                                label='Teléfono'
                                                autoComplete='off'

                                            />
                                        )}
                                    />
                                </FormControl>
                            </Grid>


                            <Grid item xs={12} md={6}>
                                <FormControl fullWidth sx={{ mb: 4 }}>
                                    <Controller
                                        name='address'
                                        control={control}
                                        rules={{ required: true, minLength: 2 }} // Puedes ajustar estas reglas
                                        render={({ field }) => (
                                            <TextField
                                                {...field}
                                                label='Direccion'
                                                autoComplete='off'
                                            />
                                        )}
                                    />
                                    {/* {errors.phone && <FormHelperText sx={{ color: 'error.main' }}>{errors.phone.message}</FormHelperText>} */}
                                </FormControl>
                            </Grid>

                            <Grid item xs={12} md={6}>
                                <FormControl fullWidth sx={{ mb: 4 }}>
                                    <Typography variant="body2" gutterBottom>
                                        Nacionalidad
                                    </Typography>
                                    <Controller
                                        name="nationality"
                                        control={control}
                                        defaultValue=""
                                        render={({ field, fieldState }) => (
                                            <>
                                                <Select
                                                    labelId="nationality-label"
                                                    id="nationality"
                                                    {...field}
                                                    autoComplete="off"
                                                >
                                                    {nationalities.map((nationality) => (
                                                        <MenuItem key={nationality.label} value={nationality.label}>
                                                            {nationality.label}
                                                        </MenuItem>
                                                    ))}
                                                </Select>
                                                {fieldState.invalid && (
                                                    <FormHelperText sx={{ color: 'error.main' }}>
                                                        {fieldState.error?.message}
                                                    </FormHelperText>
                                                )}
                                            </>
                                        )}
                                    />
                                </FormControl>
                            </Grid>

                            <Grid item xs={12} sm={6}>
                                <FormControl fullWidth sx={{ mb: 4 }}>
                                    <Typography variant="body2" gutterBottom>
                                        Unidad
                                    </Typography>
                                    <Controller
                                        name="unity"
                                        control={control}
                                        defaultValue=""
                                        render={({ field }) => (
                                            <Autocomplete
                                                options={units.map(unit => unit.name)}
                                                getOptionLabel={(option) => option}
                                                value={field.value}
                                                onChange={(_, newValue) => {
                                                    field.onChange(newValue || "");
                                                }}
                                                renderInput={(params) => <TextField {...params} label="" />}
                                            />
                                        )}
                                    />

                                </FormControl>
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <FormControl fullWidth sx={{ mb: 4 }}>
                                    <Typography variant="body2" gutterBottom>
                                        Cargo
                                    </Typography>
                                    <Controller
                                        name="charge"
                                        control={control}
                                        defaultValue=""
                                        render={({ field }) => (
                                            <Autocomplete
                                                options={charges}
                                                getOptionLabel={(option) => option.name}
                                                value={charges.find((option) => option._id === field.value) || null}
                                                onChange={(_, newValue) => {
                                                    field.onChange(newValue?._id || "");
                                                }}
                                                renderInput={(params) => <TextField {...params} label="" />}
                                            />
                                        )}
                                    />
                                </FormControl>
                            </Grid>

                            <Grid item xs={8} sm={6} lg={6}>
                                <FormControl fullWidth sx={{ mb: 4 }}>
                                    <Typography variant="body2" gutterBottom>
                                        Horarios
                                    </Typography>
                                    <Controller
                                        name="schedule"
                                        control={control}
                                        defaultValue=""
                                        render={({ field }) => (
                                            <Autocomplete
                                                options={schedules}  // Asume que 'schedules' es el array de horarios disponibles
                                                getOptionLabel={(option) => option.name}
                                                value={schedules.find((option) => option._id === field.value) || null}
                                                onChange={(_, newValue) => {
                                                    field.onChange(newValue?._id || "");
                                                }}
                                                renderInput={(params) => <TextField {...params} label="" />}
                                            />
                                        )}
                                    />
                                </FormControl>
                            </Grid>
                        </Grid>
                        <br />

                        <Box sx={{ display: 'flex', alignItems: 'center', columnGap: '20px' }}>
                            <Button
                                size='large' type='submit'
                                variant='contained' sx={{ mr: 6 }}
                            >
                                Aceptar
                            </Button>
                            <Button size='large' variant='outlined' color='secondary' onClick={handleClose}>
                                Cancelar
                            </Button>
                        </Box>
                    </form>
                </Box>
            </Drawer>
        </>
    )
}

export default SidebarEditUser
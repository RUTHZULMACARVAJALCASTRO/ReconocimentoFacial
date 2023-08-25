// ** React Imports
import { ChangeEvent, useEffect, useState, Children } from 'react';

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
import * as yup from 'yup'
import { yupResolver } from '@hookform/resolvers/yup'
import { useForm, Controller } from 'react-hook-form'
import Icon from 'src/@core/components/icon'
import axios from 'axios'
import Autocomplete from '@mui/material/Autocomplete';
import SidebarAddSpecialSchedule from '../horariosEspeciales/AddSpecialSchedule';


interface SidebarAddUserType {
  open: boolean
  toggle: () => void
}
interface Charge {
  id: string;
  name: string;
}
interface Schedule {
  id: string;
  name: string;
}
interface Unit {
  _id: string;
  name: string;
}

interface UserData {
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
}
interface AddUserDrawerProps {
  open: boolean;
  toggle: () => void;
  onOpenSpecialSchedule: () => void;  // Agrega esta prop para abrir SidebarAddSpecialSchedule
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
    return `El campo ${field} es requerido`
  } else if (valueLen > 0 && valueLen < min) {
    return `${field} debe tener al menos ${min} caracteres`
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
    .required()
})

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
  schedule: ''
}

  const SidebarAddUser = (props: SidebarAddUserType) => {
  const { open, toggle } = props
  const [addSpecialScheduleOpen, setAddSpecialScheduleOpen] = useState<boolean>(false)
  const [schedules, setSchedules] = useState<Schedule[]>([]);
  const [previewfile, setPreviewfile]= useState<string | null>(null)
  const [charges, setCharges] = useState<Charge[]>([]);
  const [units, setUnits] = useState<Unit[]>([]);
  const toggleAddSpecialSchedule = () => setAddSpecialScheduleOpen(!addSpecialScheduleOpen)
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
    schedule: ''
  })
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

  const {
    reset,
    control,
    setValue,
    handleSubmit,
    formState: { errors }
  } = useForm({
    defaultValues,
    mode: 'onChange',
    resolver: yupResolver(schema)
  })
  
  const handlefileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const reader = new FileReader();
    reader.onload = function () {
      if (reader.readyState === 2) {
        const base64Data = reader.result as string;
        setUser({ ...user, file: base64Data });
        setPreviewfile(base64Data);
      }
    };

    if (e.target.files && e.target.files.length > 0) {
      reader.readAsDataURL(e.target.files[0]);
    }
  };
  
    

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
  


  const handleSave = async (data: UserData) => {
    try {
      const transformedData: { [key: string]: string | number } = {
        name: data.name,
        lastName: data.lastName,
        ci: data.ci,
        email: data.email,
        phone: data.phone,
        address: data.address,
        nationality: data.nationality,
        unity: data.unity,
        charge: data.charge,
        schedule: data.schedule,
        file: data.file,
      };
  await axios.post(`${process.env.NEXT_PUBLIC_PERSONAL}`,{
    name: data.name,
    lastName: data.lastName,
    ci: data.ci,
    email: data.email,
    phone: data.phone,
    address: data.address,
    nationality: data.nationality,
    unity: data.unity,
    charge: data.charge,
    schedule: data.schedule, 
    file:user.file,
  });
    toggle();
    reset();
    window.location.reload()
  } catch (error) {
    console.log(error);
  }
};

  const handleClose = () => {
    toggle()
    reset()
  }
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


  const fetchCharges = async () => {
    try {
      const response = await axios.get(`${process.env.NEXT_PUBLIC_PERSONAL_CHARGE}`);
      return response.data; // Asegúrate de que response.data tenga la estructura correcta
    } catch (error) {
      console.log(error);
      return [];
    }
  };

  fetchCharges()

  const fetchSchedules = async () => {
    try {
      const response = await axios.get(`${process.env.NEXT_PUBLIC_PERSONAL_SCHEDULE}`);
      return response.data; // Asegúrate de que response.data tenga la estructura correcta
    } catch (error) {
      console.log(error);
      return [];
    }
  };

  fetchSchedules()

  const fetchUnits = async () => {
    try {
      const response = await axios.get(`${process.env.NEXT_PUBLIC_UNITYS}`);
      return response.data;
    } catch (error) {
      console.log(error);
      return [];
    }
  };

  fetchUnits()
  

    function handleOpenAddSpecialSchedule(): void {
     
    }

  return (
    <>
    <Button onClick={handleClose}
     variant="contained"
     color="primary"
     sx={{
       borderRadius: '8px', 
       marginBottom: '15px',
       fontSize: '12px', 
       fontWeight: 'bold',
       padding: '10px 20px',
       boxShadow: '0 3px 5px rgba(0, 0, 0, 0.2)', 
       '&:hover': {
         backgroundColor: '#1565c0', 
        
       },
     }}

    >
      Agregar Usuario
    </Button>
    
    <Drawer
      open={open}
      anchor='right'
      variant='temporary'
      onClose={handleClose}
      ModalProps={{ keepMounted: true }}
      sx={{ '& .MuiDrawer-paper': { width: { xs: 300, sm: 500, md: 800, xl: 1200} } }}
    >
      <Header>
        <Typography variant='h6'>Agregar Usuario</Typography>
        <IconButton size='small' onClick={handleClose} sx={{ color: 'text.primary' }}>
          <Icon icon='mdi:close' fontSize={20} />
        </IconButton>
        
      </Header>
      
      
      <Box sx={{ p: 5 }}>
      <form onSubmit={handleSubmit(handleSave)}>
      <FormControl fullWidth sx={{ mb: 4 }}>
            <Grid item xs={12} md={12}>
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
            </Grid>
          </FormControl>
          <FormControl fullWidth sx={{ mb: 4}}>
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
                  inputProps={{ autoComplete: "off"}}
                />
              )}
            />
            {errors.name && <FormHelperText sx={{ color: 'error.main' }}>{errors.name.message}</FormHelperText>}
          </FormControl>
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
                  inputProps={{ autoComplete: "off"}}
                />
              )}
            />
            {errors.lastName && <FormHelperText sx={{ color: 'error.main' }}>{errors.lastName.message}</FormHelperText>}
          </FormControl>
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
                  inputProps={{ autoComplete: "off"}}
                />
              )}
            />
            {errors.email && <FormHelperText sx={{ color: 'error.main' }}>{errors.email.message}</FormHelperText>}
          </FormControl>
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
                  inputProps={{ autoComplete: "off"}}
                />
              )}
            />
            {errors.ci && <FormHelperText sx={{ color: 'error.main' }}>{errors.ci.message}</FormHelperText>}
          </FormControl>
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
                  inputProps={{ autoComplete: "off"}}
                />
              )}
            />
            {errors.phone && <FormHelperText sx={{ color: 'error.main' }}>{errors.phone.message}</FormHelperText>}
          </FormControl>
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
                  inputProps={{ autoComplete: "off"}}
                />
              )}
            />
            {errors.address && <FormHelperText sx={{ color: 'error.main' }}>{errors.address.message}</FormHelperText>}
          </FormControl>
          <FormControl fullWidth sx={{ mb: 4 }}>
            <Controller
              name='nationality'
              control={control}
              rules={{ required: true }}
              render={({ field: { value, onChange } }) => (
                <Autocomplete
                  options={nationalities} // Usa la lista de opciones de nacionalidades
                  getOptionLabel={(option) => option.label}
                  onChange={(event, newValue) => {
                    onChange(newValue ? newValue.label : ''); // Actualiza el valor del campo de nacionalidad en el controlador
                  }}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label='Nacionalidad'
                      onChange={onChange}
                      error={Boolean(errors.nationality)}
                      inputProps={{ ...params.inputProps, autoComplete: "on"}}
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
          <FormControl fullWidth sx={{ mb: 4 }}>
            <Controller
              name='unity'
              control={control}
              rules={{ required: true }}
              render={({ field, fieldState, formState }) => (
                <Autocomplete
                  options={units}
                  getOptionLabel={(option) => option.name}
                  onChange={(event, newValue) => {
                    field.onChange(newValue ? newValue.name : '');
                  }}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label='Unidad'
                      onChange={field.onChange}
                      error={Boolean(formState.errors.unity)}
                      inputProps={{ ...params.inputProps, autoComplete: 'off' }}
                    />
                  )}
                />
              )}
            />
            {errors.unity && (
              <FormHelperText sx={{ color: 'error.main' }}>
                {errors.unity.message}
              </FormHelperText>
            )}
          </FormControl>

          
          <FormControl fullWidth sx={{ mb: 4 }}>
            <Controller
              name='charge'
              control={control}
              rules={{ required: true }}
              render={({ field, fieldState, formState }) => (
                <Autocomplete
                  options={charges} // Usar la lista de cargos obtenida del estado local
                  getOptionLabel={(option) => option.name}
                  onChange={(event, newValue) => {
                    field.onChange(newValue ? newValue.name : ''); // Actualizar el valor del campo de cargos en el controlador
                  }}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label='Cargos'
                      onChange={field.onChange}
                      error={Boolean(formState.errors.charge)}
                      inputProps={{ ...params.inputProps, autoComplete: 'on' }}
                    />
                  )}
                />
              )}
            />
            {errors.charge && (
              <FormHelperText sx={{ color: 'error.main' }}>
                {errors.charge.message}
              </FormHelperText>
            )}
          </FormControl>
          <FormControl fullWidth sx={{ mb: 4 }}>
            <Controller
              name='schedule'
              control={control}
              rules={{ required: true }}
              render={({ field: { value, onChange } }) => (
                <Autocomplete
                  options={schedules}
                  getOptionLabel={(option) => option.name}
                  onChange={(event, newValue) => {
                    onChange(newValue ? newValue.name : '');
                  }}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label='Horarios'
                      onChange={onChange}
                      error={Boolean(errors.schedule)}
                      inputProps={{ ...params.inputProps, autoComplete: 'off' }}
                    />
                  )}
                />
              )}
            />
            {errors.schedule && (
              <FormHelperText sx={{ color: 'error.main' }}>
                {errors.schedule.message}
              </FormHelperText>
            )}
          </FormControl>
           
        {/* <SidebarAddSpecialSchedule open={addSpecialScheduleOpen} toggle={toggleAddSpecialSchedule}  /> */}
          
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Button 
              size='large' type='submit' variant='contained' sx={{ mr: 6 }}
            > Aceptar </Button>
            <Button size='large' variant='outlined' color='secondary' onClick={handleClose}
            > Cancelar </Button>
          </Box>
        </form>
      </Box>
    </Drawer>
    </>
  )
}

export default SidebarAddUser
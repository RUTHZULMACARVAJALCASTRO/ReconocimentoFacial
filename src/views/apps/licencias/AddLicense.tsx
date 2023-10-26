import { ChangeEvent, useEffect, useState, Children } from 'react';
import Drawer from '@mui/material/Drawer'
import Select from '@mui/material/Select'
import Button from '@mui/material/Button'
import MenuItem from '@mui/material/MenuItem'
import { styled } from '@mui/material/styles'
import TextField from '@mui/material/TextField'
import IconButton from '@mui/material/IconButton'
import InputLabel from '@mui/material/InputLabel'
import Typography from '@mui/material/Typography'
import Box, { BoxProps } from '@mui/material/Box'
import FormControl from '@mui/material/FormControl'
import { useForm, Controller } from 'react-hook-form'
import Icon from 'src/@core/components/icon'
import { useDispatch } from 'react-redux'
import { AppDispatch } from 'src/redux/store';
import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'
import { addLicense } from 'src/store/apps/license/index';
import { Grid, InputAdornment, List, ListItem, ListItemText, ListItemIcon } from '@mui/material';
import axios from 'axios';
import SearchIcon from '@mui/icons-material/Search';
import CheckIcon from '@mui/icons-material/Check';

interface SidebarAddLicenseType {
  open: boolean
  toggle: () => void
}

interface licenseData {
  personal: string;
  licenseType: string;
  description: string;
  startDate: Date;
  endDate: Date;
}

interface User {
  _id: string;
  name: string;
  lastName: string;
}

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



const defaultValues = {
  personal: '',
  licenseType: '',
  description: '',
  startDate: '',
  endDate: '',
  isActive: true
}

const SidebarAddLicense = ({ open, toggle }: SidebarAddLicenseType) => {
  const dispatch: AppDispatch = useDispatch();
  const [message, setMessage] = useState<string | null>(null);
  const [licenseType, setLicenseType] = useState('');
  const [description, setDescription] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [searchBy, setSearchBy] = useState("fullName");
  const [searchValue, setSearchValue] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
  const [selectedUsers, setSelectedUsers] = useState<User[]>([]);

  const MySwal = withReactContent(Swal)
  const {
    reset,
    control,
    setValue,
    handleSubmit,
    formState: { errors }
  } = useForm({
    defaultValues,
    mode: 'onChange',

  })

  // const handleSave = async (licenseData: licenseData) => {
  //   dispatch(addLicense(licenseData));
  //   toggle();
  //   reset(defaultValues);
  //   MySwal.fire({
  //     title: <p>Licencia creado con exito!</p>,
  //     icon: 'success'
  //   });
  // };

  const handleSave = async (data: {
    personal: string;
    licenseType: string;
    description: string;
    startDate: string;
    endDate: string;
    isActive: boolean;
  }) => {
    // Convertir las fechas string a Date
    const licenseData: licenseData = {
      ...data,
      startDate: new Date(data.startDate),
      endDate: new Date(data.endDate)
    };
    dispatch(addLicense(licenseData));
    toggle();
    reset(defaultValues);
    MySwal.fire({
      title: <p>Licencia creado con exito!</p>,
      icon: 'success'
    });
  };

  const handleClose = () => {
    toggle()
    reset()
  }

  function getFullNameFromId(id: string): string {
    if (!id) {
      return ''; // Return an empty string if no user is selected
    }

    const user = selectedUsers.find((user) => user._id === id);
    return user ? `${user.name} ${user.lastName}` : 'Desconocido';
  }

  const handleUserSelection = (userId: string) => {
    setSelectedUserId(userId);
    const user = filteredUsers.find((user) => user._id === userId);
    if (user) {
      setSelectedUsers([user]); // Reemplaza el array de usuarios seleccionados con el usuario actual
    }
    setFilteredUsers([]); // Limpiar la lista después de seleccionar
  };

  // Usar Redux
  const handleSearch = async () => {
    setIsSearching(true);
    try {
      const url = `${process.env.NEXT_PUBLIC_PERSONAL_LICENSE}filtered?${searchBy}=${searchValue}`;
      const response = await axios.get(url);
      setFilteredUsers(response.data.data);
    } catch (error) {
      console.error("Error buscando usuarios:", error);
    }
    setIsSearching(false);
  };

  return (
    <>

      <Drawer
        open={open}
        // key={open ? 'open' : 'closed'}
        anchor='right'
        variant='temporary'
        onClose={handleClose}
        ModalProps={{ keepMounted: true }}
        sx={{ '& .MuiDrawer-paper': { width: { xs: 200, sm: 400, md: 600, xl: 1000 } } }}
      >
        <Header>
          <Typography variant='h6'>Asignar Licencia</Typography>
          <IconButton size='small' onClick={handleClose} sx={{ color: 'text.primary' }}>
            <Icon icon='mdi:close' fontSize={20} />
          </IconButton>
        </Header>
        <Box sx={{ p: 5 }}>
          <form onSubmit={handleSubmit(handleSave)}>
            <Grid container spacing={3}>
              <Grid item xs={4}>
                <FormControl variant="outlined" fullWidth>
                  <InputLabel>Buscar por</InputLabel>
                  <Select
                    value={searchBy}
                    onChange={(e) => setSearchBy(e.target.value)}
                    label="Buscar por"
                  >
                    <MenuItem value="fullName">Nombre Completo</MenuItem>
                    <MenuItem value="name">Nombre</MenuItem>
                    <MenuItem value="lastName">Apellido</MenuItem>
                    <MenuItem value="ci">CI</MenuItem>
                    <MenuItem value="phone">Teléfono</MenuItem>
                  </Select>
                </FormControl>
              </Grid>

              <Grid item xs={8}>
                <TextField
                  fullWidth
                  variant="outlined"
                  placeholder="Buscar usuario..."
                  value={searchValue}
                  onChange={(e) => setSearchValue(e.target.value)}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <Button onClick={handleSearch} color="primary">
                          <SearchIcon />
                          Buscar
                        </Button>
                      </InputAdornment>
                    ),
                  }}
                />
              </Grid>

              {isSearching && <p>Buscando...</p>}
              {!isSearching && filteredUsers.length > 0 && (
                <Box>
                  <List dense>
                    {filteredUsers.map((user: User) => (
                      <ListItem button key={user._id} onClick={() => handleUserSelection(user._id)}>
                        <ListItemText primary={`${user.name} ${user.lastName}`} />
                        {selectedUserId === user._id && <ListItemIcon><CheckIcon color="primary" /></ListItemIcon>}
                      </ListItem>
                    ))}
                  </List>
                </Box>
              )}
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  margin="normal"
                  variant="outlined"
                  label="Usuario Seleccionado"
                  value={selectedUserId ? getFullNameFromId(selectedUserId) : ""}
                  InputProps={{
                    readOnly: true,
                  }}
                />
              </Grid>
            </Grid>
            <Grid container spacing={3}>
              <Grid item xs={6}>
                <FormControl fullWidth variant="outlined" margin="normal">
                  <InputLabel>Tipo de Licencia</InputLabel>
                  <Select
                    value={licenseType}
                    onChange={(event: any) => setLicenseType(event.target.value)}
                    label="License Type"
                  >
                    <MenuItem value={'Medica'}>Medica</MenuItem>
                    <MenuItem value={'Maternidad'}>Maternidad</MenuItem>
                    <MenuItem value={'Paternidad'}>Paternidad</MenuItem>
                    <MenuItem value={'Duelo'}>Duelo</MenuItem>
                    <MenuItem value={'Vacaciones'}>Vacaciones</MenuItem>
                    <MenuItem value={'Personal'}>Personal</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={6}>
                <TextField
                  fullWidth
                  margin="normal"
                  variant="outlined"
                  label="Descripción"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  fullWidth
                  margin="normal"
                  variant="outlined"
                  label="Fecha de Inicio"
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  InputLabelProps={{ shrink: true }}
                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  fullWidth
                  margin="normal"
                  variant="outlined"
                  label="Fecha de Finalización"
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  InputLabelProps={{ shrink: true }}
                />
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
  )
}

export default SidebarAddLicense
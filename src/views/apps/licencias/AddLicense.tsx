import {
  ChangeEvent,
  useState,
  useEffect,
} from 'react';
import {
  Drawer,
  Select,
  Button,
  MenuItem,
  styled,
  TextField,
  IconButton,
  InputLabel,
  Typography,
  Box,
  FormControl,
  Grid,
  InputAdornment,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  FormHelperText,
} from '@mui/material';
import { useForm, Controller } from 'react-hook-form';
import Icon from 'src/@core/components/icon';
import { useDispatch } from 'react-redux';
import { AppDispatch } from 'src/redux/store';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';
import { addLicense } from 'src/store/apps/license/index';
import axios from 'axios';
import SearchIcon from '@mui/icons-material/Search';
import CheckIcon from '@mui/icons-material/Check';

interface SidebarAddLicenseType {
  open: boolean;
  toggle: () => void;
}

interface LicenseData {
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

const Header = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  padding: theme.spacing(3, 4),
  justifyContent: 'space-between',
  backgroundColor: theme.palette.background.default,
}));

const defaultValues = {
  personal: '',
  licenseType: '',
  description: '',
  startDate: new Date().toISOString().split('T')[0],
  endDate: new Date().toISOString().split('T')[0],
};

const SidebarAddLicense = ({ open, toggle }: SidebarAddLicenseType) => {
  const dispatch: AppDispatch = useDispatch();
  const [searchBy, setSearchBy] = useState("fullName");
  const [searchValue, setSearchValue] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
  const [selectedUsers, setSelectedUsers] = useState<User[]>([]);
  const [message, setMessage] = useState<string | null>(null);
  const MySwal = withReactContent(Swal);
  const {
    reset,
    control,
    setValue,
    handleSubmit,
    formState: { errors },
  } = useForm<LicenseData>({
    // defaultValues,
    mode: 'onChange',
  });

  const handleSave = async (data: LicenseData) => {
    const adjustedData = {
      ...data,
      personal: selectedUserId || '',
      startDate: new Date(data.startDate),
      endDate: new Date(data.endDate),
    };

    dispatch(addLicense(adjustedData));
    toggle();
    reset();
    // defaultValues
    MySwal.fire({
      title: <p>Licencia creado con exito!</p>,
      icon: 'success',
    });
  };


  const handleClose = () => {
    toggle();
    reset();
  };

  const getFullNameFromId = (id: string): string => {
    const user = selectedUsers.find((user) => user._id === id);
    return user ? `${user.name} ${user.lastName}` : 'Desconocido';
  };

  const handleUserSelection = (userId: string) => {
    setSelectedUserId(userId);
    const user = filteredUsers.find((user) => user._id === userId);
    if (user) {
      setSelectedUsers([user]);
    }
    setFilteredUsers([]);
  };

  const handleSearch = async () => {
    setIsSearching(true);
    try {
      const url = `${process.env.NEXT_PUBLIC_PERSONAL}filtered?${searchBy}=${searchValue}`;
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
        key={open ? 'open' : 'closed'}
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
              <Grid item xs={12}>
                <Controller
                  name="licenseType"
                  control={control}
                  render={({ field }) => (
                    <FormControl fullWidth variant="outlined" error={Boolean(errors.licenseType)}>
                      <InputLabel>Tipo de Licencia</InputLabel>
                      <Select {...field} label="Tipo de Licencia">
                        <MenuItem value={'Medica'}>Medica</MenuItem>
                        <MenuItem value={'Maternidad'}>Maternidad</MenuItem>
                        <MenuItem value={'Paternidad'}>Paternidad</MenuItem>
                        <MenuItem value={'Duelo'}>Duelo</MenuItem>
                        <MenuItem value={'Vacaciones'}>Vacaciones</MenuItem>
                        <MenuItem value={'Personal'}>Personal</MenuItem>
                      </Select>
                      <FormHelperText>{errors.licenseType?.message}</FormHelperText>
                    </FormControl>
                  )}
                />
              </Grid>
              <Grid item xs={12}>
                <Controller
                  name="description"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      fullWidth
                      multiline
                      rows={3}
                      label="Descripción"
                      variant="outlined"
                      error={Boolean(errors.description)}
                      helperText={errors.description?.message}
                    />
                  )}
                />
              </Grid>

              <Grid item xs={6}>
                <Controller
                  name="startDate"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      fullWidth
                      type="date"
                      label="Fecha de inicio"
                      variant="outlined"
                      InputLabelProps={{ shrink: true }}
                      error={Boolean(errors.startDate)}
                      helperText={errors.startDate?.message}
                    />
                  )}
                />
              </Grid>

              <Grid item xs={6}>
                <Controller
                  name="endDate"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      fullWidth
                      type="date"
                      label="Fecha de finalización"
                      variant="outlined"
                      InputLabelProps={{ shrink: true }}
                      error={Boolean(errors.endDate)}
                      helperText={errors.endDate?.message}
                    />
                  )}
                />
              </Grid>
              <Grid item xs={12}>
                <Box sx={{ display: 'flex', alignItems: 'center', columnGap: '20px' }}>
                  <Button
                    size='large'
                    type='submit'
                    variant='contained'
                    color='primary'
                    sx={{ display: 'flex', alignItems: 'center', columnGap: '3px' }}
                  >
                    <Icon icon='mdi:content-save-edit' fontSize={18} />
                    <span>Guardar</span>
                  </Button>

                  <Button
                    size='large'
                    onClick={handleClose}
                    variant='contained'
                    color='primary'
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
              </Grid>
            </Grid>
          </form>
        </Box>
      </Drawer>


    </>
  )
}

export default SidebarAddLicense
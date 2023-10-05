import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Grid from '@mui/material/Grid';
import Card from '@mui/material/Card';
import Divider from '@mui/material/Divider';
import Typography from '@mui/material/Typography';
import CardContent from '@mui/material/CardContent';
import Avatar from '@mui/material/Avatar';
import PersonIcon from '@mui/icons-material/Person';
import axios from 'axios';
import {
  Mail as MailIcon,
  Phone as PhoneIcon,
  Home as HomeIcon,
  CalendarToday as CalendarIcon,
  Work as WorkIcon,
  Public as PublicIcon
} from '@mui/icons-material';
import AssignmentIndIcon from '@mui/icons-material/AssignmentInd';
import ScheduleIcon from '@mui/icons-material/Schedule';
import React from 'react';
import { Box, Tabs } from '@mui/material';
import Tab from '@mui/material/Tab';
//import AsistenciaTable from './AsistenciaTable';
import { useTheme } from '@mui/material/styles';
import UsersProjectListTable from 'src/pages/user/usuario/view/UsersProjectListTable';
import UserViewConnection from './UserViewConnection';
import CustomAvatar from 'src/@core/components/mui/avatar';
import AsistenciaTable from './AsistenciaTable';
import PlanillaPersonal from './AsistenciaTable';
export type ThemeColor = 'primary' | 'secondary' | 'error' | 'warning' | 'info' | 'success'


interface Docu {
  _id: string;
  name: string;
  lastName: string;
  ci: string;
  email: string;
  phone: string;
  address: string;
  nationality: string;
  charge: string;
  schedule: string;
  unity: string;
  file: string;
  isActive: boolean;
}

interface DetailItemProps {
  label: string;
  value: string;
  icon?: JSX.Element;
  valueColor?: string;
}

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}


function CustomTabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );
}

function a11yProps(index: number) {
  return {
    id: `simple-tab-${index}`,
    'aria-controls': `simple-tabpanel-${index}`,
  };
}

const DetailItem: React.FC<DetailItemProps> = ({ label, value, icon }) => (
  <div style={{ display: 'flex', alignItems: 'center', margin: '10px 0' }}>
    {icon && <div style={{ marginRight: '10px' }}>{icon}</div>}
    <Typography>
      <strong>{label}: </strong> {value}
    </Typography>
  </div>
);
const UserViewLeft = () => {
  const [data, setData] = useState<Docu | null>(null);
  const [charge, setCharge] = useState<string | null>(null);
  const [schedule, setSchedule] = useState<string | null>(null);
  const router = useRouter();
  const { id } = router.query;
  const personalId = typeof id === 'string' ? id : '';

  const [value, setValue] = React.useState(0);

  let image: string

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

  useEffect(() => {
    if (id) fetchData();
  }, [id]);

  useEffect(() => {
    if (data) {
      fetchSchedule(data.schedule);
      fetchCharge(data.charge)
    }
  }, [data]);

  const fetchData = async () => {
    try {
      const response = await axios.get(`https://cold-cameras-stop.loca.lt/api/personal/${id}`);
      setData(response.data);
      console.log(data?.file)
    } catch (error) {
      console.log(error);
    }
  };

  const fetchCharge = async (charge: string) => {
    try {
      const response = await axios.get(`https://cold-cameras-stop.loca.lt/api/charge/${charge}`);
      setCharge(response.data.name); // Asumiendo que la respuesta tiene un campo 'name'
    } catch (error) {
      console.log(error);
    }
  };

  const fetchSchedule = async (schedule: string) => {
    try {
      const response = await axios.get(`https://cold-cameras-stop.loca.lt/api/schedule/${schedule}`);
      setSchedule(response.data.name); // Asumiendo que la respuesta tiene un campo 'name'
    } catch (error) {
      console.log(error);
    }
  };

  if (!data) return null;

  const convertBase64ToImageUrl = (base64String: string) => {
    return `data:image/png;base64,${base64String}`
  }

  const DetailItem: React.FC<DetailItemProps> = ({ label, value, icon }) => {
    const theme = useTheme(); // Accede al tema actual

    return (
      <div style={{
        display: 'flex',
        alignItems: 'center',
        margin: '8px 0',
        lineHeight: '1.5'
      }}>
        {icon && <div style={{ marginRight: '10px' }}>{icon}</div>}
        <Typography
          style={{
            fontSize: '0.85rem',
            letterSpacing: '0.3px',
            fontWeight: 500,
            color: theme.palette.mode === 'dark' ? '#ddd' : '#333' // Colores para oscuro y claro
          }}>
          <strong>{label}:</strong>
        </Typography>
        <Typography
          style={{
            marginLeft: '5px',
            fontSize: '0.8rem',
            letterSpacing: '0.2px',
            color: theme.palette.mode === 'dark' ? '#ccc' : '#555' // Colores para oscuro y claro
          }}>
          {value}
        </Typography>
      </div>
    );
  };



  return (

    <>
      <Grid container spacing={6} justifyContent="">
        <Grid item xs={12} sm={8} md={6} lg={4}>
          <Card sx={{ maxWidth: 400, width: '100%', margin: '0 auto' }}>
            <CardContent>
              <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '20px' }}>
                {/* <Avatar
                  src={data.file || ''}
                  alt={data.name}
                  sx={{
                    width: 100,
                    height: 100,
                    marginBottom: 2,
                    borderRadius: 0
                  }}
                >
                  {!data.file && <PersonIcon color="primary" sx={{ fontSize: 100 }} />}
                </Avatar> */}
                <CustomAvatar src={convertBase64ToImageUrl(data.file)} sx={{ width: 100, height: 100, marginBottom: 2, borderRadius: 0 }} />
              </div>
              <Typography
                variant="subtitle1"
                sx={{
                  mr: 2,
                  fontWeight: 600,
                  fontSize: '0.8rem',
                  letterSpacing: '0.5px'
                }}
                align='center'>
                {data.name} {data.lastName}
              </Typography>

              <Divider sx={{ mt: 4, mb: 2 }} />

              <Typography
                variant="h5"
                align="center"
                gutterBottom
                color="primary"
                sx={{
                  fontWeight: 'bold',
                  marginBottom: '20px',
                  paddingBottom: '10px',
                  display: 'inline-block',
                  textTransform: 'uppercase',
                  fontSize: '1.2rem',      // Tamaño un poco más grande para destacar.
                  letterSpacing: '1px'     // Espaciado para hacerlo más elegante.
                }}
              >
                DETALLES
              </Typography>
              <DetailItem label="Nombre" value={data.name} />
              <DetailItem label="Apellido" value={data.lastName} />
              <DetailItem label="CI" value={data.ci} />
              <DetailItem

                label="Estado"
                value={data.isActive ? 'activo' : 'inactivo'}
                valueColor={data.isActive ? 'green' : 'red'}
              />
              <DetailItem icon={<MailIcon color="primary" />} label="Email" value={data.email} />
              <DetailItem icon={<PhoneIcon color="primary" />} label="Celular" value={data.phone} />
              <DetailItem icon={<HomeIcon color="primary" />} label="Dirección" value={data.address} />
              <DetailItem icon={<PublicIcon color="primary" />} label="Nacionalidad" value={data.nationality} />

              <DetailItem icon={<WorkIcon color="primary" />} label="Unidad" value={data.unity} />
              <DetailItem icon={<AssignmentIndIcon color="primary" />} label="Cargo" value={charge ? charge : data.charge} />
              <DetailItem icon={<ScheduleIcon color="primary" />} label="Horario" value={schedule ? schedule : data.schedule} />

              <Divider sx={{ mt: 4, mb: 2 }} />
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={12} md={12} lg={8}>
          <Box sx={{ width: '100%' }}>
            <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
              <Tabs value={value} onChange={handleChange} aria-label="basic tabs example">
                <Tab label="Asistencia" {...a11yProps(0)} />
                <Tab label="Salarios" {...a11yProps(1)} />
                <Tab label="Kardex" {...a11yProps(2)} />
              </Tabs>
            </Box>
            <CustomTabPanel value={value} index={0}>
              <AsistenciaTable personalId={personalId} />
            </CustomTabPanel>
            <CustomTabPanel value={value} index={1}>
              <UserViewConnection />
            </CustomTabPanel>
            <CustomTabPanel value={value} index={2}>
              <UsersProjectListTable />
            </CustomTabPanel>
          </Box>
        </Grid>
      </Grid>

    </>
  );
};

export default UserViewLeft;

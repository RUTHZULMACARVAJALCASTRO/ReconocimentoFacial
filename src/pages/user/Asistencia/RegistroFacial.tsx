
import axios from 'axios';
import React, { useState, useRef, useEffect } from 'react';
import {
  Button,
  Container,
  Paper,
  Typography,
  createTheme,
  FormControl,
  MenuItem,
  InputLabel,
  Select,
  Box,
  FormLabel,
  Grid,
  InputAdornment,
  List,
  ListItem,
  ListItemText,
  TextField,
  ListItemIcon,
} from '@mui/material';
import { makeStyles } from '@mui/styles';
import Swal from 'sweetalert2';
import CircularProgress from '@material-ui/core/CircularProgress/CircularProgress';
import SearchIcon from '@material-ui/icons/Search';
const theme = createTheme();
import CheckIcon from '@mui/icons-material/Check';

interface User {
  _id: string;
  name: string;
  lastName: string;
}

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 16,
  },
  videoContainer: {
    position: 'relative',
    maxWidth: '100%',
    marginTop: 16,
    border: '2px solid #f0f0f0',
    boxShadow: '0px 0px 8px rgba(0, 0, 0, 0.15)',
    borderRadius: '15px',
  },
  listContainer: {
    maxHeight: '200px',
    overflow: 'auto',
    // ...otros estilos que quieras aplicar a listContainer
  },
  video: {
    width: '100%',
    height: 'auto',
    borderRadius: 15,
  },
  capturedImage: {
    width: '100%',
    height: 'auto',
    marginTop: 16,
    borderRadius: 15,
  },
  captureButton: {
    marginTop: 16,
  },
}));

const CaptureAndSend = () => {
  const classes = useStyles();
  const [videoBlob, setVideoBlob] = useState<Blob | null>(null);
  const [videoDataUri, setVideoDataUri] = useState<string | null>(null);
  const [errorSnackbarOpen, setErrorSnackbarOpen] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const realTimeVideoRef = useRef<HTMLVideoElement | null>(null);
  const mediaStreamRef = useRef<MediaStream | null>(null);
  const [users, setUsers] = useState<User[]>([]);
  const [counter, setCounter] = useState<number>(0);
  const [message, setMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [videoSent, setVideoSent] = useState(false);
  const [recognizingFace, setRecognizingFace] = useState(false);

  useEffect(() => {
    const startVideo = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true });
        mediaStreamRef.current = stream;
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      } catch (error) {
        setMessage('Error al iniciar el video');
      }
    };
    startVideo();

    return () => {
      if (mediaStreamRef.current) {
        mediaStreamRef.current.getTracks().forEach((track) => {
          track.stop();
        });
      }
    };
  }, []);




  useEffect(() => {
    if (message) {
      const timerId = setTimeout(() => {
        setMessage(null);
      }, 5000);  // 5 segundos

      return () => {
        clearTimeout(timerId);
      };
    }
  }, [message]);

  const handleStartRecording = () => {
    setIsRecording(true);
    const mediaRecorder = new MediaRecorder(mediaStreamRef.current!);
    const recordedChunks: Blob[] = [];

    setCounter(0);
    const intervalId = setInterval(() => {
      setCounter((prevCounter) => prevCounter + 1);
    }, 1000);

    mediaRecorder.ondataavailable = (event) => {
      if (event.data.size > 0) {
        recordedChunks.push(event.data);
        const reader = new FileReader();
        reader.onloadend = () => {
          const base64Data = reader.result?.toString()?.split(',')[1];
          if (base64Data) {
            //setMessage('Base64 del fragmento de video: ' + base64Data);
          }
        };
        reader.readAsDataURL(event.data);
      }
    };

    mediaRecorder.onstop = () => {
      clearInterval(intervalId);
      const videoBlob = new Blob(recordedChunks, { type: 'video/webm' });
      const videoDataUri = URL.createObjectURL(videoBlob);
      setVideoBlob(videoBlob);
      setVideoDataUri(videoDataUri);
      setIsRecording(false);

      Swal.fire({
        icon: 'success',
        title: 'Video Grabado',
        text: 'El video se ha grabado con éxito.',
      });
    };

    mediaRecorder.start();
    setTimeout(() => {
      mediaRecorder.stop();
      clearInterval(intervalId);
    }, 30000);
  };

  const handleSendVideo = async () => {
    setLoading(true);
    if (videoBlob) {
      const reader = new FileReader();
      reader.onloadend = async () => {
        const base64 = reader.result?.toString()?.split(',')[1];
        if (base64) {
          try {
            const response = await axios.post(`${process.env.NEXT_PUBLIC_RECONOCIMIENTO}`, {
              name: selectedUserId,
              video: base64,
            });
            Swal.fire({
              icon: 'success',
              title: 'Video enviado',
              text: 'Video enviado correctamente'
            });
            setVideoSent(true); // Aquí estableces que el video ha sido enviado
          } catch (error) {
            Swal.fire({
              icon: 'error',
              title: 'Oops...',
              text: 'Error al enviar el video',
            });
          } finally {
            setLoading(false);  // Desactivar el spinner
          }
        }
      };
      reader.readAsDataURL(videoBlob);
    }
  };

  const handleGetRequest = async () => {
    setRecognizingFace(true);
    try {
      const response = await axios.get(`${process.env.NEXT_PUBLIC_ENTRENAMIENTO}`);
      Swal.fire({
        icon: 'success',
        title: 'Solicitud completada',
        text: 'Proceso de solicitud completa',
      });
    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: 'Error en la solicitud  ',
      });
    } finally {
      setRecognizingFace(false);
    }
  };

  const [searchBy, setSearchBy] = useState("name");
  const [searchValue, setSearchValue] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
  const handleUserSelection = (userId: string) => {
    setSelectedUserId(userId);
    setFilteredUsers([]);  // Opcional: Limpiar la lista después de seleccionar
  };

  const handleSearch = async () => {
    setIsSearching(true);
    if (searchValue) {
      try {
        const url = `${process.env.NEXT_PUBLIC_PERSONAL}filtered?${searchBy}=${searchValue}`;
        const response = await axios.get(url);
        setFilteredUsers(response.data.data);
      } catch (error) {
        console.error("Error buscando usuarios:", error);
      }
    } else {
      setFilteredUsers([]);
    }
    setIsSearching(false);
  };


  return (
    <Container maxWidth="sm" className={classes.root}>
      <Typography variant="h4" gutterBottom>
        Registro de Personal Facial
      </Typography>
      {/* <input
        type="text"
        placeholder="Filtrar por nombre"
        value={filterName}
        onChange={(e) => setFilterName(e.target.value)}
      />

      <Button
        variant="contained"
        color="primary"
        fullWidth
        className={classes.captureButton}
        onClick={() => fetchUsers()}
      >
        Filtrar
      </Button> */}

      {loading || recognizingFace ? (
        <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', height: '50vh' }}>
          <CircularProgress color="primary" size={60} />
          <p style={{ marginTop: '16px' }}>{recognizingFace ? 'Registrando reconocimiento facial...' : 'Procesando...'}</p>
        </div>
      ) : (
        <>
          <Paper className={classes.videoContainer}>
            <div style={{ position: 'relative', width: '100%', height: 'auto' }}>
              <video ref={videoRef} autoPlay muted className={classes.video} />
              {isRecording && (
                <div style={{ position: 'absolute', top: 10, left: 10, background: 'rgba(0,0,0,0.5)', padding: '5px 10px', borderRadius: '5px', color: 'white' }}>
                  {counter} s
                </div>
              )}
            </div>
          </Paper>
          {videoDataUri ? (
            <div style={{ marginTop: theme.spacing(2) }}>
              <Grid item xs={12}>
                <FormControl component="fieldset">
                  <FormLabel component="legend">Seleccionar usuario</FormLabel>
                  <br />
                  <Box display="flex" alignItems="center" justifyContent="space-between" mb={2}>
                    <Box flex="0 1 auto" mr={2}>
                      <FormControl variant="outlined" style={{ width: '220px' }}>
                        <InputLabel>Buscar por</InputLabel>
                        <Select
                          value={searchBy}
                          onChange={(e) => setSearchBy(e.target.value)}
                          label="Buscar por"
                        >
                          <MenuItem value="name">Nombre</MenuItem>
                          <MenuItem value="lastName">Apellido</MenuItem>
                          <MenuItem value="nationality">Nacionalidad</MenuItem>
                          <MenuItem value="ci">CI</MenuItem>
                          <MenuItem value="address">Dirección</MenuItem>
                          <MenuItem value="phone">Teléfono</MenuItem>
                          <MenuItem value="email">Email</MenuItem>
                          <MenuItem value="isActive">Estado Activo</MenuItem>
                        </Select>
                      </FormControl>
                    </Box>
                    <Box flex="1">
                      <TextField
                        variant="outlined"
                        placeholder="Buscar usuario..."
                        value={searchValue}
                        onChange={(e) => setSearchValue(e.target.value)}
                        fullWidth
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
                    </Box>
                  </Box>
                  {isSearching && <p>Buscando...</p>}
                  {!isSearching && filteredUsers.length > 0 && (
                    <Box className={classes.listContainer}>
                      <List dense>
                        {filteredUsers.map((user: User) => (
                          <ListItem button key={user._id} onClick={() => handleUserSelection(user._id)}>
                            <ListItemText primary={user.name} />
                            {selectedUserId === user._id && <ListItemIcon><CheckIcon color="primary" /></ListItemIcon>}
                          </ListItem>
                        ))}
                      </List>
                    </Box>
                  )}
                </FormControl>
              </Grid>

              <Button
                variant="contained"
                color="primary"
                fullWidth
                className={classes.captureButton}
                onClick={handleSendVideo}
              >
                Enviar Video
              </Button>
              {videoSent && (
                <Button
                  variant="outlined"
                  color="primary"
                  fullWidth
                  className={classes.captureButton}
                  onClick={handleGetRequest}
                >
                  Procesar Reconocimiento Facial
                </Button>
              )}
            </div>
          ) : (
            <Button
              variant="contained"
              color="primary"
              fullWidth
              className={classes.captureButton}
              onClick={handleStartRecording}
              disabled={isRecording}
            >
              Iniciar Grabación
            </Button>
          )}

          {message && (
            <Typography variant="body2" style={{ marginTop: theme.spacing(2), color: 'red' }}>
              {message}
            </Typography>
          )}
        </>
      )}
    </Container>
  );
};

export default CaptureAndSend;
// import axios from 'axios';
// import React, { useState, useRef, useEffect } from 'react';
// import {
//   Button,
//   Container,
//   Paper,
//   Typography,
//   createTheme,
//   Snackbar,
//   FormControl,
//   MenuItem,
//   InputLabel,
//   Select,
// } from '@mui/material';
// import { makeStyles } from '@mui/styles';

// const theme = createTheme();

// interface User {
//   _id: string;
//   name: string;
// }

// const useStyles = makeStyles((theme) => ({
//   root: {
//     display: 'flex',
//     flexDirection: 'column',
//     alignItems: 'center',
//     justifyContent: 'center',
//     marginTop: 16,
//   },
//   videoContainer: {
//     position: 'relative',
//     maxWidth: '100%',
//     marginTop: 16,
//     border: '2px solid #f0f0f0',
//     boxShadow: '0px 0px 8px rgba(0, 0, 0, 0.15)',
//     borderRadius: '15px',
//   },
//   video: {
//     width: '100%',
//     height: 'auto',
//     borderRadius: 15,
//   },
//   capturedImage: {
//     width: '100%',
//     height: 'auto',
//     marginTop: 16,
//     borderRadius: 15,
//   },
//   captureButton: {
//     marginTop: 16,
//   },
// }));

// const CaptureAndSend = () => {
//   const classes = useStyles();
//   const [videoBlob, setVideoBlob] = useState<Blob | null>(null);
//   const [videoDataUri, setVideoDataUri] = useState<string | null>(null);
//   const [errorSnackbarOpen, setErrorSnackbarOpen] = useState(false);
//   const [isRecording, setIsRecording] = useState(false);
//   const videoRef = useRef<HTMLVideoElement | null>(null);
//   const realTimeVideoRef = useRef<HTMLVideoElement | null>(null);
//   const mediaStreamRef = useRef<MediaStream | null>(null);
//   const [selectedUserId, setSelectedUserId] = useState("");
//   // const [nombre, setNombre] = useState("");
//   const [users, setUsers] = useState<User[]>([]);
//   const [counter, setCounter] = useState<number>(0);
//   const [message, setMessage] = useState<string | null>(null);

//   useEffect(() => {
//     const startVideo = async () => {
//       try {
//         const stream = await navigator.mediaDevices.getUserMedia({ video: true });
//         mediaStreamRef.current = stream;
//         if (videoRef.current) {
//           videoRef.current.srcObject = stream;
//         }
//       } catch (error) {
//         setMessage('Error al iniciar el video: ' + error);
//       }
//     };
//     startVideo();

//     return () => {
//       if (mediaStreamRef.current) {
//         mediaStreamRef.current.getTracks().forEach((track) => {
//           track.stop();
//         });
//       }
//     };
//   }, []);

//   useEffect(() => {
//     fetchUsers();
//   }, []);

//   useEffect(() => {
//     const fetchUsersData = async () => {
//       try {
//         const usersResponse = await fetchUsers();
//         setUsers(usersResponse);
//         console.log(usersResponse);
//       } catch (error) {
//         console.log(error);
//       }
//     };
//     fetchUsersData();
//   }, []);

//   const fetchUsers = async () => {
//     try {
//       const response = await axios.get(`${process.env.NEXT_PUBLIC_PERSONAL}`);
//       return response.data
//     } catch (error) {
//       console.log(error);
//       return [];
//       setMessage('Error al obtener la lista de usuarios: ' + error);
//     }
//   };

//   useEffect(() => {
//     if (message) {
//       const timerId = setTimeout(() => {
//         setMessage(null);
//       }, 5000);  // 5 segundos

//       return () => {
//         clearTimeout(timerId);
//       };
//     }
//   }, [message]);

//   const handleStartRecording = () => {
//     setIsRecording(true);
//     const mediaRecorder = new MediaRecorder(mediaStreamRef.current!);
//     const recordedChunks: Blob[] = [];

//     setCounter(0);
//     const intervalId = setInterval(() => {
//       setCounter((prevCounter) => prevCounter + 1);
//     }, 1000);

//     mediaRecorder.ondataavailable = (event) => {
//       if (event.data.size > 0) {
//         recordedChunks.push(event.data);
//         const reader = new FileReader();
//         reader.onloadend = () => {
//           const base64Data = reader.result?.toString()?.split(',')[1];
//           if (base64Data) {
//             setMessage('Base64 del fragmento de video: ' + base64Data);
//           }
//         };
//         reader.readAsDataURL(event.data);
//       }
//     };

//     mediaRecorder.onstop = () => {
//       clearInterval(intervalId);
//       const videoBlob = new Blob(recordedChunks, { type: 'video/webm' });
//       const videoDataUri = URL.createObjectURL(videoBlob);
//       setVideoBlob(videoBlob);
//       setVideoDataUri(videoDataUri);
//       setIsRecording(false);
//     };

//     mediaRecorder.start();
//     setTimeout(() => {
//       mediaRecorder.stop();
//       clearInterval(intervalId);
//     }, 30000);
//   };

//   const handleSendVideo = async () => {
//     if (videoBlob) {
//       const reader = new FileReader();
//       reader.onloadend = async () => {
//         const base64 = reader.result?.toString()?.split(',')[1];
//         if (base64) {
//           try {
//             const response = await axios.post('http://10.10.214.189:8000/add-user', {
//               name: selectedUserId,
//               video: base64,
//             });
//             setMessage('Video enviado: ' + response.data);
//           } catch (error) {
//             setMessage('Error al enviar el video: ' + error);
//             setErrorSnackbarOpen(true);
//           }
//         }
//       };
//       reader.readAsDataURL(videoBlob);
//     }
//   };

//   const handleGetRequest = async () => {
//     try {
//       const response = await axios.get('http://10.10.214.189:8000/training');
//       setMessage('Respuesta GET: ' + response.data);
//     } catch (error) {
//       setMessage('Error en la solicitud GET: ' + error);
//     }
//   };

//   return (
//     <Container maxWidth="sm" className={classes.root} >
//       <Typography variant="h4" gutterBottom>
//         Registro de Personal Facial
//       </Typography>
//       <Paper className={classes.videoContainer}>
//         <div style={{ position: 'relative', width: '100%', height: 'auto' }}>
//           <video ref={videoRef} autoPlay muted className={classes.video} />
//           {isRecording && (
//             <div style={{ position: 'absolute', top: 10, left: 10, background: 'rgba(0,0,0,0.5)', padding: '5px 10px', borderRadius: '5px', color: 'white' }}>
//               {counter} s
//             </div>
//           )}
//         </div>
//       </Paper>
//       {videoDataUri ? (
//         <div style={{ marginTop: theme.spacing(2) }}>
//           <FormControl fullWidth>
//             <InputLabel>Seleccione al empleado a registrar</InputLabel>
//             <Select
//               value={selectedUserId}
//               onChange={(e) => setSelectedUserId(e.target.value as string)}
//             >
//               {users.map((user) => (
//                 <MenuItem key={user._id} value={user._id}>
//                   {user.name}
//                 </MenuItem>
//               ))}
//             </Select>
//           </FormControl>
//           <Button
//             variant="contained"
//             color="primary"
//             fullWidth
//             className={classes.captureButton}
//             onClick={handleSendVideo}
//           >
//             Enviar Video
//           </Button>
//           <Button
//             variant="outlined"
//             color="primary"
//             fullWidth
//             className={classes.captureButton}
//             onClick={handleGetRequest}
//           >
//             Procesar Reconocimiento Facial
//           </Button>
//         </div>
//       ) : (
//         <Button
//           variant="contained"
//           color="primary"
//           fullWidth
//           className={classes.captureButton}
//           onClick={handleStartRecording}
//           disabled={isRecording}
//         >
//           Iniciar Grabación
//         </Button>
//       )}

//       {message && (
//         <Typography variant="body2" style={{ marginTop: theme.spacing(2), color: 'red' }}>
//           {message}
//         </Typography>
//       )}

//       <Snackbar
//         open={errorSnackbarOpen}
//         autoHideDuration={3000}
//         onClose={() => setErrorSnackbarOpen(false)}
//         message="Error al registrar facial"
//       />
//     </Container>
//   );
// };

// export default CaptureAndSend;


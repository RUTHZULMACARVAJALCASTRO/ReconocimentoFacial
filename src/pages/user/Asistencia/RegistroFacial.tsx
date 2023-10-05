import axios from 'axios';
import React, { useState, useRef, useEffect } from 'react';
import {
  Button,
  Container,
  Paper,
  Typography,
  createTheme,
  Snackbar,
  FormControl,
  MenuItem,
  InputLabel,
  Select,
} from '@mui/material';
import { makeStyles } from '@mui/styles';

const theme = createTheme();

interface User {
  _id: string;
  name: string;
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
  const [selectedUserId, setSelectedUserId] = useState("");
  // const [nombre, setNombre] = useState("");
  const [users, setUsers] = useState<User[]>([]);
  const [counter, setCounter] = useState<number>(0);
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    const startVideo = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true });
        mediaStreamRef.current = stream;
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      } catch (error) {
        setMessage('Error al iniciar el video: ' + error);
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
    fetchUsers();
  }, []);

  useEffect(() => {
    const fetchUsersData = async () => {
      try {
        const usersResponse = await fetchUsers();
        setUsers(usersResponse);
        console.log(usersResponse);
      } catch (error) {
        console.log(error);
      }
    };
    fetchUsersData();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await axios.get(`${process.env.NEXT_PUBLIC_PERSONAL}`);
      return response.data
    } catch (error) {
      console.log(error);
      return [];
      setMessage('Error al obtener la lista de usuarios: ' + error);
    }
  };

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
            setMessage('Base64 del fragmento de video: ' + base64Data);
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
    };

    mediaRecorder.start();
    setTimeout(() => {
      mediaRecorder.stop();
      clearInterval(intervalId);
    }, 30000);
  };

  const handleSendVideo = async () => {
    if (videoBlob) {
      const reader = new FileReader();
      reader.onloadend = async () => {
        const base64 = reader.result?.toString()?.split(',')[1];
        if (base64) {
          try {
            const response = await axios.post('http://10.10.214.111:8000/add-user', {
              name: selectedUserId,
              video: base64,
            });
            setMessage('Video enviado: ' + response.data);
          } catch (error) {
            setMessage('Error al enviar el video: ' + error);
            setErrorSnackbarOpen(true);
          }
        }
      };
      reader.readAsDataURL(videoBlob);
    }
  };

  const handleGetRequest = async () => {
    try {
      const response = await axios.get('http://10.10.214.111:8000/training');
      setMessage('Respuesta GET: ' + response.data);
    } catch (error) {
      setMessage('Error en la solicitud GET: ' + error);
    }
  };

  return (
    <Container maxWidth="sm" className={classes.root} >
      <Typography variant="h4" gutterBottom>
        Registro de Personal Facial
      </Typography>
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
          <FormControl fullWidth>
            <InputLabel>Seleccione al empleado a registrar</InputLabel>
            <Select
              value={selectedUserId}
              onChange={(e) => setSelectedUserId(e.target.value as string)}
            >
              {users.map((user) => (
                <MenuItem key={user._id} value={user._id}>
                  {user.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <Button
            variant="contained"
            color="primary"
            fullWidth
            className={classes.captureButton}
            onClick={handleSendVideo}
          >
            Enviar Video
          </Button>
          <Button
            variant="outlined"
            color="primary"
            fullWidth
            className={classes.captureButton}
            onClick={handleGetRequest}
          >
            Procesar Reconocimiento Facial
          </Button>
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

      <Snackbar
        open={errorSnackbarOpen}
        autoHideDuration={3000}
        onClose={() => setErrorSnackbarOpen(false)}
        message="Error al registrar facial"
      />
    </Container>
  );
};

export default CaptureAndSend;

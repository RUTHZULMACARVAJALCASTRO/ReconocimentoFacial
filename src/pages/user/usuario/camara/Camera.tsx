import axios from 'axios';
import React, { useState, useRef, useEffect } from 'react';
import { Button, Container, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, ThemeProvider, Typography, createTheme } from '@mui/material';
import { makeStyles } from '@mui/styles';

const theme = createTheme();

const useStyles = makeStyles((theme: { spacing: (arg0: number) => any; }) => ({
  root: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: theme.spacing(4),
  },
  videoContainer: {
    position: 'relative',
    maxWidth: '100%',
    marginTop: theme.spacing(2),
  },
  video: {
    width: '100%',
    height: 'auto',
    borderRadius: theme.spacing(1),
  },
  capturedImage: {
    width: '100%',
    height: 'auto',
    marginTop: theme.spacing(2),
    borderRadius: theme.spacing(1),
  },
  captureButton: {
    marginTop: theme.spacing(2),
  },
}));


const CaptureAndSend = () => {
  const classes = useStyles();
  const[prueba,setPrueba]=useState("")
  const [imageData, setImageData] = useState<string | null>(null);
  const [attendanceTime, setAttendanceTime] = useState<string | null>(null);
  const [attendanceRegistered, setAttendanceRegistered] = useState<boolean>(false);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const mediaStreamRef = useRef<MediaStream | null>(null);
  const [data,setData]=useState<string>()

  useEffect(() => {
    const startVideo = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true });
        mediaStreamRef.current = stream;
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      } catch (error) {
        console.error(error);
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

  const handleCaptureImage = async () => {
    if (videoRef.current) {
      const video = videoRef.current;
      const canvas = document.createElement('canvas');
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      const context = canvas.getContext('2d');

      if (context) {
        context.drawImage(video, 0, 0, canvas.width, canvas.height);
        const dataUri = canvas.toDataURL('image/jpeg');
        setImageData(dataUri);

        // Registro de asistencia con la hora actual
        const currentTime = new Date().toLocaleTimeString();
        setAttendanceTime(currentTime);
        setAttendanceRegistered(true);

        // Aquí puedes enviar la imagen y la hora mediante una solicitud POST utilizando Axios
        console.log('Imagen capturada:', dataUri);
        console.log('Hora de asistencia:', currentTime);
        const formData = new FormData();
        formData.append('file', dataUri); // 'file' debe coincidir con el nombre del campo de archivo en el formulario
        
        // try {
        //   const response = await axios.post('http://10.10.214.223:5001/face_rec',dataUri,{
        //     headers: {
        //       'Content-Type': 'multipart/form-data',
        //     },
        //   })
        //   console.log("post OK")
        //   console.log("response: "+response)
        //   console.log("response.data: "+response.data)
        //   // Puedes manejar la respuesta del servidor aquí si es necesario
        // } catch (error) {
        //   console.error(error);
        // }
        const base64=dataUri.split(',')[1];
        const data={
          file_format:dataUri.split('/')[1],
          image_data:base64
        }
        try {
          const response = await axios.post('http://10.10.214.223:5001/face_rec',data);
          setPrueba(response.data)
          console.log("post OK")
          console.log("response: "+response)
          console.log("response.data: "+response.data)
          // Puedes manejar la respuesta del servidor aquí si es necesario
        } catch (error) {
          console.error(error);
        }
      }
    }
  };

  return (
    <ThemeProvider theme={theme}>
      <Container maxWidth="sm" className={classes.root}>
        <Typography variant="h4" gutterBottom>
          Capturar y enviar foto
        </Typography>
        <Paper className={classes.videoContainer}>
          <div style={{ position: 'relative', width: '100%', height: 'auto' }}>
            <video ref={videoRef} autoPlay muted className={classes.video} />
          </div>
        </Paper>
        {imageData ? (
          <div style={{ marginTop: theme.spacing(2) }}>
            <img src={imageData} alt="Captured" className={classes.capturedImage} />
            <Typography variant="body1">Hora de asistencia: {attendanceTime}</Typography>
          </div>
        ) : (
          <div style={{ marginTop: theme.spacing(2), display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Button variant="contained" color="primary" className={classes.captureButton} onClick={handleCaptureImage}>
              Capturar foto
            </Button>
          </div>
        )}
        {attendanceRegistered && (
          <TableContainer component={Paper} style={{ marginTop: theme.spacing(2) }}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Fecha</TableCell>
                  <TableCell>Hora de asistencia</TableCell>
                  <TableCell>Asistencia registrada</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                <TableRow>
                  <TableCell>{new Date().toLocaleDateString()}</TableCell>
                  <TableCell>{attendanceTime}</TableCell>
                  <TableCell>Presente</TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </TableContainer>
        )}
        <Typography variant="body1">{prueba}</Typography>
      </Container>
    </ThemeProvider>
  );
};


export default CaptureAndSend;


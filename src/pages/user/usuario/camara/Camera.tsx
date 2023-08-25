// import axios from 'axios';
// import React, { useState, useRef, useEffect } from 'react';
// import { Button, Container, Paper, Typography, createTheme } from '@mui/material';
// import { makeStyles } from '@mui/styles';

// const theme = createTheme();

// const useStyles = makeStyles((theme: { spacing: (arg0: number) => any; }) => ({
//   root: {
//     display: 'flex',
//     flexDirection: 'column',
//     alignItems: 'center',
//     justifyContent: 'center',
//     marginTop: theme.spacing(4),
//   },
//   videoContainer: {
//     position: 'relative',
//     maxWidth: '100%',
//     marginTop: theme.spacing(2),
//   },
//   video: {
//     width: '100%',
//     height: 'auto',
//     borderRadius: theme.spacing(1),
//   },
//   capturedImage: {
//     width: '100%',
//     height: 'auto',
//     marginTop: theme.spacing(2),
//     borderRadius: theme.spacing(1),
//   },
//   captureButton: {
//     marginTop: theme.spacing(2),
//   },
// }));

// const CaptureAndSend = () => {
//   const classes = useStyles();
//   const [videoBlob, setVideoBlob] = useState<Blob | null>(null);
//   const [videoDataUri, setVideoDataUri] = useState<string | null>(null);
//   const videoRef = useRef<HTMLVideoElement | null>(null);
//   const mediaStreamRef = useRef<MediaStream | null>(null);

//   useEffect(() => {
//     const startVideo = async () => {
//       try {
//         const stream = await navigator.mediaDevices.getUserMedia({ video: true });
//         mediaStreamRef.current = stream;
//         if (videoRef.current) {
//           videoRef.current.srcObject = stream;
//         }
//       } catch (error) {
//         console.error(error);
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

//   const handleStartRecording = () => {
//     const mediaRecorder = new MediaRecorder(mediaStreamRef.current!);
//     const recordedChunks: Blob[] = [];

//     mediaRecorder.ondataavailable = (event) => {
//       if (event.data.size > 0) {
//         recordedChunks.push(event.data);
//       }
//     };

//     mediaRecorder.onstop = () => {
//       const videoBlob = new Blob(recordedChunks, { type: 'video/webm' });
//       const videoDataUri = URL.createObjectURL(videoBlob);
//       setVideoBlob(videoBlob);
//       setVideoDataUri(videoDataUri);
//     };

//     mediaRecorder.start();
//     setTimeout(() => mediaRecorder.stop(), 5000); // Grab video for 5 seconds
//   };

//   const handleSendVideo = async () => {
//     if (videoBlob) {
//       const reader = new FileReader();
//       reader.onloadend = async () => {
//         const base64 = reader.result?.toString()?.split(',')[1];
//         if (base64) {
//           try {
//             const response = await axios.post('http://10.10.214.223:5001/upload_video', {
//               video_data: base64,
//             });
//             console.log('Video enviado:', response.data);
//           } catch (error) {
//             console.error('Error al enviar el video:', error);
//           }
//         }
//       };
//       reader.readAsDataURL(videoBlob);
//     }
//   };

//   return (
//     <Container maxWidth="sm" className={classes.root}>
//       <Typography variant="h4" gutterBottom>
//         Capturar y enviar video
//       </Typography>
//       <Paper className={classes.videoContainer}>
//         <div style={{ position: 'relative', width: '100%', height: 'auto' }}>
//           <video ref={videoRef} autoPlay muted className={classes.video} />
//         </div>
//       </Paper>
//       {videoDataUri ? (
//         <div style={{ marginTop: theme.spacing(2) }}>
//           <video controls src={videoDataUri} className={classes.video} />
//           <Button
//             variant="contained"
//             color="primary"
//             onClick={handleSendVideo}
//             className={classes.captureButton}
//           >
//             Enviar video
//           </Button>
//         </div>
//       ) : (
//         <div style={{ marginTop: theme.spacing(2), display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
//           <Button
//             variant="contained"
//             color="primary"
//             onClick={handleStartRecording}
//             className={classes.captureButton}
//           >
//             Iniciar grabación
//           </Button>
//         </div>
//       )}
//     </Container>
//   );
// };

// export default CaptureAndSend;

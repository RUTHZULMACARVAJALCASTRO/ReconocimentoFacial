import axios from 'axios';
import React, { useState, useRef, useEffect } from 'react';
import { Button, Container, Paper, Typography, Snackbar, Box } from '@mui/material';
import { makeStyles } from '@mui/styles';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import Swal from 'sweetalert2';




const useStyles = makeStyles(() => ({
    root: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 50,
        padding: 30,
        borderRadius: 10,
        boxShadow: '0 3px 10px rgba(0, 0, 0, 0.2)',
        background: '#455a64',
    },
    imageContainer: {
        position: 'relative',
        width: '100%',
        height: 400,
        overflow: 'hidden',
        borderRadius: 15,
        border: '5px solid #b2dfdb',
        marginBottom: 24,
    },
    image: {
        width: '100%',
        height: '100%',
        objectFit: 'cover',
        borderRadius: 10,
    },
    captureButton: {
        margin: '16px 0',
        padding: '12px 24px',
        fontSize: 16,
        fontWeight: 'bold',
        boxShadow: '0 3px 5px rgba(0, 0, 0, 0.2)',
    },
    resultData: {
        padding: 15,
        borderRadius: 10,
        boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
        marginTop: 24,
    },
}));

interface UserName {
    name: string
}

const CaptureAndSend = () => {
    const [name, setName] = useState<UserName>({ name: "" });
    const classes = useStyles();
    const [imageBlob, setImageBlob] = useState<Blob | null>(null);
    const [imageDataUri, setImageDataUri] = useState<string | null>(null);
    const [resultData, setResultData] = useState<any | null>(null);
    const [errorSnackbarOpen, setErrorSnackbarOpen] = useState(false);
    const videoRef = useRef<HTMLVideoElement | null>(null);
    const [message, setMessage] = useState<{ text: string, success: boolean } | null>(null);

    useEffect(() => {
        if (videoRef.current) {
            navigator.mediaDevices.getUserMedia({ video: true })
                .then((stream) => {
                    videoRef.current!.srcObject = stream;
                })
                .catch((error) => {
                    console.error('Error al acceder a la cámara:', error);
                });
        }
    }, []);



    const handleSendImage = async () => {
        try {
            const response = await axios.post(`http://10.10.214.124:3000/api/attendance/register/`, {
                base: imageDataUri,
            });
            setName(response.data);
            setResultData(response.data);

            if (!response.data || response.data.nombre === "Desconocido") {
                // Aquí puedes usar Swal.fire para mostrar un mensaje de error, si lo deseas.
                Swal.fire({
                    position: 'top-end',
                    icon: 'error',
                    title: 'No se pudo realizar el registro',
                    showConfirmButton: false,
                    timer: 1500
                });
            } else {
                // Aquí usamos Swal.fire para mostrar un mensaje de éxito.
                Swal.fire({
                    position: 'top-end',
                    icon: 'success',
                    title: 'Registrado correctamente',
                    showConfirmButton: false,
                    timer: 1500
                });
                window.location.href = "/user/Asistencia/planillas";
            }
        } catch (error) {
            console.error('Error al enviar la imagen:', error);
            // Aquí también puedes usar Swal.fire para mostrar un mensaje de error.
            Swal.fire({
                position: 'top-end',
                icon: 'error',
                title: 'Error al enviar la imagen',
                showConfirmButton: false,
                timer: 1500
            });
        }
    };


    const handleCaptureImage = () => {
        if (videoRef.current) {
            const canvas = document.createElement('canvas');
            canvas.width = videoRef.current.videoWidth;
            canvas.height = videoRef.current.videoHeight;
            const context = canvas.getContext('2d');
            context?.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
            const dataUri = canvas.toDataURL('image/jpeg');
            setImageDataUri(dataUri);
        }
    };

    return (
        <Box component="section" py={10} bgcolor="#e0e0e0">

            <Container maxWidth="sm" >
                <Typography
                    variant="h4"
                    component="h1"
                    align="center"
                    gutterBottom
                >
                    REGISTRAR  ASISTENCIA
                </Typography>
                <Paper className={classes.imageContainer}>
                    <video ref={videoRef} autoPlay playsInline muted className={classes.image} />
                </Paper>
                {imageDataUri ? (
                    <Button
                        variant="contained"
                        color="primary"
                        fullWidth
                        onClick={handleSendImage}
                        className={classes.captureButton}
                    >
                        Enviar
                    </Button>
                ) : (
                    <Button
                        variant="contained"
                        color="primary"
                        fullWidth
                        onClick={handleCaptureImage}
                        className={classes.captureButton}
                    >
                        Haga Click en el botón para tomar Asistencia
                    </Button>
                )}
                {resultData && (
                    <Box className={classes.resultData}>
                        <Typography variant="body1" gutterBottom>
                            Nombre: {resultData.nombre}
                        </Typography>
                        <Typography variant="body1" gutterBottom>
                            Fecha: {resultData.fecha}
                        </Typography>
                        <Typography variant="body1" gutterBottom>
                            Hora: {resultData.hora}
                        </Typography>
                        <Typography variant="body1">
                            Estado: {resultData.estado}
                        </Typography>
                    </Box>
                )}
                <Snackbar
                    open={message !== null}
                    autoHideDuration={6000}
                    onClose={() => setMessage(null)}
                    message={
                        <span>
                            {message?.success ? <CheckCircleIcon /> : null}
                            {message?.text}
                        </span>
                    }
                />

            </Container>
            <Box textAlign="center" mt={5}>
                <Typography variant="h6">{name.name}</Typography>
            </Box>
        </Box>

    );
};

export default CaptureAndSend;
// import axios from 'axios';
// import React, { useState, useRef, useEffect } from 'react';
// import { Button, Container, Paper, Typography, Snackbar, Box } from '@mui/material';
// import { makeStyles } from '@mui/styles';
// import CheckCircleIcon from '@mui/icons-material/CheckCircle';
// import Swal from 'sweetalert2';




// const useStyles = makeStyles(() => ({
//     root: {
//         display: 'flex',
//         flexDirection: 'column',
//         alignItems: 'center',
//         justifyContent: 'center',
//         marginTop: 50,
//         padding: 30,
//         borderRadius: 10,
//         boxShadow: '0 3px 10px rgba(0, 0, 0, 0.2)',
//         background: '#455a64',
//     },
//     imageContainer: {
//         position: 'relative',
//         width: '100%',
//         height: 600,
//         overflow: 'hidden',
//         borderRadius: 15,
//         border: '5px solid #b2dfdb',
//         marginBottom: 24,
//     },
//     image: {
//         width: '100%',
//         height: '100%',
//         objectFit: 'cover',
//         borderRadius: 10,
//     },
//     captureButton: {
//         margin: '16px 0',
//         padding: '12px 24px',
//         fontSize: 16,
//         fontWeight: 'bold',
//         boxShadow: '0 3px 5px rgba(0, 0, 0, 0.2)',
//     },
//     resultData: {
//         padding: 15,
//         borderRadius: 10,
//         boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
//         marginTop: 24,
//     },
// }));

// interface UserName {
//     name: string
// }

// const CaptureAndSend = () => {
//     const [name, setName] = useState<UserName>({ name: "" });
//     const classes = useStyles();
//     const [imageBlob, setImageBlob] = useState<Blob | null>(null);
//     const [imageDataUri, setImageDataUri] = useState<string | null>(null);
//     const [resultData, setResultData] = useState<any | null>(null);
//     const [errorSnackbarOpen, setErrorSnackbarOpen] = useState(false);
//     const videoRef = useRef<HTMLVideoElement | null>(null);
//     const [message, setMessage] = useState<{ text: string, success: boolean } | null>(null);

//     useEffect(() => {
//         if (videoRef.current) {
//             navigator.mediaDevices.getUserMedia({ video: true })
//                 .then((stream) => {
//                     videoRef.current!.srcObject = stream;
//                 })
//                 .catch((error) => {
//                     console.error('Error al acceder a la cámara:', error);
//                 });
//         }
//     }, []);



//     const handleSendImage = async () => {
//         try {
//             const response = await axios.post(`http://10.10.214.124:3000/api/attendance/register/`, {
//                 base: imageDataUri,
//             });
//             setName(response.data);
//             setResultData(response.data);

//             if (!response.data || response.data.nombre === "Desconocido") {
//                 // Aquí puedes usar Swal.fire para mostrar un mensaje de error, si lo deseas.
//                 Swal.fire({
//                     position: 'top-end',
//                     icon: 'error',
//                     title: 'No se pudo realizar el registro',
//                     showConfirmButton: false,
//                     timer: 1500
//                 });
//             } else {
//                 // Aquí usamos Swal.fire para mostrar un mensaje de éxito.
//                 Swal.fire({
//                     position: 'top-end',
//                     icon: 'success',
//                     title: 'Registrado correctamente',
//                     showConfirmButton: false,
//                     timer: 1500
//                 });
//                 window.location.href = "/user/Asistencia/planillas";
//             }
//         } catch (error) {
//             console.error('Error al enviar la imagen:', error);
//             // Aquí también puedes usar Swal.fire para mostrar un mensaje de error.
//             Swal.fire({
//                 position: 'top-end',
//                 icon: 'error',
//                 title: 'Error al enviar la imagen',
//                 showConfirmButton: false,
//                 timer: 1500
//             });
//         }
//     };


//     const handleCaptureImage = () => {
//         if (videoRef.current) {
//             const canvas = document.createElement('canvas');
//             canvas.width = videoRef.current.videoWidth;
//             canvas.height = videoRef.current.videoHeight;
//             const context = canvas.getContext('2d');
//             context?.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
//             const dataUri = canvas.toDataURL('image/jpeg');
//             setImageDataUri(dataUri);
//         }
//     };

//     return (
//         <Box component="section" py={10} bgcolor="#e0e0e0">

//             <Container maxWidth="sm" >
//                 <Typography
//                     variant="h4"
//                     component="h1"
//                     align="center"
//                     gutterBottom
//                 >
//                     REGISTRAR  ASISTENCIA
//                 </Typography>
//                 <Paper className={classes.imageContainer}>
//                     <video ref={videoRef} autoPlay playsInline muted className={classes.image} />
//                 </Paper>
//                 {imageDataUri ? (
//                     <Button
//                         variant="contained"
//                         color="primary"
//                         fullWidth
//                         onClick={handleSendImage}
//                         className={classes.captureButton}
//                     >
//                         Enviar
//                     </Button>
//                 ) : (
//                     <Button
//                         variant="contained"
//                         color="primary"
//                         fullWidth
//                         onClick={handleCaptureImage}
//                         className={classes.captureButton}
//                     >
//                         Haga Click en el botón para tomar Asistencia
//                     </Button>
//                 )}
//                 {resultData && (
//                     <Box className={classes.resultData}>
//                         <Typography variant="body1" gutterBottom>
//                             Nombre: {resultData.nombre}
//                         </Typography>
//                         <Typography variant="body1" gutterBottom>
//                             Fecha: {resultData.fecha}
//                         </Typography>
//                         <Typography variant="body1" gutterBottom>
//                             Hora: {resultData.hora}
//                         </Typography>
//                         <Typography variant="body1">
//                             Estado: {resultData.estado}
//                         </Typography>
//                     </Box>
//                 )}
//                 <Snackbar
//                     open={message !== null}
//                     autoHideDuration={6000}
//                     onClose={() => setMessage(null)}
//                     message={
//                         <span>
//                             {message?.success ? <CheckCircleIcon /> : null}
//                             {message?.text}
//                         </span>
//                     }
//                 />

//             </Container>
//             <Box textAlign="center" mt={5}>
//                 <Typography variant="h6">{name.name}</Typography>
//             </Box>
//         </Box>

//     );
// };

// export default CaptureAndSend;

// import axios from 'axios';
// import React, { useState, useRef, useEffect } from 'react';
// import { Container, Paper, Typography, Snackbar, Box, CircularProgress } from '@mui/material';
// import { makeStyles } from '@mui/styles';
// import CheckCircleIcon from '@mui/icons-material/CheckCircle';
// import Swal from 'sweetalert2';

// const useStyles = makeStyles(() => ({
//     root: {
//         display: 'flex',
//         flexDirection: 'column',
//         alignItems: 'center',
//         justifyContent: 'center',
//         marginTop: 50,
//         padding: 30,
//         borderRadius: 10,
//         boxShadow: '0 3px 10px rgba(0, 0, 0, 0.2)',
//         background: '#455a64',
//     },
//     imageContainer: {
//         position: 'relative',
//         width: '100%',
//         height: '100',
//         overflow: 'hidden',
//         borderRadius: 0,
//         marginBottom: 24,
//     },
//     image: {
//         width: '100%',
//         height: '100%',
//         objectFit: 'cover',
//     },
//     resultData: {
//         padding: 15,
//         borderRadius: 10,
//         boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
//         marginTop: 24,
//     },
// }));

// interface UserName {
//     name: string;
//     lastName: string;
// }

// const CaptureAndSend = () => {
//     const [name, setName] = useState<UserName>({ name: "", lastName: "" });
//     const classes = useStyles();
//     const [imageDataUri, setImageDataUri] = useState<string | null>(null);
//     const [resultData, setResultData] = useState<any | null>(null);
//     const [message, setMessage] = useState<{ text: string; success: boolean } | null>(null);
//     const videoRef = useRef<HTMLVideoElement | null>(null);

//     useEffect(() => {
//         const requestCameraPermission = async () => {
//             try {
//                 const stream = await navigator.mediaDevices.getUserMedia({ video: true });
//                 if (videoRef.current) {
//                     videoRef.current.srcObject = stream;
//                     videoRef.current.play();
//                     setTimeout(() => {
//                         takePhotoAndSend(); // Tomar foto automáticamente después de 7 segundos
//                     }, 7000);
//                 }
//             } catch (error) {
//                 console.error('Error al acceder a la cámara');
//             }
//         };

//         requestCameraPermission();
//     }, []);

//     const takePhotoAndSend = async () => {
//         if (videoRef.current) {
//             const canvas = document.createElement('canvas');
//             canvas.width = videoRef.current.videoWidth;
//             canvas.height = videoRef.current.videoHeight;
//             const context = canvas.getContext('2d');
//             context?.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
//             const dataUri = canvas.toDataURL('image/jpeg');
//             setImageDataUri(dataUri);

//             try {
//                 const response = await axios.post(`http:10.10.214.124:3000/api/attendance/register/`, {
//                     base: dataUri,
//                 });
//                 setName({
//                     name: response.data.name,
//                     lastName: response.data.lastName
//                 });
//                 setResultData(response.data);

//                 if (!response.data || response.data.name === "Desconocido") {
//                     Swal.fire({
//                         position: 'top-end',
//                         icon: 'error',
//                         title: 'No se pudo realizar el registro',
//                         showConfirmButton: false,
//                         timer: 1500
//                     });
//                 } else {
//                     Swal.fire({
//                         position: 'center',
//                         icon: 'success',
//                         title: `Registrado correctamente: ${name.name} ${name.lastName}`,
//                         showConfirmButton: false,
//                         timer: 1500
//                     });
//                     window.location.href = "/user/Asistencia/planillas";
//                 }
//             } catch (error) {
//                 console.error('Error al enviar la imagen');
//                 Swal.fire({
//                     position: 'top-end',
//                     icon: 'error',
//                     title: 'Error al enviar la imagen',
//                     showConfirmButton: false,
//                     timer: 1500
//                 });
//             }
//         }
//     };

//     return (
//         <Box component="section" py={10} bgcolor="#bdbdbd">
//             <Container maxWidth="sm">
//                 <Typography
//                     variant="h4"
//                     component="h1"
//                     align="center"
//                     gutterBottom
//                 >
//                     REGISTRO DE ASISTENCIA
//                 </Typography>
//                 <Typography
//                     variant="h6"
//                     component="h6"
//                     align="center"
//                     gutterBottom
//                 >
//                     Centre Bien su rostro que se tomara su asistencia
//                 </Typography>
//                 <Paper className={classes.imageContainer}>
//                     <video
//                         ref={videoRef}
//                         autoPlay
//                         playsInline
//                         muted
//                         className={classes.image}
//                     />
//                 </Paper>
//                 <Snackbar
//                     open={message !== null}
//                     autoHideDuration={6000}
//                     onClose={() => setMessage(null)}
//                     message={
//                         <span>
//                             {message?.success ? <CheckCircleIcon /> : null}
//                             {message?.text}
//                         </span>
//                     }
//                 />
//             </Container>
//         </Box>
//     );
// };

// export default CaptureAndSend;











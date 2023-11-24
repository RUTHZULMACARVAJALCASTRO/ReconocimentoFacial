import axios from 'axios';
import React, { useState, useRef, useEffect } from 'react';
import { Container, Paper, Typography, Snackbar, Box, CircularProgress } from '@mui/material';
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
		background: '#fff',
	},
	imageContainer: {
		position: 'relative',
		width: '100%',
		height: '100',
		overflow: 'hidden',
		borderRadius: 0,
		marginBottom: 24,
	},
	image: {
		width: '100%',
		height: '100%',
		objectFit: 'cover',
	},
	resultData: {
		padding: 15,
		borderRadius: 10,
		boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
		marginTop: 24,
	},
	countdown: {
		fontSize: '24px',
		fontWeight: 'bold',
		marginTop: '15px',
		color: '#fff', // Color rojo suave
	}
}));

interface UserName {
	name: string;
	lastName: string;
}

const CaptureAndSend = () => {
	const [name, setName] = useState<UserName>({ name: "", lastName: "" });
	const classes = useStyles();
	const [imageDataUri, setImageDataUri] = useState<string | null>(null);
	const [resultData, setResultData] = useState<any | null>(null);
	const [message, setMessage] = useState<{ text: string; success: boolean } | null>(null);
	const videoRef = useRef<HTMLVideoElement | null>(null);
	const [countdown, setCountdown] = useState<number>(7);

	useEffect(() => {

		const requestCameraPermission = async () => {
			try {
				const stream = await navigator.mediaDevices.getUserMedia({ video: true });
				if (videoRef.current) {
					videoRef.current.srcObject = stream;
					videoRef.current.play();

					const countdownInterval = setInterval(() => {
						setCountdown(prev => prev - 1);
					}, 1000);

					setTimeout(() => {
						takePhotoAndSend();
					}, 7000);
				}

			} catch (error) {
				console.error('Error al acceder a la cámara');
			}
		};

		requestCameraPermission();
	}, []);

	const takePhotoAndSend = async () => {
		if (videoRef.current) {
			const canvas = document.createElement('canvas');
			canvas.width = videoRef.current.videoWidth;
			canvas.height = videoRef.current.videoHeight;
			const context = canvas.getContext('2d');
			context?.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
			const dataUri = canvas.toDataURL('image/jpeg');
			setImageDataUri(dataUri);

			try {
				const response = await axios.post(`${process.env.NEXT_PUBLIC_PERSONAL_FACIAL}`, {
					base: dataUri,
				});
				setName({
					name: response.data.name,
					lastName: response.data.lastName
				});
				setResultData(response.data);

				if (!response.data || response.data.name === "Desconocido") {
					Swal.fire({
						position: 'center',
						icon: 'error',
						title: 'No se pudo realizar el registro',
						showConfirmButton: false,
						timer: 5000
					}).then((result) => {
						if (result.dismiss === Swal.DismissReason.timer) {
							if (window.opener && !window.opener.closed) {
								window.opener.location.href = "/user/Asistencia/"
							}
							window.close();
						}
					})
				} else {
					Swal.fire({
						position: 'center',
						icon: 'success',
						title: `Registrado correctamente: ${response.data.message}`,
						showConfirmButton: false,
						timer: 7000
					}).then((result) => {
						if (result.dismiss === Swal.DismissReason.timer) {
							if (window.opener && !window.opener.closed) {
								window.opener.location.href = "/user/Asistencia/planillas"
							}
							window.close();
						}
					});
				}
			} catch (error: any) {
				if (error.response && error.response.data && error.response.data.message) {
					return (
						Swal.fire({
							position: 'center',
							icon: 'error',
							title: `${error.response.data.message}`,
							showConfirmButton: false,
							timer: 7000,

						}).then((result) => {
							if (window.opener && !window.opener.closed) {
								window.opener.location.href = "/home"
							}
							window.close();
						})
					)
				} else {
					return (
						Swal.fire({
							position: 'center',
							icon: 'error',
							title: `${error.message}`,
							showConfirmButton: false,
							timer: 7000
						})
					)
				}
			}
		}
	};

	return (
		<Box component="section" py={10} bgcolor="RGBA( 0, 0, 0, 0.1 )">
			<Container maxWidth="sm">
				<Typography
					variant="h4"
					component="h1"
					align="center"
					gutterBottom
				>
					REGISTRO DE ASISTENCIA
				</Typography>
				<Typography
					variant="h6"
					component="h6"
					align="center"
					gutterBottom
					className={classes.countdown}
				>
					{countdown > 0 ? `El registro se realizará en ${countdown}` : 'Tomando registro...'}
				</Typography>
				<Paper className={classes.imageContainer}>
					<video
						ref={videoRef}
						autoPlay
						playsInline
						muted
						className={classes.image}
					/>
				</Paper>
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
		</Box>
	);
};

export default CaptureAndSend;








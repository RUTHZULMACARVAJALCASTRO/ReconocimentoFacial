---
title: CaptureAndSend Component
sidebar_position: 5
---


# Componente `CaptureAndSend`

El componente `CaptureAndSend` es responsable de capturar una imagen de la cámara del dispositivo y enviarla a través de una solicitud POST utilizando Axios.

# Importaciones

El componente utiliza Axios para realizar solicitudes HTTP, y React para construir la interfaz de usuario.

        ```tsx
        import axios from 'axios';
        import React, { useState, useRef, useEffect } from 'react';
        ```
# Estado y Referencias
El componente utiliza el estado para almacenar la imagen capturada (`imageData`), la hora de asistencia (`attendanceTime`) y si la asistencia ha sido registrada (`attendanceRegistered`). También se utiliza una referencia para acceder al elemento de video en el DOM (`videoRef`) y otra referencia para almacenar la transmisión de medios (`mediaStreamRef`).

        ```tsx
            const [imageData, setImageData] = useState<string | null>(null);
            const [attendanceTime, setAttendanceTime] = useState<string | null>(null);
            const [attendanceRegistered, setAttendanceRegistered] = useState<boolean>(false);
            const videoRef = useRef<HTMLVideoElement | null>(null);
            const mediaStreamRef = useRef<MediaStream | null>(null);
        ```
# Efecto de Inicio
El efecto de inicio se ejecuta una vez cuando el componente se monta en el DOM. Utiliza la API navigator.mediaDevices.getUserMedia para solicitar acceso a la cámara del dispositivo y obtener una transmisión de video. Luego asigna la transmisión al elemento de video utilizando la referencia videoRef.current. Cuando el componente se desmonta, se detiene la transmisión llamando al método stop en cada pista de la transmisión.

        ```tsx
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

        ```
# Manejo de la Captura de Imagen
La función handleCaptureImage se ejecuta cuando el usuario hace clic en el botón "Capturar foto". Toma una instantánea del video en el elemento de video utilizando el método drawImage del contexto del lienzo. La imagen capturada se convierte a formato de datos URI utilizando el método toDataURL del lienzo. La imagen y la hora actual se registran en el estado del componente utilizando

        ```tsx
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
                formData.append('file', dataUri); // 'file' debe coincidir con el 
                const base64=dataUri.split(',')[1];
                const data={
                    file_format:dataUri.split('/')[1],
                    image_data:base64
                }
                try {
                    const response = await axios.post('http://10.10.214.223:5001/face_rec',data,{
                    headers: {
                        'Content-Type': 'application/json'
                    }
                    })
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
        ```
 A continuación, se muestra un ejemplo de cómo puedes enviar la imagen y la hora actual mediante una solicitud POST utilizando Axios. En este ejemplo, se utiliza un formulario de datos multipartes para enviar la imagen como un archivo adjunto. Sin embargo, también se proporciona un ejemplo de cómo enviar la imagen como datos JSON en el cuerpo de la solicitud.

        ```tsx
            setImageData(dataUri);
            const currentTime = new Date().toLocaleTimeString();
            setAttendanceTime(currentTime);
            setAttendanceRegistered(true);
        ```
En el ejemplo anterior, se realiza una solicitud POST a la URL 'http://10.10.214.223:5001/face_rec' para enviar la imagen capturada al servidor. Puedes modificar esta URL para que coincida con tu endpoint de destino. La imagen se envía como un archivo adjunto en el primer ejemplo utilizando un formulario de datos multipartes, mientras que en el segundo ejemplo se envía como datos JSON en el cuerpo de la solicitud.

        ```tsx
            // Enviar imagen como archivo adjunto utilizando un formulario de datos multipartes
            const formData = new FormData();
            formData.append('file', dataUri); // 'file' debe coincidir con el nombre del campo de archivo en el formulario

            try {
            const response = await axios.post('http://10.10.214.223:5001/face_rec', formData, {
                headers: {
                'Content-Type': 'multipart/form-data',
                },
            });
            console.log('Post OK');
            console.log('Respuesta:', response);
            console.log('Datos de respuesta:', response.data);
            // Puedes manejar la respuesta del servidor aquí si es necesario
            } catch (error) {
            console.error(error);
            }

            // Enviar imagen como datos JSON en el cuerpo de la solicitud
            const base64 = dataUri.split(',')[1];
            const data = {
            file_format: dataUri.split('/')[1],
            image_data: base64,
            };

            try {
            const response = await axios.post('http://10.10.214.223:5001/face_rec', data, {
                headers: {
                'Content-Type': 'application/json',
                },
            });
            console.log('Post OK');
            console.log('Respuesta:', response);
            console.log('Datos de respuesta:', response.data);
            // Puedes manejar la respuesta del servidor aquí si es necesario
            } catch (error) {
            console.error(error);
            }
        ```
# Renderizado del Componente
El componente CaptureAndSend se encarga de renderizar el contenido. Muestra un encabezado "Capturar y enviar foto" y un elemento de video para mostrar la transmisión en vivo de la cámara. Si se ha capturado una imagen (imageData no es nulo), muestra la imagen capturada, la hora de asistencia y un mensaje de "Asistencia registrada". De lo contrario, muestra un botón "Capturar foto" que permite al usuario capturar una imagen.

        ``` tsx
        
        return (
            <div>
                <h1>Capturar y enviar foto</h1>
                <div>
                <video ref={videoRef} autoPlay muted />
                {imageData ? (
                    <div>
                    <img src={imageData} alt="Captured Image" />
                    <p>Hora de asistencia: {attendanceTime}</p>
                    {attendanceRegistered && <p>Asistencia registrada</p>}
                    </div>
                ) : (
                    <button onClick={handleCaptureImage}>Capturar foto</button>
                )}
                </div>
            </div>
            );
        ```




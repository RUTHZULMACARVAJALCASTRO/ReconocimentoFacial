import axios from 'axios';
import React, { useState, useRef, useEffect } from 'react';

const CaptureAndSend = () => {
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
      <p>{prueba}</p>
    </div>
  );
};

export default CaptureAndSend;

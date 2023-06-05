import { ImageList, ImageListItem } from "@mui/material";
import { Key } from "react";


// Cadena Base64 de la imagen
const base64String = "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQEASABIAAD...";

// Crear objeto Image
const img = new Image();

// Asignar la cadena Base64 a la propiedad src del objeto Image
img.src = base64String;

// Escuchar el evento onload
img.onload = function() {
  // La imagen se ha cargado correctamente
  // Puedes acceder a la imagen en formato Image y realizar cualquier operación necesaria
  // Por ejemplo, mostrarla en un elemento <img>

  const imgElement = document.createElement("img");
  imgElement.src = img.src;

  // Agregar el elemento img al DOM para mostrar la imagen
  document.body.appendChild(imgElement);
};
{/* <ImageList variant="masonry" cols={3} gap={8}>
  {itemData.map((item: { img: Key | null | undefined; title: string | undefined; }) => (
    <ImageListItem key={item.img}>
      <img
        src={`${item.img}?w=248&fit=crop&auto=format`}
        srcSet={`${item.img}?w=248&fit=crop&auto=format&dpr=2 2x`}
        alt={item.title}
        loading="lazy"
      />
    </ImageListItem>
  ))}
</ImageList>
export default itemData; */}

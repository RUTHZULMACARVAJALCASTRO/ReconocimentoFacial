import { Button, Icon, Dialog, Grid, TextField } from "@mui/material"
import axios from "axios"
import React, { useEffect, useState } from "react"
import user from "src/store/apps/user"


interface UserData {
    name: string
    lastName: string
    ci: string
    email: string
    phone: string
    address: string
    file: string
    nationality: string
  }
const ViewComponent=(props: { userId: string })=>
{
    const userId=props.userId;
    const[data,setData]=useState<UserData>()
    const [open, setOpen] = useState(false);
  
      const handleClickOpen = () => {
      setOpen(true);
      getData()
    };
    
    const handleClose = () => {
      setOpen(false);
    };

    const getData = async() => {
        await axios
        .get<UserData>(`${process.env.NEXT_PUBLIC_PERSONAL}${userId}`)
        .then(response => {
          setData(response.data)
        })
        .catch(error => {
          console.error(error);
        });
      };
    return(
        <>
        <Button onClick={()=>handleClickOpen()}
                style={{color:'#2ECC40',borderRadius:'10px'}}>
                </Button>
                <Dialog onClose={handleClose} open={open}>
                  <Grid container spacing={.5} style={{paddingLeft: '10px', paddingRight: '10px'}}>
                    <Grid item xs={5}>
                    <h4>Imagen</h4>
                    <TextField variant='standard' value={data?.file}></TextField>
                    </Grid> 
                    <Grid item xs={5}>
                    <h4>Nombre</h4>
                    <TextField variant='standard' value={data?.name}></TextField>
                    </Grid>
                    <Grid item xs={5}>
                      <h4>Apellido</h4>
                    <TextField variant='standard' value={data?.lastName}></TextField>
                    </Grid> 
                    <Grid item xs={5}>
                      <h4>Cédula de Identidad</h4>
                      <TextField variant='standard' value={data?.ci}></TextField>
                    </Grid>  
                    <Grid item xs={5}>
                      <h4>Correo Electronico</h4>
                      <TextField variant='standard' value={data?.email}></TextField>
                    </Grid>
                    <Grid item xs={5}>
                      <h4>Celular</h4>
                      <TextField variant='standard' value={data?.phone}></TextField>
                    </Grid>
                    <Grid item xs={5}>
                      <h4>Direccion</h4>
                      <TextField variant='standard' value={data?.address}></TextField>
                    </Grid>
                    <Grid item xs={5}>
                      <h4>Nacionalidad</h4>
                      <TextField variant='standard' value={data?.nationality}></TextField>
                    </Grid>
                    <Grid item xs={12} textAlign={'center'}>
                      <Button onClick={()=>handleClose()}>Salir</Button>
                    </Grid>
                  </Grid>
                </Dialog>
        </>
    )
}
export default ViewComponent


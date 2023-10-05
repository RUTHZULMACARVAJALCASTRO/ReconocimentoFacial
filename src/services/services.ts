import { apiCall } from './config'
import axios from 'axios'
import { useRouter } from 'next/router'
import { ParsedUrlQuery } from 'querystring'

export const Login = async (data: ParsedUrlQuery) => {
  const options = {
    url: '/central/login-central',
    method: 'POST',
    data: data
  }
  console.log(options)
  return await apiCall(options)
    .then(result => {
      console.log(result)

      return result
    })
    .catch(e => {
      console.log(e)
      throw e
    })

  return
}

export async function Redirect (id:string,token:string){
  if(id!=undefined && token!=undefined) {
    console.log("data: "+id+" "+token)
    const router = useRouter()
    const app = id;
    console.log('app',app)
    console.log('tokennnnnnn',token)
  
      if(app && token){
        try {
          const res = await axios.post(`${process.env.NEXT_PUBLIC_URL_API_CENTRAL}`,{app,token})
          localStorage.setItem('token', res.data)
          const tokenExist = localStorage.getItem('token');
          // delete router.query.id
          // delete router.query.token
         router.replace('http://10.10.214.188:3006/home/');
          if( !tokenExist ) {
            router.push(`${process.env.NEXT_PUBLIC_URL_CENTRAL}/login`)
          }
          
          if(res.status === 401 || res.status === 404 ){
            router.push(`${process.env.NEXT_PUBLIC_URL_CENTRAL}/login`)     
          }
        } catch (error:any) {
          alert(error.response.data.message)
          router.push(`${process.env.NEXT_PUBLIC_URL_CENTRAL}/login`)
        }
      }else{
        router.push(`${process.env.NEXT_PUBLIC_URL_CENTRAL}/login`)
      }
  }
}
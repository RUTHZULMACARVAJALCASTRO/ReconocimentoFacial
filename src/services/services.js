import { apiCall } from './config'

export const Login = async data => {
  const options = {
    url: 'auth/login',
    method: 'POST',
    data: data
  }

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

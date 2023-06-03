import { apiCall } from './config'

export const Login = async data => {
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

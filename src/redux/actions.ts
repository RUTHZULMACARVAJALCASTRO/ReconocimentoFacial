// redux/actions.ts

export const setUsername = (username: string) => {
  return {
    type: 'SET_USERNAME',
    payload: username
  }
}

export const setAge = (age: number) => {
  return {
    type: 'SET_AGE',
    payload: age
  }
}

export const setEmail = (email: string) => {
  return {
    type: 'SET_EMAIL',
    payload: email
  }
}

export const setPassword = (password: string) => {
  return {
    type: 'SET_PASSWORD',
    payload: password
  }
}

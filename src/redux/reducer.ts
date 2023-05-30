// redux/reducer.ts

interface State {
  username: string
  age: number | null
  email: string
  password: string
}

const initialState: State = {
  username: '',
  age: null,
  email: '',
  password: ''
}

const rootReducer = (state = initialState, action: any) => {
  switch (action.type) {
    case 'SET_USERNAME':
      return {
        ...state,
        username: action.payload
      }
    case 'SET_AGE':
      return {
        ...state,
        age: action.payload
      }
    case 'SET_EMAIL':
      return {
        ...state,
        email: action.payload
      }
    case 'SET_PASSWORD':
      return {
        ...state,
        password: action.payload
      }
    default:
      return state
  }
}

export default rootReducer

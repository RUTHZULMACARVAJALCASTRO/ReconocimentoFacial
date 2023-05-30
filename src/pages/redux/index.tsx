// pages/index.tsx

import React, { ChangeEvent, FormEvent } from 'react'
import { connect } from 'react-redux'
import { setUsername } from 'src/redux/actions'
import styled from 'styled-components'

interface Props {
  usernameFromRedux: string
  setUsername: (username: string) => void
}

interface State {
  username: string
  age: string
  email: string
  password: string
  errors: {
    username: string
    age: string
    email: string
    password: string
  }
}

const FormContainer = styled.div`
  max-width: 400px;
  margin: 0 auto;
  padding: 20px;
  background-color: #f5f5f5;
  border-radius: 4px;
`

const FormField = styled.div`
  margin-bottom: 10px;
`

const Label = styled.label`
  display: block;
  font-weight: bold;
`

const Input = styled.input`
  width: 100%;
  padding: 8px;
  font-size: 16px;
  border: 1px solid #ccc;
  border-radius: 4px;
`

const ErrorMsg = styled.p`
  margin: 5px 0;
  color: red;
`

class MyForm extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = {
      username: '',
      age: '',
      email: '',
      password: '',
      errors: {
        username: '',
        age: '',
        email: '',
        password: ''
      }
    }
  }

  handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    this.setState(prevState => ({
      ...prevState,
      [name]: value,
      errors: {
        ...prevState.errors,
        [name]: ''
      }
    }))
  }

  handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const { username, age, email, password } = this.state
    const { setUsername } = this.props
    const errors = this.validateForm()

    if (Object.keys(errors).length > 0) {
      this.setState({ errors })
    } else {
      setUsername(username)
      this.setState({
        username: '',
        age: '',
        email: '',
        password: '',
        errors: {
          username: '',
          age: '',
          email: '',
          password: ''
        }
      })
    }
  }

  validateForm = () => {
    const { username, age, email, password } = this.state
    const errors: any = {}

    if (!username) {
      errors.username = 'Username is required'
    }

    if (!age) {
      errors.age = 'Age is required'
    } else if (isNaN(Number(age))) {
      errors.age = 'Age must be a number'
    } else if (Number(age) < 18) {
      errors.age = 'You must be at least 18 years old'
    }

    if (!email) {
      errors.email = 'Email is required'
    } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(email)) {
      errors.email = 'Invalid email address'
    }

    if (!password) {
      errors.password = 'Password is required'
    } else if (password.length < 6) {
      errors.password = 'Password must be at least 6 characters long'
    }

    return errors
  }

  render() {
    const { username, age, email, password, errors } = this.state
    const { usernameFromRedux } = this.props

    return (
      <FormContainer>
        <form onSubmit={this.handleSubmit}>
          <FormField>
            <Label>Username:</Label>
            <Input type='text' name='username' value={username} onChange={this.handleChange} />
            {errors.username && <ErrorMsg>{errors.username}</ErrorMsg>}
          </FormField>

          <FormField>
            <Label>Age:</Label>
            <Input type='number' name='age' value={age} onChange={this.handleChange} />
            {errors.age && <ErrorMsg>{errors.age}</ErrorMsg>}
          </FormField>

          <FormField>
            <Label>Email:</Label>
            <Input type='email' name='email' value={email} onChange={this.handleChange} />
            {errors.email && <ErrorMsg>{errors.email}</ErrorMsg>}
          </FormField>

          <FormField>
            <Label>Password:</Label>
            <Input type='password' name='password' value={password} onChange={this.handleChange} />
            {errors.password && <ErrorMsg>{errors.password}</ErrorMsg>}
          </FormField>

          <button type='submit'>Submit</button>
        </form>

        <p>Username from Redux: {usernameFromRedux}</p>
      </FormContainer>
    )
  }
}

const mapStateToProps = (state: any) => {
  return {
    usernameFromRedux: state.username
  }
}

const mapDispatchToProps = {
  setUsername
}

export default connect(mapStateToProps, mapDispatchToProps)(MyForm)

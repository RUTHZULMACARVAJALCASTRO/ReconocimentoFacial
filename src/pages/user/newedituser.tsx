import axios from 'axios';
import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';


interface UserData {
    name: string
    lastName: string
    ci: string
    email: string
    phone: string
    direction: string
    nationality: string
  }
const EditUserPage = () => {
  const router = useRouter();
  const { id } = router.query;
  const [user,setUser]=useState<UserData>({
    name: '',
    lastName: '',
    ci: '',
    email: '',
    phone: '',
    direction: '',
    nationality: '',
  });
  
  const{name,lastName,ci,email,phone,direction,nationality}=user
  const onInputChange=(e:React.ChangeEvent<HTMLInputElement>)=>{
    setUser({...user,[e.target.name]:e.target.value})
  }
  const getData = async() => {
    await axios
      .get<UserData>(`${process.env.NEXT_PUBLIC_PERSONAL}${id}`)
      .then(response => {
        console.log(response.data)
        setUser(response.data)
      })
      .catch(error => {
        console.error(error);
      });
  };
  const OnSubmit=async(e:React.FormEvent)=>{
    e.preventDefault();
    console.log(user)
    await axios.put(`${process.env.NEXT_PUBLIC_PERSONAL}${id}`, user);
  }
  useEffect(() => {
    if (id) {
      getData();
    }
  }, [id]);
  return (
    <div>
      <h1>Edit User: {id}</h1>
      <form onSubmit={(e:React.FormEvent)=>OnSubmit(e)}>
        <label>
          Name:
          <input
            type="text"
            name="name"
            value={user.name}
            onChange={onInputChange}
          />
        </label>
        <label>
          Last Name:
          <input
            type="text"
            name="lastName"
            value={user.lastName}
            onChange={onInputChange}
          />
        </label>
        <label>
          CI:
          <input
            type="text"
            name="ci"
            value={user.ci}
            onChange={onInputChange}
          />
        </label>
        <label>
          Email:
          <input
            type="text"
            name="email"
            value={user.email}
            onChange={onInputChange}
          />
        </label>
        <label>
          Phone:
          <input
            type="text"
            name="phone"
            value={user.phone}
            onChange={onInputChange}
          />
        </label>
        <label>
          Direction:
          <input
            type="text"
            name="direction"
            value={user.direction}
            onChange={onInputChange}
          />
        </label>
        <label>
          Nationality:
          <input
            type="text"
            name="nationality"
            value={user.nationality}
            onChange={onInputChange}
          />
        </label>
        <button type="submit">Update User</button>
      </form>
    </div>
  );
}

export default EditUserPage;

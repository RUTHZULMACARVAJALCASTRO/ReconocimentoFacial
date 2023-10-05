// redux/reducer.ts

import { PayloadAction, createSlice } from "@reduxjs/toolkit";

interface UserData {
	name: string;
	lastName: string;
	ci: string;
	email: string;
	phone: string;
	address: string;
	file: string;
	nationality: string;
	unity: string;
	charge: string;
	schedule: string;
}

const initialState: UserData = {
  name: '',
	lastName: '',
	ci: '',
	email: '',
	phone: '',
	address: '',
	nationality: '',
	unity: '',
	charge: '',
	schedule: '',
	file: ''
}

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<UserData>) => {
      // Esto simplemente reemplazará el estado actual con los datos del usuario proporcionados
      return action.payload;
    },
	
  }
});
export const { setUser } = userSlice.actions;
export default userSlice.reducer;

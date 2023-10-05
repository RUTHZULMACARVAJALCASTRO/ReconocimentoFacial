import { createSlice, PayloadAction, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { ThemeColor } from 'src/@core/layouts/types';
import { Docu } from 'src/pages/user/usuario/userlist';

export interface UserData {
  name: string;
  lastName: string;
  ci: string;
  email: string;
  phone: string;
  address: string;
  nationality: string;
  unity: string;
  charge: string;
  schedule: string;
  file: string;
  // _id?: string;
  // isActive?: boolean;
}

interface UserState {
  data: UserData | null;
  list: Docu[];
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  totalPages: number;
  paginatedUsers: Docu[];
  error: string | null 
}

interface FetchUsersByPageArg {
  page: number;
  pageSize: number;
}

interface PaginationResponse {
  data: Docu[];
  total: number;
  totalPages: number;
}


const initialState: UserState = {
  data: null,
  list: [],
  paginatedUsers: [] as Docu[],
  status: 'idle',
  totalPages: 0,
  error: null
};

// type PartialUserData = Partial<UserData>;

// Thunk para agregar usuario
// export const addUser = createAsyncThunk(
//   'users/addUser',
//   async (userData: UserData) => {
//     const response = await axios.post(`${process.env.NEXT_PUBLIC_PERSONAL}`, userData);
//     return response.data;
//   }
// );
export const addUser = createAsyncThunk(
  'users/addUser',
  async (userData: UserData, { rejectWithValue }) => {
    try {
      const response = await axios.post(`${process.env.NEXT_PUBLIC_PERSONAL}`, userData);
      return response.data;
    } catch (error: any) {
      if (error.response && error.response.data && error.response.data.message) {
        // Rechazar con el mensaje de error del servidor
        return rejectWithValue(error.response.data.message);
      }
      // Rechazar con un mensaje de error general
      return rejectWithValue(error.message);
    }
  }
);


export const fetchUsers = createAsyncThunk(
  'users/fetchUsers',
  async (): Promise<Docu[]> => {
    const response = await axios.get(`${process.env.NEXT_PUBLIC_PERSONAL}`);
    return response.data;
  }
);

export const fetchUsersByPage = createAsyncThunk<PaginationResponse, FetchUsersByPageArg, {}>(
  'users/fetchUsersByPage',
  async ({ page, pageSize }) => {
    const response = await axios.get(`${process.env.NEXT_PUBLIC_PERSONAL}pagination?page=${page}&limit=${pageSize}`);
    return response.data;
  }
);

export const editUser = createAsyncThunk(
  'users/editUser',
  async (updatedUser: Docu): Promise<Docu> => {
    // if (!updatedUser._id) {
    //   throw new Error('Se requiere el ID del usuario para actualizar');
    // }
    const response = await axios.put(`${process.env.NEXT_PUBLIC_PERSONAL}edit/${updatedUser._id}`, updatedUser);

    if (!response.data || response.status !== 200) {
      throw new Error('Error al actualizar el personal');
    }
    return response.data;
  }
);

export const toggleUserStatus = createAsyncThunk(
  'users/toggleActivation',
  async ({ userId, isActive }: { userId: string; isActive: boolean }): Promise<Docu> => {
    const response = await axios.put(`${process.env.NEXT_PUBLIC_PERSONAL}edit/${userId}`, { isActive: isActive });

    if (!response.data || response.status !== 200) {
      throw new Error('Error al cambiar el estado de activación del persoanl');
    }
    return response.data;
  }
);

const userSlice = createSlice({
  name: 'users',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(addUser.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(addUser.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.list.push(action.payload);
        state.data = action.payload;
      })
      .addCase(addUser.rejected, (state: any, action) => {
        state.status = 'failed';
        state.error = action.payload;
      })
      .addCase(fetchUsers.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchUsers.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.list = action.payload;
      })
      .addCase(fetchUsers.rejected, (state: any, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      })
      .addCase(fetchUsersByPage.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchUsersByPage.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.paginatedUsers = action.payload.data;
        state.totalPages = action.payload.totalPages;
      })
      .addCase(fetchUsersByPage.rejected, (state: any, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      })
      .addCase(editUser.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(editUser.fulfilled, (state, action: PayloadAction<Docu>) => {
        state.status = 'succeeded';
        const index = state.list.findIndex(user => user._id === action.payload._id);
        if (index !== -1) {
          state.list[index] = action.payload;
        }
        state.data = action.payload;
      })
      .addCase(editUser.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message || null;
      })
      .addCase(toggleUserStatus.pending, (state) => {
        state.status = 'loading';
    })
    .addCase(toggleUserStatus.fulfilled, (state, action: PayloadAction<Docu>) => {
        state.status = 'succeeded';
        const index = state.list.findIndex(user => user._id === action.payload._id);
        if (index !== -1) {
            state.list[index] = action.payload;  // Asumiendo que la respuesta del servidor contiene el cargo actualizado
        }
    })
    .addCase(toggleUserStatus.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message || null;
    });
  }
});

export default userSlice.reducer;
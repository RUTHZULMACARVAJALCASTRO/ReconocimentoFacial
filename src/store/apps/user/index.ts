import { createSlice, PayloadAction, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
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
}

interface UserState {
  data: UserData | null;
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  pageSize: number;
  currentPage: number;
  paginatedUsers: Docu[];
  error: string | null,
}

interface FetchUsersByPageArg {
  page: number;
  pageSize: number;
  name?: string;
  lastName?: string;
  ci?: string;
  email?: string;
  phone?: string;
  address?: string;
  nationality?: string;
  isActive?: string;
}

interface PaginationResponse {
  data: Docu[];
  total: number;
  totalPages: number;
}

const initialState: UserState = {
  data: null,
  paginatedUsers: [],
  status: 'idle',
  pageSize: 0,
  currentPage: 1,
  error: null,
};

export const addUser = createAsyncThunk(
  'users/addUser',
  async (userData: UserData, { rejectWithValue }) => {
    try {
      const response = await axios.post(`${process.env.NEXT_PUBLIC_PERSONAL}`, userData);
      return response.data;
    } catch (error: any) {
      if (error.response && error.response.data && error.response.data.message) {
   
        return rejectWithValue(error.response.data.message);
      }
      
      return rejectWithValue(error.message);
    }
  }
);


export const fetchUsersByPage = createAsyncThunk<PaginationResponse, FetchUsersByPageArg, {}>(
  'users/fetchUsersByPage',
  async ({ page, pageSize, ...filters }) => {
    const params: { [key: string]: string } = {
      page: page.toString(),
      limit: pageSize.toString()
    };

    Object.keys(filters).forEach(key => {
      const value = (filters as any)[key];
      if (value !== undefined && value !== null && value !== '') {
        params[key] = value.toString();
      }
    });

    console.log( filters );
    const queryString = new URLSearchParams(params);
    console.log(`Sending request with params: ${queryString}`);
   

    const response = await axios.get(`${process.env.NEXT_PUBLIC_PERSONAL}filtered?${queryString}`);
    return response.data;
  }
);

export const editUser = createAsyncThunk(
  'users/editUser',
  async (updatedUser: Docu, { rejectWithValue }) => {
    try {
      const response = await axios.put(`${process.env.NEXT_PUBLIC_PERSONAL}edit/${updatedUser._id}`, updatedUser);
      if (!response.data || response.status !== 200) {
        throw new Error('Error al actualizar el personal');
      }
      return response.data;
    } catch (error: any) {
      console.log('entra al error');
      if (error.response && error.response.data && error.response.data.message) {
        console.log( error.response.data.message )
        return rejectWithValue(error.response.data.message);
      }
      console.log(error.message )
      return rejectWithValue(error.message);
    }
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
      .addCase(addUser.pending, (state, action) => {
        state.status = 'loading';
      })
      .addCase(addUser.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.paginatedUsers.push(action.payload);
        state.data = action.payload;
      })
      .addCase(addUser.rejected, (state: any, action) => {
        state.status = 'failed';
        state.error = action.payload;
      })
      .addCase(fetchUsersByPage.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchUsersByPage.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.paginatedUsers = action.payload.data;
        state.pageSize = action.payload.totalPages;
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
        const index = state.paginatedUsers.findIndex(user => user._id === action.payload._id);
        if (index !== -1) {
          state.paginatedUsers[index] = action.payload;
        }
        state.data = action.payload;
      })
      .addCase(editUser.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message || null;
      })
      .addCase(toggleUserStatus.pending, (state, action ) => {
        state.status = 'loading';
        const user = state.paginatedUsers.find(user => user._id === action.meta.arg.userId);
        if (user) {
          user.isActive = !user.isActive; 
        }
      })
      .addCase(toggleUserStatus.fulfilled, (state, action: PayloadAction<Docu>) => {
        state.status = 'succeeded';
        const index = state.paginatedUsers.findIndex(user => user._id === action.payload._id);
        if (index !== -1) {
            state.paginatedUsers[index] = action.payload; 
        }
      })
      .addCase(toggleUserStatus.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message || null;
        const user = state.paginatedUsers.find(user => user._id === action.meta.arg.userId);
        if (user) {
          user.isActive = !user.isActive; 
        }
      });
    }
});

export default userSlice.reducer;
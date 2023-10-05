import { createSlice, PayloadAction, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { ThemeColor } from 'src/@core/layouts/types';
import { Docu } from 'src/pages/user/charges/ChargeList';

export interface ChargeData {
    name: string;
    description: string;
}

interface ChargeState {
    data: ChargeData | null;
    list: Docu[];
    status: 'idle' | 'loading' | 'succeeded' | 'failed';
    error: string | null;
}

const initialState: ChargeState = {
    data: null,
    list: [],
    status: 'idle',
    error: null
};

// Thunk para agregar usuario

export const addCharge = createAsyncThunk(
    'charges/addCharge',
    async (charge: ChargeData, { rejectWithValue }) => {
        try {
            const response = await axios.post(`${process.env.NEXT_PUBLIC_PERSONAL_CHARGE}`, charge); return response.data;
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

export const fetchCharges = createAsyncThunk(
    'charges/fetchCharges',
    async (): Promise<Docu[]> => {
        const response = await axios.get(`${process.env.NEXT_PUBLIC_PERSONAL_CHARGE}`);
        return response.data;
    }
);

export const editCharge = createAsyncThunk(
    'charges/editCharge',
    async (updatedCharge: Docu): Promise<Docu> => {
        const response = await axios.put(`${process.env.NEXT_PUBLIC_PERSONAL_CHARGE}${updatedCharge._id}`, updatedCharge);

        if (!response.data || response.status !== 200) {
            throw new Error('Error al actualizar el cargo');
        }

        return response.data;
    }
);

export const toggleChargeStatus = createAsyncThunk(
    'charges/toggleActivation',
    async ({ chargeId, isActive }: { chargeId: string; isActive: boolean }): Promise<Docu> => {
        const response = await axios.put(`${process.env.NEXT_PUBLIC_PERSONAL_CHARGE}${chargeId}`, { isActive: isActive });

        if (!response.data || response.status !== 200) {
            throw new Error('Error al cambiar el estado de activación del cargo');
        }

        return response.data;
    }
);

const chargeSlice = createSlice({
    name: 'charges',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(addCharge.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(addCharge.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.list.push(action.payload);
                state.data = action.payload;
            })
            .addCase(addCharge.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.error.message || null;
            })
            .addCase(fetchCharges.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(fetchCharges.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.list = action.payload;
            })
            .addCase(fetchCharges.rejected, (state: any, action) => {
                state.status = 'failed';
                state.error = action.error.message;
            })

            .addCase(editCharge.pending, (state) => {
                state.status = 'loading';
            })

            .addCase(editCharge.fulfilled, (state, action: PayloadAction<Docu>) => {
                state.status = 'succeeded';
                const index = state.list.findIndex(charge => charge._id === action.payload._id);
                if (index !== -1) {
                    state.list[index] = action.payload;
                }
            })
            .addCase(editCharge.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.error.message || null;
            })

            .addCase(toggleChargeStatus.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(toggleChargeStatus.fulfilled, (state, action: PayloadAction<Docu>) => {
                state.status = 'succeeded';
                const index = state.list.findIndex(charge => charge._id === action.payload._id);
                if (index !== -1) {
                    state.list[index] = action.payload;  // Asumiendo que la respuesta del servidor contiene el cargo actualizado
                }
            })
            .addCase(toggleChargeStatus.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.error.message || null;
            });
    }
});

export default chargeSlice.reducer;
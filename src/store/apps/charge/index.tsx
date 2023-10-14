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
    findPaginateCharges: Docu[],
    status: 'idle' | 'loading' | 'succeeded' | 'failed';
    pageSize: number;
    currentPage: number;
    paginatedCharges: Docu[];
    error: string | null;
}

interface FetchChargesByPageArg {
    page: number;
    pageSize: number;
    name?: string;
    description?: string;
    isActive?: string;

}

interface PaginationResponse {
    data: Docu[];
    total: number;
    totalPages: number;
}

interface Filters {
    name?: string;
    description?: string;
    isActive?: string;
    page?: number;
    pageSize?: number;
}

const initialState: ChargeState = {
    data: null,
    list: [],
    findPaginateCharges: [],
    paginatedCharges: [] as Docu[],
    status: 'idle',
    pageSize: 0,
    currentPage: 1,
    error: null
};



export const addCharge = createAsyncThunk(
    'charges/addCharge',
    async (charge: ChargeData, { rejectWithValue }) => {
        try {
            const response = await axios.post(`${process.env.NEXT_PUBLIC_PERSONAL_CHARGE}`, charge);
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

export const fetchCharges = createAsyncThunk(
    'charges/fetchCharges',
    async (): Promise<Docu[]> => {
        const response = await axios.get(`${process.env.NEXT_PUBLIC_PERSONAL_CHARGE}`);
        return response.data;
    }
);

export const fetchChargesByPage = createAsyncThunk<PaginationResponse, FetchChargesByPageArg, {}>(
    'users/fetchChargesByPage',
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

        console.log(filters);
        const queryString = new URLSearchParams(params);
        console.log(`Sending request with params: ${queryString}`);

        const response = await axios.get(`${process.env.NEXT_PUBLIC_PERSONAL_CHARGE}filtered?${queryString}`);
        return response.data;
    }
);
export const fetchFilteredCharges = createAsyncThunk(
    'users/fetchFilteredCharges',
    async (filters: Filters, { rejectWithValue }) => {
        try {
            const cleanedFilters: Filters = Object.fromEntries(
                Object.entries(filters).filter(([key, value]) => value !== undefined && value !== '')
            );

            const response = await axios.get(`${process.env.NEXT_PUBLIC_PERSONAL_CHARGE}filtered`, {
                params: {
                    ...cleanedFilters,
                    page: cleanedFilters.page,
                    pageSize: cleanedFilters.pageSize
                }
            });

            if (response.data && response.data.data) {
                return response.data  // Retorna solo el arreglo "data" si deseas
            } else {
                throw new Error('Respuesta malformada del servidor');
            }
        } catch (error: any) {
            if (error.response && error.response.data && error.response.data.message) {
                return rejectWithValue(error.response.data.message);
            }
            return rejectWithValue(error.message);
        }
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
)

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
                state.paginatedCharges.push(action.payload);
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
            .addCase(fetchChargesByPage.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(fetchChargesByPage.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.paginatedCharges = action.payload.data;
                state.pageSize = action.payload.totalPages;
            })
            .addCase(fetchChargesByPage.rejected, (state: any, action) => {
                state.status = 'failed';
                state.error = action.error.message;
            })
            .addCase(fetchFilteredCharges.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(fetchFilteredCharges.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.paginatedCharges = action.payload;  // Asumiendo que deseas almacenar la lista filtrada en "list". Si no, usa otra clave del estado.
                state.pageSize = action.payload.totalPages;
            })
            .addCase(fetchFilteredCharges.rejected, (state: any, action) => {
                state.status = 'failed';
                state.error = action.payload;
            })
            .addCase(editCharge.pending, (state) => {
                state.status = 'loading';
            })

            .addCase(editCharge.fulfilled, (state, action: PayloadAction<Docu>) => {
                state.status = 'succeeded';
                const index = state.paginatedCharges.findIndex(charge => charge._id === action.payload._id);
                if (index !== -1) {
                    state.paginatedCharges[index] = action.payload;
                }
                state.data = action.payload;
            })

            .addCase(editCharge.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.error.message || null;
            })

            .addCase(toggleChargeStatus.pending, (state, action) => {
                state.status = 'loading';
                const charge = state.paginatedCharges.find(charge => charge._id === action.meta.arg.chargeId);
                if (charge) {
                    charge.isActive = !charge.isActive; // Invertir el estado
                }
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
                const charge = state.paginatedCharges.find(charge => charge._id === action.meta.arg.chargeId);
                if (charge) {
                    charge.isActive = !charge.isActive;
                }
            });
    }
});

export default chargeSlice.reducer;
// export const { setCurrentPage } = chargeSlice.actions;
import { createSlice, PayloadAction, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { rootReducer } from 'src/store';
import schedule from '../schedule';
import { AsignacionLicencia } from 'src/pages/user/permisos_y_licencias/licencias/licenseList';

export interface LicenseData {
    personal: string;
    licenseType: string;
    description: string;
    startDate: Date;
    endDate: Date;
}

interface LicenseState {
    data: LicenseData | null;
    list: AsignacionLicencia[];
    findPaginateLicenses: AsignacionLicencia[],
    status: 'idle' | 'loading' | 'succeeded' | 'failed'
    pageSize: number;
    currentPage: number;
    paginatedLicenses: AsignacionLicencia[];
    currentFilters: Filters;
    error: string | null;
}

interface FetchLicensesByPageArg {
    page: number;
    pageSize: number;
    personal?: string;
    licenseType?: string;
    description?: string;
    startDate?: string;
    endDate?: string;
    isActive?: boolean;
}

interface PaginationResponse {
    data: AsignacionLicencia[];
    total: number;
    totalPages: number;
}

interface Filters {
    licenseType?: string;
    isActive?: boolean;
    page?: number;
    pageSize?: number;
}

const initialState: LicenseState = {
    data: null,
    list: [],
    findPaginateLicenses: [],
    paginatedLicenses: [] as AsignacionLicencia[],
    status: 'idle',
    pageSize: 0,
    currentPage: 1,
    currentFilters: {},
    error: null
};

export const addLicense = createAsyncThunk(
    'license/addLicense',
    async (license: LicenseData, { rejectWithValue }) => {
        try {
            const response = await axios.post(`${process.env.NEXT_PUBLIC_PERSONAL_LICENSE}`, license);
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

export const fetchLicense = createAsyncThunk(
    'License/fetchLicense',
    async (): Promise<AsignacionLicencia[]> => {
        const response = await axios.get(`${process.env.NEXT_PUBLIC_PERSONAL_LICENSE}`);
        return response.data;
    }
);

export const fetchLicensesByPage = createAsyncThunk<PaginationResponse, FetchLicensesByPageArg, {}>(
    'licenses/fetchLicensesByPage',
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

        const queryString = new URLSearchParams(params);

        const response = await axios.get(`${process.env.NEXT_PUBLIC_PERSONAL_LICENSE}filtered?${queryString}`);
        return response.data;
    }
);

export const fetchFilteredLicenses = createAsyncThunk(
    'licenses/fetchFilteredLicenses',
    async (filters: Filters, { rejectWithValue }) => {
        try {
            const cleanedFilters: Filters = Object.fromEntries(
                Object.entries(filters).filter(([key, value]) => value !== undefined && value !== '')
            );

            const response = await axios.get(`${process.env.NEXT_PUBLIC_PERSONAL_LICENSE}filtered`, {
                params: {
                    ...cleanedFilters,
                    page: cleanedFilters.page,
                    pageSize: cleanedFilters.pageSize
                }
            });

            if (response.data && response.data.data) {
                return response.data
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

export const editLicense = createAsyncThunk(
    'licenses/editLicense',
    async (updatedLicense: AsignacionLicencia): Promise<AsignacionLicencia> => {
        const response = await axios.put(`${process.env.NEXT_PUBLIC_PERSONAL_LICENSE}${updatedLicense._id}`, updatedLicense);

        if (!response.data || response.status !== 200) {
            throw new Error('Error al actualizar la licencia');
        }

        return response.data;
    }
);

export const toggleLicenseStatus = createAsyncThunk(
    'licenses/toggleActivation',
    async ({ licenseId, isActive }: { licenseId: string; isActive: boolean }): Promise<AsignacionLicencia> => {
        const response = await axios.put(`${process.env.NEXT_PUBLIC_PERSONAL_LICENSE}${licenseId}`, { isActive: isActive });

        if (!response.data || response.status !== 200) {
            throw new Error('Error al cambiar el estado de activación del cargo');
        }
        return response.data;
    }
)

const licenseSlice = createSlice({
    name: 'licenses',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(addLicense.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(addLicense.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.paginatedLicenses.push(action.payload);
                state.data = action.payload;
            })
            .addCase(addLicense.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.error.message || null;
            })
            .addCase(fetchLicense.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(fetchLicense.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.list = action.payload;
            })
            .addCase(fetchLicense.rejected, (state: any, action) => {
                state.status = 'failed';
                state.error = action.error.message;
            })
            .addCase(fetchLicensesByPage.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(fetchLicensesByPage.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.paginatedLicenses = action.payload.data;
                state.pageSize = action.payload.totalPages;
                state.currentFilters = action.meta.arg;
            })
            .addCase(fetchLicensesByPage.rejected, (state: any, action) => {
                state.status = 'failed';
                state.error = action.error.message;
            })
            .addCase(editLicense.pending, (state) => {
                state.status = 'loading';
            })

            .addCase(editLicense.fulfilled, (state, action: PayloadAction<AsignacionLicencia>) => {
                state.status = 'succeeded';
                const index = state.paginatedLicenses.findIndex(license => license._id === action.payload._id);
                if (index !== -1) {
                    state.paginatedLicenses[index] = action.payload;
                }
                //state.data = action.payload;
            })

            .addCase(editLicense.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.error.message || null;
            })

            .addCase(toggleLicenseStatus.pending, (state, action) => {
                state.status = 'loading';
                const license = state.paginatedLicenses.find(license => license._id === action.meta.arg.licenseId);
                if (license) {
                    license.isActive = !license.isActive; // Invertir el estado
                }
            })
            .addCase(toggleLicenseStatus.fulfilled, (state, action: PayloadAction<AsignacionLicencia>) => {
                state.status = 'succeeded';
                const index = state.list.findIndex(license => license._id === action.payload._id);
                if (index !== -1) {
                    state.list[index] = action.payload;  // Asumiendo que la respuesta del servidor contiene el cargo actualizado
                }
            })
            .addCase(toggleLicenseStatus.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.error.message || null;
                const license = state.paginatedLicenses.find(license => license._id === action.meta.arg.licenseId);
                if (license) {
                    license.isActive = !license.isActive;
                }
            });
    }
});

export default licenseSlice.reducer;

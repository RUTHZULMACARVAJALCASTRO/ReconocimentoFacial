import { createSlice, PayloadAction, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { AsignacionLicencia } from 'src/pages/user/permisos_y_licencias/licencias/licenseList';

export interface LicenseData {
    personal: string | null;
    licenseType: string;
    description: string;
    startDate: Date;
    endDate: Date;
}

interface LicenseState {
    data: LicenseData | null;
    status: 'idle' | 'loading' | 'succeeded' | 'failed'
    pageSize: number;
    currentPage: number;
    paginatedLicenses: AsignacionLicencia[];
    error: string | null;
}

interface FetchLicensesByPageArg {
    page: number;
    pageSize: number;
    personal?: string | null;
    licenseType?: string;
    description?: string;
    startDate?: Date;
    endDate?: Date;
    isActive?: boolean;
}

interface PaginationResponse {
    data: AsignacionLicencia[];
    total: number;
    totalPages: number;
}

const initialState: LicenseState = {
    data: null,
    paginatedLicenses: [] as AsignacionLicencia[],
    status: 'idle',
    pageSize: 0,
    currentPage: 1,
    error: null
};

export const addLicense = createAsyncThunk(
    'license/addLicense',
    async (license: LicenseData, { rejectWithValue }) => {
        try {
            const response = await axios.post(`${process.env.NEXT_PUBLIC_PERSONAL_LICENCIA}`, license);
            return response.data;
        } catch (error: any) {
            if (error.response && error.response.data && error.response.data.message) {

                return rejectWithValue(error.response.data.message);
            }

            return rejectWithValue(error.message);
        }
    }
);

export const fetchLicense = createAsyncThunk(
    'License/fetchLicense',
    async (): Promise<AsignacionLicencia[]> => {
        const response = await axios.get(`${process.env.NEXT_PUBLIC_PERSONAL_LICENCIA}`);
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

        const response = await axios.get(`${process.env.NEXT_PUBLIC_PERSONAL_LICENCIA}filtered?${queryString}`);
        return response.data;
    }
);


export const editLicense = createAsyncThunk(
    'licenses/editLicense',
    async (updatedLicense: AsignacionLicencia): Promise<AsignacionLicencia> => {
        const response = await axios.put(`${process.env.NEXT_PUBLIC_PERSONAL_LICENCIA}${updatedLicense._id}`, updatedLicense);

        if (!response.data || response.status !== 200) {
            throw new Error('Error al actualizar la licencia');
        }

        return response.data;
    }
);

export const toggleLicenseStatus = createAsyncThunk(
    'licenses/toggleActivation',
    async ({ licenseId, isActive }: { licenseId: string; isActive: boolean }): Promise<AsignacionLicencia> => {
        const response = await axios.put(`${process.env.NEXT_PUBLIC_PERSONAL_LICENCIA}${licenseId}`, { isActive: isActive });

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
            .addCase(addLicense.rejected, (state: any, action) => {
                state.status = 'failed';
                state.error = action.error.message || null;
            })
            .addCase(fetchLicensesByPage.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(fetchLicensesByPage.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.paginatedLicenses = action.payload.data;
                state.pageSize = action.payload.totalPages;
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
                    license.isActive = !license.isActive;
                }
            })
            .addCase(toggleLicenseStatus.fulfilled, (state, action: PayloadAction<AsignacionLicencia>) => {
                state.status = 'succeeded';
                const index = state.paginatedLicenses.findIndex(license => license._id === action.payload._id);
                if (index !== -1) {
                    state.paginatedLicenses[index] = action.payload;
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

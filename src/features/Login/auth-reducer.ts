import {setAppStatusAC} from '../../app/app-reducer';
import {authAPI, FieldErrorType, LoginParamType, ResultCode} from '../../api/todolists-api';
import {handleServerAppError, handleServerNetworkError} from '../../utils/error-utils';
import {AxiosError} from 'axios';
import {createAsyncThunk, createSlice, PayloadAction} from '@reduxjs/toolkit';
import {clearTasksAndTodolists} from '../../common/actions/common.actions';

export const logInTC = createAsyncThunk<undefined, LoginParamType, {
    rejectValue: { errors: string[]; fieldsErrors?: FieldErrorType[] }
}>('auth/login', async (param, thunkAPI) => {
    thunkAPI.dispatch(setAppStatusAC({status: 'loading'}));

    try {
        const res = await authAPI.logIn(param);

        if (res.data.resultCode === ResultCode.OK) {
            thunkAPI.dispatch(setAppStatusAC({status: 'succeeded'}));
            return;
        } else {
            handleServerAppError(res.data, thunkAPI.dispatch);
            return thunkAPI.rejectWithValue({errors: res.data.messages, fieldsErrors: res.data.fieldsErrors});
        }
    } catch (e) {
        const error = e as AxiosError;
        handleServerNetworkError(error.message, thunkAPI.dispatch);
        return thunkAPI.rejectWithValue({errors: [error.message], fieldsErrors: undefined});
    }
});

export const logOutTC = createAsyncThunk('auth/logout', async (_, thunkAPI) => {
    thunkAPI.dispatch(setAppStatusAC({status: 'loading'}));

    try {
        const res = await authAPI.logOut();

        if (res.data.resultCode === ResultCode.OK) {
            thunkAPI.dispatch(clearTasksAndTodolists());
            thunkAPI.dispatch(setAppStatusAC({status: 'succeeded'}));
            return;
        } else {
            handleServerAppError(res.data, thunkAPI.dispatch);
            return thunkAPI.rejectWithValue({});
        }
    } catch (e) {
        const error = e as AxiosError;
        handleServerNetworkError(error.message, thunkAPI.dispatch);
        return thunkAPI.rejectWithValue({});
    }
});

const slice = createSlice({
    name: 'auth',
    initialState: {
        isLoggedIn: false,
    },
    reducers: {
        setIsLoggedInAC(state, action: PayloadAction<{ isLoggedIn: boolean }>) {
            state.isLoggedIn = action.payload.isLoggedIn;
        },
    },
    extraReducers: builder => {
        builder.addCase(logInTC.fulfilled, (state) => {
            state.isLoggedIn = true;
        });
        builder.addCase(logOutTC.fulfilled, (state) => {
            state.isLoggedIn = false;
        });
    },
});

export const authReducer = slice.reducer;
export const {setIsLoggedInAC} = slice.actions;

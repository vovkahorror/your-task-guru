import {Dispatch} from 'redux';
import {setAppStatusAC} from '../../app/app-reducer';
import {authAPI, LoginType, ResultCode} from '../../api/todolists-api';
import {handleServerAppError, handleServerNetworkError} from '../../utils/error-utils';
import {isAxiosError} from 'axios';
import {createAsyncThunk, createSlice, PayloadAction} from '@reduxjs/toolkit';
import {clearTasksAndTodolists} from '../../common/actions/common.actions';

export const logInTC = createAsyncThunk('auth/login', async (data: LoginType, thunkAPI) => {
    thunkAPI.dispatch(setAppStatusAC({status: 'loading'}));

    try {
        const res = await authAPI.logIn(data);

        if (res.data.resultCode === ResultCode.OK) {
            thunkAPI.dispatch(setAppStatusAC({status: 'succeeded'}));
            return {isLoggedIn: true};
        } else {
            handleServerAppError(res.data, thunkAPI.dispatch);
            return {isLoggedIn: false};
        }
    } catch (e) {
        if (isAxiosError(e)) {
            handleServerNetworkError(e.message, thunkAPI.dispatch);
        }
        return {isLoggedIn: false};
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
        builder.addCase(logInTC.fulfilled, (state, action) => {
            state.isLoggedIn = action.payload.isLoggedIn;
        });
    },
});

export const authReducer = slice.reducer;
export const {setIsLoggedInAC} = slice.actions;

export const logOutTC = () => async (dispatch: Dispatch) => {
    dispatch(setAppStatusAC({status: 'loading'}));

    try {
        const res = await authAPI.logOut();

        if (res.data.resultCode === ResultCode.OK) {
            dispatch(setIsLoggedInAC({isLoggedIn: false}));
            dispatch(clearTasksAndTodolists());
            dispatch(setAppStatusAC({status: 'succeeded'}));
        } else {
            handleServerAppError(res.data, dispatch);
        }
    } catch (e) {
        if (isAxiosError(e)) {
            handleServerNetworkError(e.message, dispatch);
        }
    }
};

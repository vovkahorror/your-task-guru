import {createAsyncThunk} from '@reduxjs/toolkit';
import {authAPI, ResultCode} from '../api/todolists-api';
import {setIsLoggedInAC} from '../features/Auth/auth-reducer';
import {isAxiosError} from 'axios';
import {handleServerNetworkError} from '../utils/error-utils';
import {setAppStatusAC} from './app-reducer';

export const initializeAppTC = createAsyncThunk('app/initializeApp', async (_, {dispatch}) => {
    dispatch(setAppStatusAC({status: 'loading'}));
    try {
        const res = await authAPI.me();
        if (res.data.resultCode === ResultCode.OK) {
            dispatch(setIsLoggedInAC({isLoggedIn: true}));
        }
        dispatch(setAppStatusAC({status: 'succeeded'}));
    } catch (e) {
        if (isAxiosError(e)) {
            handleServerNetworkError(e.message, dispatch);
        }
    }
});
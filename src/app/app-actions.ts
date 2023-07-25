import {createAsyncThunk} from '@reduxjs/toolkit';
import {authAPI, ResultCode} from '../api/todolists-api';
import {setIsLoggedIn} from '../features/Auth/auth-reducer';
import {isAxiosError} from 'axios';
import {handleServerNetworkError} from '../utils/error-utils';
import {setAppStatus} from './app-reducer';

export const initializeApp = createAsyncThunk('app/initializeApp', async (_, {dispatch}) => {
    dispatch(setAppStatus({status: 'loading'}));
    try {
        const res = await authAPI.me();
        if (res.data.resultCode === ResultCode.OK) {
            dispatch(setIsLoggedIn({isLoggedIn: true}));
        }
        dispatch(setAppStatus({status: 'succeeded'}));
    } catch (e) {
        if (isAxiosError(e)) {
            handleServerNetworkError(e.message, dispatch);
        }
    }
});
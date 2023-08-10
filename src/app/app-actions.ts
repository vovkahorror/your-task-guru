import {createAsyncThunk} from '@reduxjs/toolkit';
import {authApi} from '../api/todolists-api';
import {setIsLoggedIn} from '../features/Auth/auth-reducer';
import {handleServerNetworkError} from '../utils/error-utils';
import {setAppStatus} from './app-reducer';
import {ResultCode} from '../api/types';

export const initializeApp = createAsyncThunk('app/initializeApp', async (_, {dispatch, rejectWithValue}) => {
    dispatch(setAppStatus({status: 'loading'}));
    try {
        const res = await authApi.me();
        if (res.data.resultCode === ResultCode.OK) {
            dispatch(setIsLoggedIn({isLoggedIn: true}));
        }
        dispatch(setAppStatus({status: 'succeeded'}));
    } catch (e) {
        return handleServerNetworkError(e, dispatch, rejectWithValue);
    }
});
import {createAsyncThunk} from '@reduxjs/toolkit';
import {authApi} from '../../api/todolists-api';
import {setAppStatus} from '../../app/app-reducer';
import {handleServerAppError, handleServerNetworkError} from '../../utils/error-utils';
import {clearTasksAndTodolists} from '../../common/actions/common.actions';
import {ThunkErrorType} from '../../app/store';
import {LoginParamsType, RegisterParamsType, ResultCode} from '../../api/types';
import {registerApi} from '../../api/registration-api';

export const logIn = createAsyncThunk<undefined, LoginParamsType, ThunkErrorType>('auth/login', async (param, {
    dispatch,
    rejectWithValue,
}) => {
    dispatch(setAppStatus({status: 'loading'}));

    try {
        const res = await authApi.logIn(param);

        if (res.data.resultCode === ResultCode.OK) {
            dispatch(setAppStatus({status: 'succeeded'}));
        } else {
            return handleServerAppError(res.data, dispatch, rejectWithValue);
        }
    } catch (e) {
        return handleServerNetworkError(e, dispatch, rejectWithValue);
    }
});

export const logOut = createAsyncThunk('auth/logout', async (_, {dispatch, rejectWithValue}) => {
    dispatch(setAppStatus({status: 'loading'}));

    try {
        const res = await authApi.logOut();

        if (res.data.resultCode === ResultCode.OK) {
            dispatch(clearTasksAndTodolists());
            dispatch(setAppStatus({status: 'succeeded'}));
        } else {
            return handleServerAppError(res.data, dispatch, rejectWithValue);
        }
    } catch (e) {
        return handleServerNetworkError(e, dispatch, rejectWithValue);
    }
});

export const register = createAsyncThunk<undefined, RegisterParamsType, ThunkErrorType>('auth/register', async (param, {
    dispatch, rejectWithValue,
}) => {
    const {login, email, password, acceptOffer} = param;
    dispatch(setAppStatus({status: 'loading'}));

    try {
        const res = await registerApi.register(login, email, password, acceptOffer);
        dispatch(setAppStatus({status: 'succeeded'}));
    } catch (e) {
        return handleServerNetworkError(e, dispatch, rejectWithValue);
    }
});
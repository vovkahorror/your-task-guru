import {createAsyncThunk} from '@reduxjs/toolkit';
import {authApi, securityApi} from '../../api/todolists-api';
import {setAppError, setAppMessage, setAppStatus} from '../../app/app-reducer';
import {handleServerAppError, handleServerNetworkError} from '../../utils/error-utils';
import {clearTasksAndTodolists} from '../../common/actions/common.actions';
import {ThunkErrorType} from '../../app/store';
import {LoginParamsType, RegisterParamsType, RegisterResponseType, ResultCode} from '../../api/types';
import {registerApi} from '../../api/register-api';
import {setCaptchaUrl} from './auth-reducer';

export const logIn = createAsyncThunk<undefined, LoginParamsType, ThunkErrorType>('auth/login', async (param, {
    dispatch,
    rejectWithValue,
}) => {
    dispatch(setAppStatus({status: 'loading'}));

    try {
        const res = await authApi.logIn(param);

        if (res.data.resultCode === ResultCode.OK) {
            dispatch(setAppStatus({status: 'succeeded'}));
            dispatch(setCaptchaUrl({captchaUrl: null}));
        } else if (res.data.resultCode === ResultCode.Captcha) {
            dispatch(getCaptchaUrl());
            return handleServerAppError(res.data, dispatch, rejectWithValue);
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

export const register = createAsyncThunk<RegisterResponseType, RegisterParamsType, ThunkErrorType>('auth/register', async (param, {
    dispatch, rejectWithValue,
}) => {
    const {login, email, password, acceptOffer} = param;
    dispatch(setAppStatus({status: 'loading'}));

    try {
        const res = await registerApi.register(login, email, password, acceptOffer);

        if (res.Response[1]?.v[0].message) {
            dispatch(setAppError({error: res.Response[1]?.v[0].message}));
            dispatch(setAppStatus({status: 'failed'}));
            return rejectWithValue({errors: [res.Response[1]?.v[0].message], fieldsErrors: undefined});
        } else {
            dispatch(setAppMessage({message: `We have sent a confirmation email to ${email}`}));
            dispatch(setAppStatus({status: 'succeeded'}));
            return res;
        }
    } catch (e) {
        return handleServerNetworkError(e, dispatch, rejectWithValue);
    }
});

export const getCaptchaUrl = createAsyncThunk('auth/getCaptchaUrl', async (_, {dispatch}) => {
    const response = await securityApi.getCaptchaUrl();
    dispatch(setCaptchaUrl({captchaUrl: response.data.url}));
});

import {createAsyncThunk} from '@reduxjs/toolkit';
import {authAPI, LoginParamType, ResultCode} from '../../api/todolists-api';
import {setAppStatus} from '../../app/app-reducer';
import {handleServerAppError, handleServerNetworkError} from '../../utils/error-utils';
import {clearTasksAndTodolists} from '../../common/actions/common.actions';
import {ThunkErrorType} from '../../app/store';

export const logIn = createAsyncThunk<null, LoginParamType, ThunkErrorType>('auth/login', async (param, {
    dispatch,
    rejectWithValue,
}) => {
    dispatch(setAppStatus({status: 'loading'}));

    try {
        const res = await authAPI.logIn(param);

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
        const res = await authAPI.logOut();

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
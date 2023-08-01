import {createAsyncThunk} from '@reduxjs/toolkit';
import {authAPI, FieldErrorType, LoginParamType, ResultCode} from '../../api/todolists-api';
import {setAppStatus} from '../../app/app-reducer';
import {handleServerAppError, handleServerNetworkError} from '../../utils/error-utils';
import {clearTasksAndTodolists} from '../../common/actions/common.actions';

export const logIn = createAsyncThunk<undefined, LoginParamType, {
    rejectValue: { errors: string[]; fieldsErrors?: FieldErrorType[] }
}>('auth/login', async (param, {dispatch, rejectWithValue}) => {
    dispatch(setAppStatus({status: 'loading'}));

    try {
        const res = await authAPI.logIn(param);

        if (res.data.resultCode === ResultCode.OK) {
            dispatch(setAppStatus({status: 'succeeded'}));
        } else {
            handleServerAppError(res.data, dispatch);
            return rejectWithValue({errors: res.data.messages, fieldsErrors: res.data.fieldsErrors});
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
            handleServerAppError(res.data, dispatch);
            return rejectWithValue(null);
        }
    } catch (e) {
        return handleServerNetworkError(e, dispatch, rejectWithValue);
    }
});
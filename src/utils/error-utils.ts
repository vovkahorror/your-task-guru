import {setAppError, setAppStatus} from '../app/app-reducer';
import {Dispatch} from 'redux';
import {AxiosError} from 'axios';
import {RejectValueType} from '../app/store';
import {ResponseType} from '../api/types';

// generic function
export const handleServerAppError = <T>(data: ResponseType<T>, dispatch: Dispatch, rejectWithValue: (value: RejectValueType) => any, showError = true) => {
    if (showError) {
        dispatch(setAppError({error: data.messages.length ? data.messages[0] : 'Some error occurred'}));
    }

    dispatch(setAppStatus({status: 'failed'}));
    return rejectWithValue({errors: data.messages, fieldsErrors: data.fieldsErrors});
};

export const handleServerNetworkError = (e: unknown, dispatch: Dispatch, rejectWithValue: (value: RejectValueType) => any, showError = true) => {
    const error = e as AxiosError;

    if (showError) {
        dispatch(setAppError({error: error.message || 'Some error occurred'}));
    }

    dispatch(setAppStatus({status: 'failed'}));
    return rejectWithValue({errors: [error.message], fieldsErrors: undefined});
};

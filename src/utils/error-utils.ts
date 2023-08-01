import {setAppError, setAppStatus} from '../app/app-reducer';
import {Dispatch} from 'redux';
import {FieldErrorType, ResponseType} from '../api/todolists-api';
import {AxiosError} from 'axios';

// generic function
export const handleServerAppError = <T>(data: ResponseType<T>, dispatch: Dispatch, showError = true) => {
    if (showError) {
        dispatch(setAppError({error: data.messages.length ? data.messages[0] : 'Some error occurred'}));
    }
    dispatch(setAppStatus({status: 'failed'}));
};

export const handleServerNetworkError = (e: unknown, dispatch: Dispatch, rejectWithValue: (value: {
    errors: string[];
    fieldsErrors?: FieldErrorType[]
}) => any, showError = true) => {
    const error = e as AxiosError;

    if (showError) {
        dispatch(setAppError({error: error.message || 'Some error occurred'}));
    }
debugger
    dispatch(setAppStatus({status: 'failed'}));
    return rejectWithValue({errors: [error.message], fieldsErrors: undefined});
};

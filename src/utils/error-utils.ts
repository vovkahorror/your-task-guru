import {setAppError, setAppStatus} from '../app/app-reducer';
import {Dispatch} from 'redux';
import {ResponseType} from '../api/todolists-api';

// generic function
export const handleServerAppError = <T>(data: ResponseType<T>, dispatch: Dispatch, showError = true) => {
    if (showError) {
        dispatch(setAppError({error: data.messages.length ? data.messages[0] : 'Some error occurred'}));
    }
    dispatch(setAppStatus({status: 'failed'}));
};

export const handleServerNetworkError = (error: string, dispatch: Dispatch, showError = true) => {
    if (showError) {
        dispatch(setAppError({error}));
    }
    dispatch(setAppStatus({status: 'failed'}));
};

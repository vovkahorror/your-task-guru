import {setAppError, setAppStatus} from '../app/app-reducer';
import {Dispatch} from 'redux';
import {ResponseType} from '../api/todolists-api';

// generic function
export const handleServerAppError = <T>(data: ResponseType<T>, dispatch: Dispatch) => {
    if (data.messages.length) {
        dispatch(setAppError({error: data.messages[0]}));
    } else {
        dispatch(setAppError({error: 'Some error occurred'}));
    }
    dispatch(setAppStatus({status: 'failed'}));
};

export const handleServerNetworkError = (error: string, dispatch: Dispatch) => {
    dispatch(setAppError({error}));
    dispatch(setAppStatus({status: 'failed'}));
};

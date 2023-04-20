import {Dispatch} from 'redux';
import {authAPI, ResultCode} from '../api/todolists-api';
import {handleServerAppError, handleServerNetworkError} from '../utils/error-utils';
import {isAxiosError} from 'axios';
import {setIsLoggedInAC} from '../features/Login/auth-reducer';

const initialState = {
    status: 'idle' as RequestStatusType,
    error: null as string | null,
    isInitialized: false,
    isShowedTodolistNotification: false,
    isShowedTaskNotification: false,
};

export const appReducer = (state: InitialStateType = initialState, action: AppActionsType): InitialStateType => {
    switch (action.type) {
        case 'APP/SET-STATUS': {
            return {...state, status: action.payload.status};
        }

        case 'APP/SET-ERROR': {
            return {...state, error: action.payload.error};
        }

        case 'APP/SET-IS-INITIALIZED': {
            return {...state, isInitialized: action.payload.isInitialized};
        }

        case 'APP/SET-SHOWING-TODOLIST-NOTIFICATION': {
            return {...state, isShowedTodolistNotification: action.payload.isShowedTodolistNotification};
        }

        case 'APP/SET-SHOWING-TASK-NOTIFICATION': {
            return {...state, isShowedTaskNotification: action.payload.isShowedTaskNotification};
        }

        default: {
            return state;
        }
    }
};

//actions
export const setAppStatusAC = (status: RequestStatusType) => ({
    type: 'APP/SET-STATUS',
    payload: {status},
} as const);

export const setAppErrorAC = (error: string | null) => ({
    type: 'APP/SET-ERROR',
    payload: {error},
} as const);

export const setIsInitializedAC = (isInitialized: boolean) => ({
    type: 'APP/SET-IS-INITIALIZED',
    payload: {isInitialized},
} as const);

export const setTodolistNotificationShowingAC = (isShowedTodolistNotification: boolean) => ({
    type: 'APP/SET-SHOWING-TODOLIST-NOTIFICATION',
    payload: {isShowedTodolistNotification},
} as const);

export const setTaskNotificationShowingAC = (isShowedTaskNotification: boolean) => ({
    type: 'APP/SET-SHOWING-TASK-NOTIFICATION',
    payload: {isShowedTaskNotification},
} as const);

// thunks
export const initializeAppTC = () => async (dispatch: Dispatch) => {
    dispatch(setAppStatusAC('loading'));

    try {
        const res = await authAPI.me();

        if (res.data.resultCode === ResultCode.OK) {
            dispatch(setIsLoggedInAC({value: true}));
            dispatch(setAppStatusAC('succeeded'));
        } else {
            handleServerAppError(res.data, dispatch);
        }
    } catch (e) {
        if (isAxiosError(e)) {
            handleServerNetworkError(e.message, dispatch);
        }
    } finally {
        dispatch(setIsInitializedAC(true));
    }
};

//types
export type RequestStatusType = 'idle' | 'loading' | 'succeeded' | 'failed';

export type TitleNotificationTextType = 'To-Do list' | 'task';

type InitialStateType = typeof initialState;

export type SetAppStatusActionType = ReturnType<typeof setAppStatusAC>;
export type SetAppErrorActionType = ReturnType<typeof setAppErrorAC>;
export type SetIsInitializedActionType = ReturnType<typeof setIsInitializedAC>;

export type AppActionsType =
    SetAppStatusActionType
    | SetAppErrorActionType
    | SetIsInitializedActionType
    | ReturnType<typeof setTodolistNotificationShowingAC>
    | ReturnType<typeof setTaskNotificationShowingAC>;


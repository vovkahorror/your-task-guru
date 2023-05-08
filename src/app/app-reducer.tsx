import {Dispatch} from 'redux';
import {authAPI, ResultCode} from '../api/todolists-api';
import {handleServerAppError, handleServerNetworkError} from '../utils/error-utils';
import {isAxiosError} from 'axios';
import {setIsLoggedInAC} from '../features/Login/auth-reducer';
import {createSlice, PayloadAction} from '@reduxjs/toolkit';
import {Location} from '@remix-run/router';

const initialState = {
    status: 'idle' as RequestStatusType,
    error: null as string | null,
    isInitialized: false,
    isShowedTodolistNotification: false,
    isShowedTaskNotification: false,
};

const slice = createSlice({
    name: 'app',
    initialState: initialState,
    reducers: {
        setAppStatusAC(state, action: PayloadAction<{ status: RequestStatusType }>) {
            state.status = action.payload.status;
        },

        setAppErrorAC(state, action: PayloadAction<{ error: string | null }>) {
            state.error = action.payload.error;
        },

        setIsInitializedAC(state, action: PayloadAction<{ isInitialized: boolean }>) {
            state.isInitialized = action.payload.isInitialized;
        },

        setTodolistNotificationShowingAC(state, action: PayloadAction<{ isShowedTodolistNotification: boolean }>) {
            state.isShowedTodolistNotification = action.payload.isShowedTodolistNotification;
        },

        setTaskNotificationShowingAC(state, action: PayloadAction<{ isShowedTaskNotification: boolean }>) {
            state.isShowedTaskNotification = action.payload.isShowedTaskNotification;
        },
    },
});

export const appReducer = slice.reducer;

export const {
    setAppStatusAC,
    setAppErrorAC,
    setIsInitializedAC,
    setTodolistNotificationShowingAC,
    setTaskNotificationShowingAC,
} = slice.actions;

// thunks
export const initializeAppTC = (location: Location) => async (dispatch: Dispatch) => {
    dispatch(setAppStatusAC({status: 'loading'}));

    try {
        const res = await authAPI.me();

        if (res.data.resultCode === ResultCode.OK) {
            dispatch(setIsLoggedInAC({isLoggedIn: true}));
            dispatch(setAppStatusAC({status: 'succeeded'}));
        } else {
            if (location.pathname !== '/login') {
                handleServerAppError(res.data, dispatch);
            } else {
                dispatch(setAppStatusAC({status: 'succeeded'}));
            }
        }
    } catch (e) {
        if (isAxiosError(e)) {
            handleServerNetworkError(e.message, dispatch);
        }
    } finally {
        dispatch(setIsInitializedAC({isInitialized: true}));
    }
};

//types
export type RequestStatusType = 'idle' | 'loading' | 'succeeded' | 'failed';

export type TitleNotificationTextType = 'To-Do list' | 'task';

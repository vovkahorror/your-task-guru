import {Dispatch} from 'redux';
import {setAppStatusAC} from '../../app/app-reducer';
import {authAPI, LoginType, ResultCode} from '../../api/todolists-api';
import {handleServerAppError, handleServerNetworkError} from '../../utils/error-utils';
import {isAxiosError} from 'axios';
import {clearDataAC} from '../TodolistsList/todolists-reducer';
import {createSlice, PayloadAction} from '@reduxjs/toolkit';

const initialState = {
    isLoggedIn: false,
};

const slice = createSlice({
    name: 'auth',
    initialState: initialState,
    reducers: {
        setIsLoggedInAC(state, action: PayloadAction<{ value: boolean }>) {
            state.isLoggedIn = action.payload.value;
        },
    },
});

export const authReducer = slice.reducer;
export const {setIsLoggedInAC} = slice.actions;

export const logInTC = (data: LoginType) => async (dispatch: Dispatch) => {
    dispatch(setAppStatusAC('loading'));

    try {
        const res = await authAPI.logIn(data);

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
    }
};

export const logOutTC = () => async (dispatch: Dispatch) => {
    dispatch(setAppStatusAC('loading'));

    try {
        const res = await authAPI.logOut();

        if (res.data.resultCode === ResultCode.OK) {
            dispatch(setIsLoggedInAC({value: false}));
            dispatch(setAppStatusAC('succeeded'));
            dispatch(clearDataAC());
        } else {
            handleServerAppError(res.data, dispatch);
        }
    } catch (e) {
        if (isAxiosError(e)) {
            handleServerNetworkError(e.message, dispatch);
        }
    }
};

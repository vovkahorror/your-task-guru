import {tasksReducer, todolistsReducer} from '../features/TodolistsList';
import {combineReducers} from 'redux';
import thunk from 'redux-thunk';
import {appReducer} from '.';
import {authReducer} from '../features/Auth';
import {configureStore} from '@reduxjs/toolkit';
import {FieldErrorType} from '../api/types';

const rootReducer = combineReducers({
    tasks: tasksReducer,
    todolists: todolistsReducer,
    app: appReducer,
    auth: authReducer,
});

export type RootReducerType = typeof rootReducer;

export const store = configureStore({
    reducer: rootReducer,
    middleware: getDefaultMiddleware => getDefaultMiddleware().prepend(thunk),
});

export type AppRootStateType = ReturnType<RootReducerType>

export type RejectValueType = {
    errors: string[];
    fieldsErrors?: FieldErrorType[];
}

export type ThunkErrorType = {
    rejectValue: RejectValueType;
}

// @ts-ignore
window.store = store;

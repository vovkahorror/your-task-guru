import {tasksReducer} from '../features/TodolistsList/tasks-reducer';
import {todolistsReducer} from '../features/TodolistsList/todolists-reducer';
import {combineReducers} from 'redux';
import thunk from 'redux-thunk';
import {appReducer} from './app-reducer';
import {authReducer} from '../features/Auth/auth-reducer';
import {configureStore} from '@reduxjs/toolkit';
import {FieldErrorType} from '../api/todolists-api';

const rootReducer = combineReducers({
    tasks: tasksReducer,
    todolists: todolistsReducer,
    app: appReducer,
    auth: authReducer,
});

export type RootReducerType = typeof rootReducer;

export const store = configureStore({
    reducer: rootReducer,
    middleware: getDefaultMiddleware => getDefaultMiddleware().prepend(thunk)
})

export type AppRootStateType = ReturnType<RootReducerType>

export type ThunkErrorType = {
    rejectValue: { errors: string[]; fieldsErrors?: FieldErrorType[] }
}

// @ts-ignore
window.store = store;

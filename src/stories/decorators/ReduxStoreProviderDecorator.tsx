import React, {ReactNode} from 'react';
import {AppRootStateType, RootReducerType} from '../../app/store';
import {Provider} from 'react-redux';
import {combineReducers} from 'redux';
import {tasksReducer} from '../../features/TodolistsList/tasks-reducer';
import {todolistsReducer} from '../../features/TodolistsList/todolists-reducer';
import {v1} from 'uuid';
import {TaskPriorities, TaskStatuses} from '../../api/todolists-api';
import {appReducer} from '../../app/app-reducer';
import {authReducer} from '../../features/Login/auth-reducer';
import thunk from 'redux-thunk';
import {configureStore} from '@reduxjs/toolkit';

const rootReducer: RootReducerType = combineReducers({
    tasks: tasksReducer,
    todolists: todolistsReducer,
    app: appReducer,
    auth: authReducer
});

const initialGlobalState: AppRootStateType = {
    todolists: [
        {id: 'todolistId1', title: 'What to learn', filter: 'all', addedDate: '', order: 0, entityStatus: 'idle'},
        {id: 'todolistId2', title: 'What to buy', filter: 'all', addedDate: '', order: 0, entityStatus: 'idle'},
    ],
    tasks: {
        ['todolistId1']: [
            {
                id: v1(), title: 'HTML&CSS', status: TaskStatuses.Completed, todoListId: 'todolistId1', description: '',
                startDate: '', deadline: '', addedDate: '', order: 0, priority: TaskPriorities.Low, entityStatus: 'idle'
            },
            {
                id: v1(), title: 'JS', status: TaskStatuses.Completed, todoListId: 'todolistId1', description: '',
                startDate: '', deadline: '', addedDate: '', order: 0, priority: TaskPriorities.Low, entityStatus: 'idle'
            },
        ],
        ['todolistId2']: [
            {
                id: v1(), title: 'Milk', status: TaskStatuses.Completed, todoListId: 'todolistId2', description: '',
                startDate: '', deadline: '', addedDate: '', order: 0, priority: TaskPriorities.Low, entityStatus: 'idle'
            },
            {
                id: v1(),
                title: 'React Book',
                status: TaskStatuses.Completed,
                todoListId: 'todolistId2',
                description: '',
                startDate: '',
                deadline: '',
                addedDate: '',
                order: 0,
                priority: TaskPriorities.Low,
                entityStatus: 'idle'
            },
        ],
    },
    app: {
        status: 'idle',
        error: null,
        isInitialized: false,
        isShowedTodolistNotification: false,
        isShowedTaskNotification: false,
    },
    auth: {
        isLoggedIn: false,
    }
};

export const storyBookStore = configureStore({
    reducer: rootReducer,
    preloadedState: initialGlobalState,
    middleware: getDefaultMiddleware => getDefaultMiddleware().prepend(thunk)
})

export const ReduxStoreProviderDecorator = (storyFn: () => ReactNode) => {
    return (
        <Provider store={storyBookStore}>
            {storyFn()}
        </Provider>
    );
};
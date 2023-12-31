import {createAsyncThunk} from '@reduxjs/toolkit';
import {setAppStatus} from '../../app/app-reducer';
import {todolistsApi} from '../../api/todolists-api';
import {fetchTasks} from './tasks-actions';
import {handleServerAppError, handleServerNetworkError} from '../../utils/error-utils';
import {changeTodolistEntityStatus, setTodolists, TodolistDomainType} from './todolists-reducer';
import {AppRootStateType, ThunkErrorType} from '../../app/store';
import {ResultCode, TodolistType} from '../../api/types';
import {UniqueIdentifier} from '@dnd-kit/core';

export const fetchTodolists = createAsyncThunk('todolists/fetchTodolists', async (_, {dispatch, rejectWithValue}) => {
    dispatch(setAppStatus({status: 'loading'}));
    try {
        const todolists = await todolistsApi.getTodolists();
        dispatch(setTodolists({todolists}));
        todolists.forEach((tl) => {
            dispatch(fetchTasks(tl.id));
        });
        dispatch(setAppStatus({status: 'succeeded'}));
    } catch (e) {
        return handleServerNetworkError(e, dispatch, rejectWithValue);
    }
});

export const removeTodolist = createAsyncThunk<{
    todolistId: string
}, string, ThunkErrorType>('todolists/removeTodolist', async (todolistId, {
    dispatch,
    rejectWithValue,
}) => {
    dispatch(setAppStatus({status: 'loading'}));
    dispatch(changeTodolistEntityStatus({todolistId, status: 'loading'}));
    try {
        const res = await todolistsApi.deleteTodolist(todolistId);
        if (res.data.resultCode === ResultCode.OK) {
            dispatch(setAppStatus({status: 'succeeded'}));
            return {todolistId};
        } else {
            dispatch(changeTodolistEntityStatus({todolistId, status: 'failed'}));
            return handleServerAppError(res.data, dispatch, rejectWithValue);
        }
    } catch (e) {
        dispatch(changeTodolistEntityStatus({todolistId, status: 'failed'}));
        return handleServerNetworkError(e, dispatch, rejectWithValue);
    }
});

export const addTodolist = createAsyncThunk<{ todolist: TodolistType }, string, ThunkErrorType>
('todolists/addTodolist', async (title, {dispatch, rejectWithValue}) => {
    dispatch(setAppStatus({status: 'loading'}));
    try {
        const res = await todolistsApi.createTodolist(title);
        if (res.data.resultCode === ResultCode.OK) {
            dispatch(setAppStatus({status: 'succeeded'}));
            return {todolist: res.data.data.item};
        } else {
            return handleServerAppError(res.data, dispatch, rejectWithValue, false);
        }
    } catch (e) {
        return handleServerNetworkError(e, dispatch, rejectWithValue, false);
    }
});

export const changeTodolistTitle = createAsyncThunk<{ todolistId: string, title: string }, {
    todolistId: string, title: string
}, ThunkErrorType>('todolists/changeTodolistTitle', async (param, {dispatch, rejectWithValue}) => {
    dispatch(setAppStatus({status: 'loading'}));
    dispatch(changeTodolistEntityStatus({todolistId: param.todolistId, status: 'loading'}));
    try {
        const res = await todolistsApi.updateTodolist(param.todolistId, param.title);
        if (res.data.resultCode === ResultCode.OK) {
            dispatch(setAppStatus({status: 'succeeded'}));
            dispatch(changeTodolistEntityStatus({todolistId: param.todolistId, status: 'succeeded'}));
            return {todolistId: param.todolistId, title: param.title};
        } else {
            dispatch(changeTodolistEntityStatus({todolistId: param.todolistId, status: 'failed'}));
            return handleServerAppError(res.data, dispatch, rejectWithValue);
        }
    } catch (e) {
        dispatch(changeTodolistEntityStatus({todolistId: param.todolistId, status: 'failed'}));
        return handleServerNetworkError(e, dispatch, rejectWithValue);
    }
});

export const reorderTodolist = createAsyncThunk<{
    todolistId: UniqueIdentifier,
    overTodolistId: UniqueIdentifier
}, {
    todolistId: UniqueIdentifier, overTodolistId?: UniqueIdentifier
}, ThunkErrorType>('todolists/reorderTodolist', async (param, {dispatch, rejectWithValue, getState}) => {
    dispatch(setAppStatus({status: 'loading'}));

    const findTodolistById = (todolists: TodolistDomainType[], id?: UniqueIdentifier): TodolistDomainType => {
        return todolists.find(tl => tl.id === id) as TodolistDomainType;
    };

    const state = getState() as AppRootStateType;
    const sourceTodolist = findTodolistById(state.todolists, param.todolistId);
    const overTodolist = findTodolistById(state.todolists, param.overTodolistId);
    const sourceTodolistIndex = state.todolists.indexOf(sourceTodolist);
    const overTodolistIndex = state.todolists.indexOf(overTodolist);
    const putAfterTodolistIndex = sourceTodolistIndex > overTodolistIndex ? overTodolistIndex - 1 : overTodolistIndex;
    const putAfterTodolistId = state.todolists[putAfterTodolistIndex]?.id;

    try {
        const res = await todolistsApi.reorderTodolist(param.todolistId, putAfterTodolistId);
        if (res.data.resultCode === ResultCode.OK) {
            dispatch(setAppStatus({status: 'succeeded'}));
            return {todolistId: param.todolistId, overTodolistId: param.overTodolistId};
        }

        return handleServerAppError(res.data, dispatch, rejectWithValue);
    } catch (e) {
        return handleServerNetworkError(e, dispatch, rejectWithValue);
    }
});
import {createAsyncThunk} from '@reduxjs/toolkit';
import {setAppStatus} from '../../app/app-reducer';
import {FieldErrorType, ResultCode, TaskType, todolistsApi, UpdateTaskModelType} from '../../api/todolists-api';
import {handleServerAppError, handleServerNetworkError} from '../../utils/error-utils';
import {AxiosError, isAxiosError} from 'axios';
import {AppRootStateType} from '../../app/store';
import {changeTaskEntityStatus, UpdateDomainTaskModelType} from './tasks-reducer';

export const fetchTasks = createAsyncThunk('tasks/fetchTasks', async (todolistId: string, {
    dispatch,
    rejectWithValue,
}) => {
    dispatch(setAppStatus({status: 'loading'}));
    try {
        const res = await todolistsApi.getTasks(todolistId);
        dispatch(setAppStatus({status: 'succeeded'}));
        return {tasks: res.data.items, todolistId};
    } catch (e) {
        if (isAxiosError(e)) {
            handleServerNetworkError(e.message, dispatch);
        }
        return rejectWithValue(null);
    }
});

export const removeTask = createAsyncThunk('tasks/removeTask', async (param: {
    taskId: string,
    todolistId: string
}, {dispatch, rejectWithValue}) => {
    dispatch(setAppStatus({status: 'loading'}));
    dispatch(changeTaskEntityStatus({
        todolistId: param.todolistId,
        taskId: param.taskId,
        status: 'loading',
    }));

    try {
        const res = await todolistsApi.deleteTask(param.todolistId, param.taskId);
        if (res.data.resultCode === ResultCode.OK) {
            dispatch(setAppStatus({status: 'succeeded'}));
            return {taskId: param.taskId, todolistId: param.todolistId};
        } else {
            handleServerAppError(res.data, dispatch);
            return rejectWithValue(null);
        }
    } catch (e) {
        const error = e as AxiosError;
        handleServerNetworkError(error.message, dispatch);
        dispatch(changeTaskEntityStatus({
            todolistId: param.todolistId,
            taskId: param.taskId,
            status: 'failed',
        }));
        return rejectWithValue(null);
    }
});

export const addTask = createAsyncThunk<
    TaskType, { todolistId: string, title: string }, {
    rejectValue: { errors: string[]; fieldsErrors?: FieldErrorType[] }
}>('tasks/addTask', async (param, {dispatch, rejectWithValue}) => {
    dispatch(setAppStatus({status: 'loading'}));
    try {
        const res = await todolistsApi.createTask(param.todolistId, param.title);
        if (res.data.resultCode === ResultCode.OK) {
            dispatch(setAppStatus({status: 'succeeded'}));
            return res.data.data.item;
        } else {
            handleServerAppError(res.data, dispatch, false);
            return rejectWithValue({errors: res.data.messages, fieldsErrors: res.data.fieldsErrors});
        }
    } catch (e) {
        const error = e as AxiosError;
        handleServerNetworkError(error.message, dispatch, false);
        return rejectWithValue({errors: [error.message], fieldsErrors: undefined});
    }
});

export const updateTask = createAsyncThunk('tasks/updateTask', async (param: {
    todolistId: string,
    taskId: string,
    domainModel: UpdateDomainTaskModelType
}, {dispatch, getState, rejectWithValue}) => {
    const state = getState() as AppRootStateType;
    const task = state.tasks[param.todolistId].find(t => t.id === param.taskId);

    if (!task) {
        return rejectWithValue('task not found in the state');
    }

    dispatch(setAppStatus({status: 'loading'}));
    dispatch(changeTaskEntityStatus({todolistId: param.todolistId, taskId: param.taskId, status: 'loading'}));

    const apiModel: UpdateTaskModelType = {
        title: task.title,
        description: task.description,
        status: task.status,
        priority: task.priority,
        startDate: task.startDate,
        deadline: task.deadline,
        ...param.domainModel,
    };

    try {
        const res = await todolistsApi.updateTask(param.todolistId, param.taskId, apiModel);
        if (res.data.resultCode === ResultCode.OK) {
            dispatch(changeTaskEntityStatus({
                todolistId: param.todolistId,
                taskId: param.taskId,
                status: 'succeeded',
            }));
            dispatch(setAppStatus({status: 'succeeded'}));
            return param;
        } else {
            handleServerAppError(res.data, dispatch);
            return rejectWithValue(null);
        }
    } catch (e) {
        const error = e as AxiosError;
        handleServerNetworkError(error.message, dispatch);
        dispatch(changeTaskEntityStatus({todolistId: param.todolistId, taskId: param.taskId, status: 'failed'}));
        return rejectWithValue(null);
    }
});
import {addTodolistAC, removeTodolistTC, setTodolistsAC} from './todolists-reducer';
import {
    ResultCode,
    TaskPriorities,
    TaskStatuses,
    TaskType,
    todolistsApi,
    UpdateTaskModelType,
} from '../../api/todolists-api';
import {AppRootStateType} from '../../app/store';
import {RequestStatusType, setAppStatusAC} from '../../app/app-reducer';
import {AxiosError, isAxiosError} from 'axios';
import {handleServerAppError, handleServerNetworkError} from '../../utils/error-utils';
import {createAsyncThunk, createSlice, PayloadAction} from '@reduxjs/toolkit';
import {clearTasksAndTodolists} from '../../common/actions/common.actions';

// thunks
export const fetchTasksTC = createAsyncThunk('tasks/fetchTasks', async (todolistId: string, {
    dispatch,
    rejectWithValue,
}) => {
    dispatch(setAppStatusAC({status: 'loading'}));
    try {
        const res = await todolistsApi.getTasks(todolistId);
        dispatch(setAppStatusAC({status: 'succeeded'}));
        return {tasks: res.data.items, todolistId};
    } catch (e) {
        if (isAxiosError(e)) {
            handleServerNetworkError(e.message, dispatch);
        }
        return rejectWithValue(null);
    }
});

export const removeTaskTC = createAsyncThunk('tasks/removeTask', async (param: {
    taskId: string,
    todolistId: string
}, {dispatch, rejectWithValue}) => {
    dispatch(setAppStatusAC({status: 'loading'}));
    dispatch(changeTaskEntityStatusAC({
        todolistId: param.todolistId,
        taskId: param.taskId,
        status: 'loading',
    }));

    try {
        const res = await todolistsApi.deleteTask(param.todolistId, param.taskId);
        if (res.data.resultCode === ResultCode.OK) {
            dispatch(setAppStatusAC({status: 'succeeded'}));
            return {taskId: param.taskId, todolistId: param.todolistId};
        } else {
            handleServerAppError(res.data, dispatch);
            return rejectWithValue(null);
        }
    } catch (e) {
        const error = e as AxiosError;
        handleServerNetworkError(error.message, dispatch);
        dispatch(changeTaskEntityStatusAC({
            todolistId: param.todolistId,
            taskId: param.taskId,
            status: 'failed',
        }));
        return rejectWithValue(null);
    }
});

export const addTaskTC = createAsyncThunk('tasks/addTask', async (param: {
    todolistId: string,
    title: string
}, {dispatch, rejectWithValue}) => {
    dispatch(setAppStatusAC({status: 'loading'}));
    try {
        const res = await todolistsApi.createTask(param.todolistId, param.title);
        if (res.data.resultCode === ResultCode.OK) {
            dispatch(setAppStatusAC({status: 'succeeded'}));
            return res.data.data.item;
        } else {
            handleServerAppError(res.data, dispatch);
            return rejectWithValue(null);
        }
    } catch (e) {
        const error = e as AxiosError;
        handleServerNetworkError(error.message, dispatch);
        return rejectWithValue(null);
    }
});

export const updateTaskTC = createAsyncThunk('tasks/updateTask', async (param: {
    todolistId: string,
    taskId: string,
    domainModel: UpdateDomainTaskModelType
}, {dispatch, getState, rejectWithValue}) => {
    const state = getState() as AppRootStateType;
    const task = state.tasks[param.todolistId].find(t => t.id === param.taskId);

    if (!task) {
        return rejectWithValue('task not found in the state');
    }

    dispatch(setAppStatusAC({status: 'loading'}));
    dispatch(changeTaskEntityStatusAC({todolistId: param.todolistId, taskId: param.taskId, status: 'loading'}));

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
            dispatch(changeTaskEntityStatusAC({
                todolistId: param.todolistId,
                taskId: param.taskId,
                status: 'succeeded',
            }));
            dispatch(setAppStatusAC({status: 'succeeded'}));
            return param;
        } else {
            handleServerAppError(res.data, dispatch);
            return rejectWithValue(null);
        }
    } catch (e) {
        const error = e as AxiosError;
        handleServerNetworkError(error.message, dispatch);
        dispatch(changeTaskEntityStatusAC({todolistId: param.todolistId, taskId: param.taskId, status: 'failed'}));
        return rejectWithValue(null);
    }
});

// slice
const slice = createSlice({
    name: 'tasks',
    initialState: {} as TasksStateType,
    reducers: {
        changeTaskEntityStatusAC(state, action: PayloadAction<{
            todolistId: string,
            taskId: string,
            status: RequestStatusType
        }>) {
            const tasks = state[action.payload.todolistId];
            const index = tasks.findIndex(t => t.id === action.payload.taskId);
            if (index > -1) {
                tasks[index].entityStatus = action.payload.status;
            }
        },
    },

    extraReducers: (builder) => {
        builder.addCase(setTodolistsAC, (state, action) => {
            action.payload.todolists.forEach(tl => {
                state[tl.id] = [];
            });
        });

        builder.addCase(addTodolistAC, (state, action) => {
            state[action.payload.todolist.id] = [];
        });

        builder.addCase(removeTodolistTC.fulfilled, (state, action) => {
            delete state[action.payload.todolistId];
        });

        builder.addCase(clearTasksAndTodolists, () => {
            return {};
        });

        builder.addCase(fetchTasksTC.fulfilled, (state, action) => {
            state[action.payload.todolistId] = action.payload.tasks.map(t => ({...t, entityStatus: 'idle'}));
        });

        builder.addCase(removeTaskTC.fulfilled, (state, action) => {
            const tasks = state[action.payload.todolistId];
            const index = tasks.findIndex(t => t.id === action.payload.taskId);
            if (index > -1) {
                tasks.splice(index, 1);
            }
        });

        builder.addCase(addTaskTC.fulfilled, (state, action) => {
            state[action.payload.todoListId].unshift({
                ...action.payload,
                entityStatus: 'idle',
            });
        });

        builder.addCase(updateTaskTC.fulfilled, (state, action) => {
            const tasks = state[action.payload.todolistId];
            const index = tasks.findIndex(t => t.id === action.payload.taskId);
            if (index > -1) {
                tasks[index] = {...tasks[index], ...action.payload.domainModel};
            }
        });
    },
});

export const tasksReducer = slice.reducer;

export const {changeTaskEntityStatusAC} = slice.actions;

//types
export type TaskDomainType = TaskType & {
    entityStatus: RequestStatusType;
}

export type TasksStateType = {
    [key: string]: Array<TaskDomainType>
}

export type UpdateDomainTaskModelType = {
    title?: string;
    description?: string;
    status?: TaskStatuses;
    priority?: TaskPriorities;
    startDate?: string;
    deadline?: string;
}
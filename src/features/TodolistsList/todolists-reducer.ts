import {ResultCode, todolistsApi, TodolistType} from '../../api/todolists-api';
import {Dispatch} from 'redux';
import {RequestStatusType, setAppStatusAC} from '../../app/app-reducer';
import {AxiosError} from 'axios';
import {handleServerAppError, handleServerNetworkError} from '../../utils/error-utils';
import {getTasksTC} from './tasks-reducer';
import {AppDispatchType} from '../../utils/custom-hooks/useAppDispatch';
import {createSlice, PayloadAction} from '@reduxjs/toolkit';
import {clearTasksAndTodolists} from '../../common/actions/common.actions';

const initialState: TodolistDomainType[] = [];

const slice = createSlice({
    name: 'todolists',
    initialState: initialState,
    reducers: {
        setTodolistsAC(state, action: PayloadAction<{ todolists: TodolistType[] }>) {
            return action.payload.todolists.map(tl => ({...tl, filter: 'all', entityStatus: 'idle'}));
        },

        changeFilterAC(state, action: PayloadAction<{ value: FilterValuesType, todolistId: string }>) {
            const index = state.findIndex(tl => tl.id === action.payload.todolistId);
            state[index].filter = action.payload.value;
        },

        changeTodolistTitleAC(state, action: PayloadAction<{ todolistId: string, title: string }>) {
            const index = state.findIndex(tl => tl.id === action.payload.todolistId);
            state[index].title = action.payload.title;
        },

        addTodolistAC(state, action: PayloadAction<{ todolist: TodolistType }>) {
            state.unshift({...action.payload.todolist, filter: 'all', entityStatus: 'idle'});
        },

        removeTodolistAC(state, action: PayloadAction<{ todolistId: string }>) {
            const index = state.findIndex(tl => tl.id === action.payload.todolistId);
            if (index > -1) {
                state.splice(index, 1);
            }
        },

        changeTodolistEntityStatusAC(state, action: PayloadAction<{ todolistId: string, status: RequestStatusType }>) {
            const index = state.findIndex(tl => tl.id === action.payload.todolistId);
            state[index].entityStatus = action.payload.status;
        },
    },

    extraReducers: (builder) => {
        builder.addCase(clearTasksAndTodolists, () => {
            return [];
        });
    },
});

export const todolistsReducer = slice.reducer;

export const {
    setTodolistsAC,
    changeFilterAC,
    changeTodolistTitleAC,
    addTodolistAC,
    removeTodolistAC,
    changeTodolistEntityStatusAC,
} = slice.actions;

//thunks
export const getTodolistsTC = () => (dispatch: AppDispatchType) => {
    dispatch(setAppStatusAC({status: 'loading'}));

    todolistsApi.getTodolists()
        .then((res) => {
            dispatch(setTodolistsAC({todolists: res}));
            dispatch(setAppStatusAC({status: 'succeeded'}));
            return res;
        })
        .then((todolists) => {
            todolists.forEach((tl) => {
                dispatch(getTasksTC(tl.id));
            });
        })
        .catch((e: AxiosError) => {
            handleServerNetworkError(e.message, dispatch);
        });
};

export const addTodolistTC = (title: string) => (dispatch: Dispatch) => {
    dispatch(setAppStatusAC({status: 'loading'}));

    todolistsApi.createTodolist(title)
        .then((res) => {
            if (res.data.resultCode === ResultCode.OK) {
                dispatch(addTodolistAC({todolist: res.data.data.item}));
                dispatch(setAppStatusAC({status: 'succeeded'}));
            } else {
                handleServerAppError(res.data, dispatch);
            }
        })
        .catch((e: AxiosError) => {
            handleServerNetworkError(e.message, dispatch);
        });
};

export const removeTodolistTC = (todolistId: string) => (dispatch: Dispatch) => {
    dispatch(setAppStatusAC({status: 'loading'}));
    dispatch(changeTodolistEntityStatusAC({todolistId, status: 'loading'}));

    todolistsApi.deleteTodolist(todolistId)
        .then((res) => {
            if (res.data.resultCode === ResultCode.OK) {
                dispatch(removeTodolistAC({todolistId}));
                dispatch(setAppStatusAC({status: 'succeeded'}));
            } else {
                handleServerAppError(res.data, dispatch);
            }
        })
        .catch((e: AxiosError) => {
            handleServerNetworkError(e.message, dispatch);
            dispatch(changeTodolistEntityStatusAC({todolistId, status: 'failed'}));
        });
};

export const changeTodolistTitleTC = (todolistId: string, title: string) => (dispatch: Dispatch) => {
    dispatch(setAppStatusAC({status: 'loading'}));
    dispatch(changeTodolistEntityStatusAC({todolistId, status: 'loading'}));

    todolistsApi.updateTodolist(todolistId, title)
        .then((res) => {
            if (res.data.resultCode === ResultCode.OK) {
                dispatch(changeTodolistTitleAC({todolistId, title}));
                dispatch(setAppStatusAC({status: 'succeeded'}));
                dispatch(changeTodolistEntityStatusAC({todolistId, status: 'succeeded'}));
            } else {
                handleServerAppError(res.data, dispatch);
            }
        })
        .catch((e: AxiosError) => {
            handleServerNetworkError(e.message, dispatch);
            dispatch(changeTodolistEntityStatusAC({todolistId, status: 'failed'}));
        });
};

//types
export type AddTodolistActionType = ReturnType<typeof addTodolistAC>;
export type RemoveTodolistActionType = ReturnType<typeof removeTodolistAC>;
export type SetTodolistsActionType = ReturnType<typeof setTodolistsAC>;

export type FilterValuesType = 'all' | 'active' | 'completed';

export type TodolistDomainType = TodolistType & {
    filter: FilterValuesType;
    entityStatus: RequestStatusType;
}
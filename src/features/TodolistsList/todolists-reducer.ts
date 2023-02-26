import {ResultCode, todolistsApi, TodolistType} from '../../api/todolists-api';
import {Dispatch} from 'redux';
import {AppActionsType, RequestStatusType, setAppErrorAC, setAppStatusAC} from '../../app/app-reducer';
import {AxiosError} from 'axios';
import {handleServerAppError, handleServerNetworkError} from '../../utils/error-utils';
import {getTasksTC} from './tasks-reducer';
import {ThunkDispatch} from 'redux-thunk';
import { AppDispatchType } from '../../utils/custom-hooks/useAppDispatch';

const initialState: TodolistDomainType[] = [];

export const todolistsReducer = (state = initialState, action: ActionsType): TodolistDomainType[] => {
    switch (action.type) {
        case 'SET-TODOLISTS': {
            return action.payload.todolists.map(tl => ({...tl, filter: 'all', entityStatus: 'idle'}));
        }

        case 'CHANGE-FILTER': {
            return state.map(tl => tl.id === action.payload.todolistId ? {...tl, filter: action.payload.value} : tl);
        }

        case 'CHANGE-TODOLIST-TITLE': {
            return state.map(tl => tl.id === action.payload.todolistId ? {...tl, title: action.payload.title} : tl);
        }

        case 'ADD-TODOLIST': {
            return [
                {...action.payload.todolist, filter: 'all', entityStatus: 'idle'},
                ...state];
        }

        case 'REMOVE-TODOLIST': {
            return state.filter(tl => tl.id !== action.payload.todolistId);
        }

        case 'CHANGE-TODOLIST-ENTITY-STATUS': {
            return state.map(tl => tl.id === action.payload.todolistId ? {
                ...tl,
                entityStatus: action.payload.status,
            } : tl);
        }

        case 'CLEAR-DATA': {
            return [];
        }

        default: {
            return state;
        }
    }
};

//actions
export const changeFilterAC = (value: FilterValuesType, todolistId: string) => ({
    type: 'CHANGE-FILTER',
    payload: {value, todolistId},
} as const);

export const removeTodolistAC = (todolistId: string) => ({
    type: 'REMOVE-TODOLIST',
    payload: {todolistId},
} as const);

export const changeTodolistEntityStatusAC = (todolistId: string, status: RequestStatusType) => ({
    type: 'CHANGE-TODOLIST-ENTITY-STATUS',
    payload: {todolistId, status},
} as const);

export const changeTodolistTitleAC = (todolistId: string, title: string) => ({
    type: 'CHANGE-TODOLIST-TITLE',
    payload: {todolistId, title},
} as const);

export const addTodolistAC = (todolist: TodolistType) => ({
    type: 'ADD-TODOLIST',
    payload: {todolist},
} as const);

export const setTodolistsAC = (todolists: TodolistType[]) => ({
    type: 'SET-TODOLISTS',
    payload: {todolists},
} as const);

export const clearDataAC = () => ({type: 'CLEAR-DATA'} as const);

//thunks
export const getTodolistsTC = () => (dispatch: AppDispatchType) => {
    dispatch(setAppStatusAC('loading'));

    todolistsApi.getTodolists()
        .then((res) => {
            dispatch(setTodolistsAC(res));
            dispatch(setAppStatusAC('succeeded'));
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

export const addTodolistTC = (title: string) => (dispatch: Dispatch<ActionsType>) => {
    dispatch(setAppStatusAC('loading'));

    todolistsApi.createTodolist(title)
        .then((res) => {
            if (res.data.resultCode === ResultCode.OK) {
                dispatch(addTodolistAC(res.data.data.item));
                dispatch(setAppStatusAC('succeeded'));
            } else {
                handleServerAppError(res.data, dispatch);
            }
        })
        .catch((e: AxiosError) => {
            handleServerNetworkError(e.message, dispatch);
        });
};

export const removeTodolistTC = (todolistId: string) => (dispatch: Dispatch<ActionsType>) => {
    dispatch(setAppStatusAC('loading'));
    dispatch(changeTodolistEntityStatusAC(todolistId, 'loading'));

    todolistsApi.deleteTodolist(todolistId)
        .then((res) => {
            if (res.data.resultCode === ResultCode.OK) {
                dispatch(removeTodolistAC(todolistId));
                dispatch(setAppStatusAC('succeeded'));
            } else {
                handleServerAppError(res.data, dispatch);
            }
        })
        .catch((e: AxiosError) => {
            handleServerNetworkError(e.message, dispatch);
            dispatch(changeTodolistEntityStatusAC(todolistId, 'failed'));
        });
};

export const changeTodolistTitleTC = (todolistId: string, title: string) => (dispatch: Dispatch<ActionsType>) => {
    dispatch(setAppStatusAC('loading'));
    dispatch(changeTodolistEntityStatusAC(todolistId, 'loading'));

    todolistsApi.updateTodolist(todolistId, title)
        .then((res) => {
            if (res.data.resultCode === ResultCode.OK) {
                dispatch(changeTodolistTitleAC(todolistId, title));
                dispatch(setAppStatusAC('succeeded'));
                dispatch(changeTodolistEntityStatusAC(todolistId, 'succeeded'));
            } else {
                handleServerAppError(res.data, dispatch);
            }
        })
        .catch((e: AxiosError) => {
            handleServerNetworkError(e.message, dispatch);
            dispatch(changeTodolistEntityStatusAC(todolistId, 'failed'));
        });
};

//types
export type AddTodolistActionType = ReturnType<typeof addTodolistAC>;
export type RemoveTodolistActionType = ReturnType<typeof removeTodolistAC>;
export type SetTodolistsActionType = ReturnType<typeof setTodolistsAC>;
export type ClearDataActionType = ReturnType<typeof clearDataAC>;

export type ActionsType =
    ReturnType<typeof changeFilterAC>
    | ReturnType<typeof changeTodolistTitleAC>
    | ReturnType<typeof changeTodolistEntityStatusAC>
    | RemoveTodolistActionType
    | AddTodolistActionType
    | SetTodolistsActionType
    | AppActionsType
    | ClearDataActionType;

export type FilterValuesType = 'all' | 'active' | 'completed';

export type TodolistDomainType = TodolistType & {
    filter: FilterValuesType;
    entityStatus: RequestStatusType;
}
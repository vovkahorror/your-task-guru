import {ResultCode, todolistsApi, TodolistType} from '../../api/todolists-api';
import {Dispatch} from 'redux';
import {RequestStatusType, setAppStatusAC} from '../../app/app-reducer';
import {AxiosError} from 'axios';
import {handleServerAppError, handleServerNetworkError} from '../../utils/error-utils';
import {getTasksTC} from './tasks-reducer';
import {AppDispatchType} from '../../utils/custom-hooks/useAppDispatch';
import {createSlice, PayloadAction} from '@reduxjs/toolkit';

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
            state.push({...action.payload.todolist, filter: 'all', entityStatus: 'idle'});
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
        clearDataAC() {
            return [];
        },
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
    clearDataAC,
} = slice.actions;

/*export const todolistsReducer = (state = initialState, action: ActionsType): TodolistDomainType[] => {
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
};*/

//actions
/*export const changeFilterAC = (value: FilterValuesType, todolistId: string) => ({
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

export const clearDataAC = () => ({type: 'CLEAR-DATA'} as const);*/

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
export type ClearDataActionType = ReturnType<typeof clearDataAC>;

export type FilterValuesType = 'all' | 'active' | 'completed';

export type TodolistDomainType = TodolistType & {
    filter: FilterValuesType;
    entityStatus: RequestStatusType;
}
import {todolistAPI, TodolistType} from '../../api/todolist-api';
import {Dispatch} from 'redux';
import {AppActionsType, setAppErrorAC, setAppStatusAC} from '../../app/app-reducer';

const initialState: TodolistDomainType[] = [];

export const todolistsReducer = (state = initialState, action: ActionsType): TodolistDomainType[] => {
    switch (action.type) {
        case 'SET-TODOLISTS': {
            return action.payload.todolists.map(tl => ({...tl, filter: 'all'}));
        }

        case 'CHANGE-FILTER': {
            return state.map(tl => tl.id === action.payload.todolistId ? {...tl, filter: action.payload.value} : tl);
        }

        case 'CHANGE-TODOLIST-TITLE': {
            return state.map(tl => tl.id === action.payload.todolistId ? {...tl, title: action.payload.title} : tl);
        }

        case 'ADD-TODOLIST': {
            return [
                {...action.payload.todolist, filter: 'all'},
                ...state];
        }

        case 'REMOVE-TODOLIST': {
            return state.filter(tl => tl.id !== action.payload.id);
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

export const removeTodolistAC = (id: string) => ({
    type: 'REMOVE-TODOLIST',
    payload: {id},
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

//thunks
export const getTodolistsTC = () => (dispatch: Dispatch<ActionsType>) => {
    dispatch(setAppStatusAC('loading'));
    todolistAPI.getTodolists()
        .then((res) => {
            dispatch(setTodolistsAC(res));
            dispatch(setAppStatusAC('succeeded'));
        });
};

export const addTodolistsTC = (title: string) => (dispatch: Dispatch<ActionsType>) => {
    dispatch(setAppStatusAC('loading'));
    todolistAPI.createTodolist(title)
        .then((res) => {
            if (res.data.resultCode === 0) {
                dispatch(addTodolistAC(res.data.data.item));
                dispatch(setAppStatusAC('succeeded'));
            } else {
                dispatch(setAppErrorAC(res.data.messages[0]));
                dispatch(setAppStatusAC('failed'));
            }
        });
};

export const removeTodolistsTC = (todolistId: string) => (dispatch: Dispatch<ActionsType>) => {
    dispatch(setAppStatusAC('loading'));
    todolistAPI.deleteTodolist(todolistId)
        .then(() => {
            dispatch(removeTodolistAC(todolistId));
            dispatch(setAppStatusAC('succeeded'));
        });
};

export const changeTodolistTitleTC = (todolistId: string, title: string) => (dispatch: Dispatch<ActionsType>) => {
    dispatch(setAppStatusAC('loading'));
    todolistAPI.updateTodolist(todolistId, title)
        .then(() => {
            dispatch(changeTodolistTitleAC(todolistId, title));
            dispatch(setAppStatusAC('succeeded'));
        });
};

//types
export type AddTodolistActionType = ReturnType<typeof addTodolistAC>;
export type RemoveTodolistActionType = ReturnType<typeof removeTodolistAC>;
export type SetTodolistsActionType = ReturnType<typeof setTodolistsAC>;

export type ActionsType =
    ReturnType<typeof changeFilterAC>
    | ReturnType<typeof changeTodolistTitleAC>
    | RemoveTodolistActionType
    | AddTodolistActionType
    | SetTodolistsActionType
    | AppActionsType;

export type FilterValuesType = 'all' | 'active' | 'completed';

export type TodolistDomainType = TodolistType & {
    filter: FilterValuesType;
}
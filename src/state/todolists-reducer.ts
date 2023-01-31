import {v1} from 'uuid';
import {todolistAPI, TodolistType} from '../api/todolist-api';
import {Dispatch} from 'redux';

export type ActionsType =
    ChangeFilterActionType
    | RemoveTodolistActionType
    | ChangeTodolistTitleActionType
    | AddTodolistActionType
    | SetTodolistsActionType;

export type FilterValuesType = 'all' | 'active' | 'completed';

export type TodolistDomainType = TodolistType & {
    filter: FilterValuesType;
}

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
                {
                    id: action.payload.newTodolistId,
                    title: action.payload.title,
                    filter: 'all',
                    addedDate: '',
                    order: 0,
                },
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

type ChangeFilterActionType = ReturnType<typeof changeFilterAC>

export const changeFilterAC = (value: FilterValuesType, todolistId: string) => {
    return {
        type: 'CHANGE-FILTER',
        payload: {
            value,
            todolistId,
        },
    } as const;
};

export type RemoveTodolistActionType = ReturnType<typeof removeTodolistAC>

export const removeTodolistAC = (id: string) => {
    return {
        type: 'REMOVE-TODOLIST',
        payload: {
            id,
        },
    } as const;
};

type ChangeTodolistTitleActionType = ReturnType<typeof changeTodolistTitleAC>

export const changeTodolistTitleAC = (todolistId: string, title: string) => {
    return {
        type: 'CHANGE-TODOLIST-TITLE',
        payload: {
            todolistId,
            title,
        },
    } as const;
};

export type AddTodolistActionType = ReturnType<typeof addTodolistAC>

export const addTodolistAC = (title: string) => {
    return {
        type: 'ADD-TODOLIST',
        payload: {
            newTodolistId: v1(),
            title,
        },
    } as const;
};

export type SetTodolistsActionType = ReturnType<typeof setTodolistsAC>;

export const setTodolistsAC = (todolists: TodolistType[]) => {
    return {
        type: 'SET-TODOLISTS',
        payload: {
            todolists,
        },
    } as const;
};

export const getTodolistsTC = () => (dispatch: Dispatch) => {
    todolistAPI.getTodolists()
        .then((res) => {
            dispatch(setTodolistsAC(res));
        });
};
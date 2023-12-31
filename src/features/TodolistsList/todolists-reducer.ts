import {RequestStatusType} from '../../app/app-reducer';
import {createSlice, PayloadAction} from '@reduxjs/toolkit';
import {clearTasksAndTodolists} from '../../common/actions/common.actions';
import {addTodolist, changeTodolistTitle, removeTodolist, reorderTodolist} from './todolists-actions';
import {TodolistType} from '../../api/types';
import {arrayMove} from '@dnd-kit/sortable';

// slice
export const slice = createSlice({
    name: 'todolists',
    initialState: [] as TodolistDomainType[],
    reducers: {
        setTodolists(state, action: PayloadAction<{ todolists: TodolistType[] }>) {
            return action.payload.todolists.map(tl => ({...tl, filter: 'all', entityStatus: 'idle'}));
        },

        changeFilter(state, action: PayloadAction<{ value: FilterValuesType, todolistId: string }>) {
            const index = state.findIndex(tl => tl.id === action.payload.todolistId);
            state[index].filter = action.payload.value;
        },

        changeTodolistEntityStatus(state, action: PayloadAction<{ todolistId: string, status: RequestStatusType }>) {
            const index = state.findIndex(tl => tl.id === action.payload.todolistId);
            state[index].entityStatus = action.payload.status;
        },
    },

    extraReducers: (builder) => {
        builder
            .addCase(clearTasksAndTodolists, () => {
                return [];
            })
            .addCase(removeTodolist.fulfilled, (state, action) => {
                const index = state.findIndex(tl => tl.id === action.payload.todolistId);
                if (index > -1) {
                    state.splice(index, 1);
                }
            })
            .addCase(addTodolist.fulfilled, (state, action) => {
                state.unshift({...action.payload.todolist, filter: 'all', entityStatus: 'idle'});
            })
            .addCase(changeTodolistTitle.fulfilled, (state, action) => {
                const index = state.findIndex(tl => tl.id === action.payload.todolistId);
                state[index].title = action.payload.title;
            })
            .addCase(reorderTodolist.fulfilled, (state, action) => {
                const todolist = state.find((tl) => tl.id === action.payload.todolistId) as TodolistDomainType;
                const oldIndex = state.indexOf(todolist);
                const overTodolist = state.find((tl) => tl.id === action.payload.overTodolistId) as TodolistDomainType;
                const newIndex = state.indexOf(overTodolist);
                const sortedTodolists = arrayMove(state, oldIndex, newIndex);
                state.splice(0, state.length, ...sortedTodolists);
            });
    },
});

export const {
    setTodolists,
    changeFilter,
    changeTodolistEntityStatus,
} = slice.actions;

//types
export type FilterValuesType = 'all' | 'active' | 'completed';

export type TodolistDomainType = TodolistType & {
    filter: FilterValuesType;
    entityStatus: RequestStatusType;
}
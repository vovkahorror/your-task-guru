import {TodolistType} from '../../api/todolists-api';
import {RequestStatusType} from '../../app/app-reducer';
import {createSlice, PayloadAction} from '@reduxjs/toolkit';
import {clearTasksAndTodolists} from '../../common/actions/common.actions';
import {addTodolistTC, changeTodolistTitleTC, removeTodolistTC} from './todolists-actions';

// slice
const slice = createSlice({
    name: 'todolists',
    initialState: [] as TodolistDomainType[],
    reducers: {
        setTodolistsAC(state, action: PayloadAction<{ todolists: TodolistType[] }>) {
            return action.payload.todolists.map(tl => ({...tl, filter: 'all', entityStatus: 'idle'}));
        },

        changeFilterAC(state, action: PayloadAction<{ value: FilterValuesType, todolistId: string }>) {
            const index = state.findIndex(tl => tl.id === action.payload.todolistId);
            state[index].filter = action.payload.value;
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

        builder.addCase(removeTodolistTC.fulfilled, (state, action) => {
            const index = state.findIndex(tl => tl.id === action.payload.todolistId);
            if (index > -1) {
                state.splice(index, 1);
            }
        })

        builder.addCase(addTodolistTC.fulfilled, (state, action) => {
            state.unshift({...action.payload.todolist, filter: 'all', entityStatus: 'idle'});
        })

        builder.addCase(changeTodolistTitleTC.fulfilled, (state, action) => {
            const index = state.findIndex(tl => tl.id === action.payload.todolistId);
            state[index].title = action.payload.title;
        })
    },
});

export const todolistsReducer = slice.reducer;

export const {
    setTodolistsAC,
    changeFilterAC,
    changeTodolistEntityStatusAC,
} = slice.actions;

//types
export type FilterValuesType = 'all' | 'active' | 'completed';

export type TodolistDomainType = TodolistType & {
    filter: FilterValuesType;
    entityStatus: RequestStatusType;
}
import {setTodolists} from './todolists-reducer';
import {TaskPriorities, TaskStatuses, TaskType} from '../../api/todolists-api';
import {RequestStatusType} from '../../app/app-reducer';
import {createSlice, PayloadAction} from '@reduxjs/toolkit';
import {clearTasksAndTodolists} from '../../common/actions/common.actions';
import {addTask, fetchTasks, removeTask, updateTask} from './tasks-actions';
import {addTodolist, removeTodolist} from './todolists-actions';

// slice
export const slice = createSlice({
    name: 'tasks',
    initialState: {} as TasksStateType,
    reducers: {
        changeTaskEntityStatus(state, action: PayloadAction<{
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
        builder.addCase(setTodolists, (state, action) => {
            action.payload.todolists.forEach(tl => {
                state[tl.id] = [];
            });
        });

        builder.addCase(addTodolist.fulfilled, (state, action) => {
            state[action.payload.todolist.id] = [];
        });

        builder.addCase(removeTodolist.fulfilled, (state, action) => {
            delete state[action.payload.todolistId];
        });

        builder.addCase(clearTasksAndTodolists, () => {
            return {};
        });

        builder.addCase(fetchTasks.fulfilled, (state, action) => {
            state[action.payload.todolistId] = action.payload.tasks.map(t => ({...t, entityStatus: 'idle'}));
        });

        builder.addCase(removeTask.fulfilled, (state, action) => {
            const tasks = state[action.payload.todolistId];
            const index = tasks.findIndex(t => t.id === action.payload.taskId);
            if (index > -1) {
                tasks.splice(index, 1);
            }
        });

        builder.addCase(addTask.fulfilled, (state, action) => {
            state[action.payload.todoListId].unshift({
                ...action.payload,
                entityStatus: 'idle',
            });
        });

        builder.addCase(updateTask.fulfilled, (state, action) => {
            const tasks = state[action.payload.todolistId];
            const index = tasks.findIndex(t => t.id === action.payload.taskId);
            if (index > -1) {
                tasks[index] = {...tasks[index], ...action.payload.domainModel};
            }
        });
    },
});

export const tasksReducer = slice.reducer;

export const {changeTaskEntityStatus} = slice.actions;

//types
export type TaskDomainType = TaskType & {
    entityStatus: RequestStatusType;
}

export type TasksStateType = {
    [key: string]: Array<TaskDomainType>;
}

export type UpdateDomainTaskModelType = {
    title?: string;
    description?: string;
    status?: TaskStatuses;
    priority?: TaskPriorities;
    startDate?: string;
    deadline?: string;
}
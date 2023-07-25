import * as tasksAsyncActions from './tasks-actions';
import * as todolistsAsyncActions from './todolists-actions';
import {slice as tasksSlice} from './tasks-reducer';
import {slice as todolistsSlice} from './todolists-reducer';
import {selectIsShowedTaskNotification} from './selectors/selectIsShowedTaskNotification';
import {selectIsShowedTodolistNotification} from './selectors/selectIsShowedTodolistNotification';
import {selectTodolists} from './selectors/selectTodolists';
import {selectTasks} from './selectors/selectTasks';

const tasksActions = {
    ...tasksAsyncActions,
    ...tasksSlice.actions,
};

const todolistsActions = {
    ...todolistsAsyncActions,
    ...todolistsSlice.actions,
};

export {
    tasksActions,
    todolistsActions,
    selectIsShowedTaskNotification,
    selectIsShowedTodolistNotification,
    selectTodolists,
    selectTasks,
};
import {TodolistDomainType} from './todolists-reducer';
import {TasksStateType} from './tasks-reducer';
import {v1} from 'uuid';
import {addTodolist} from './todolists-actions';
import {tasksReducer, todolistsReducer} from '.';

test('ids should be equals', () => {
    const newTodolist = {
        id: v1(),
        addedDate: '',
        title: 'new todolist',
        order: 0,
    };

    const startTasksState: TasksStateType = {};
    const startTodolistsState: Array<TodolistDomainType> = [];

    const action = addTodolist.fulfilled({todolist: newTodolist},  'requestId', newTodolist.title);

    const endTasksState = tasksReducer(startTasksState, action);
    const endTodolistsState = todolistsReducer(startTodolistsState, action);

    const keys = Object.keys(endTasksState);
    const idFromTasks = keys[0];
    const idFromTodolists = endTodolistsState[0].id;

    expect(idFromTasks).toBe(action.payload.todolist.id);
    expect(idFromTodolists).toBe(action.payload.todolist.id);
});
import {TasksStateType} from './tasks-reducer';
import {v1} from 'uuid';
import {addTask, removeTask, updateTask} from './tasks-actions';
import {addTodolist, removeTodolist} from './todolists-actions';
import {tasksReducer} from '.';
import {TaskPriorities, TaskStatuses} from '../../api/types';

let startState: TasksStateType;

beforeEach(() => {
    startState = {
        'todolistId1': [
            {
                id: '1',
                title: 'CSS',
                status: TaskStatuses.New,
                todoListId: 'todolistId1',
                description: '',
                startDate: '',
                deadline: '',
                addedDate: '',
                order: 0,
                priority: TaskPriorities.Low,
                entityStatus: 'idle',
            },
            {
                id: '2',
                title: 'JS',
                status: TaskStatuses.Completed,
                todoListId: 'todolistId1',
                description: '',
                startDate: '',
                deadline: '',
                addedDate: '',
                order: 0,
                priority: TaskPriorities.Low,
                entityStatus: 'idle',
            },
            {
                id: '3',
                title: 'React',
                status: TaskStatuses.New,
                todoListId: 'todolistId1',
                description: '',
                startDate: '',
                deadline: '',
                addedDate: '',
                order: 0,
                priority: TaskPriorities.Low,
                entityStatus: 'idle',
            },
        ],
        'todolistId2': [
            {
                id: '1',
                title: 'bread',
                status: TaskStatuses.New,
                todoListId: 'todolistId2',
                description: '',
                startDate: '',
                deadline: '',
                addedDate: '',
                order: 0,
                priority: TaskPriorities.Low,
                entityStatus: 'idle',
            },
            {
                id: '2',
                title: 'milk',
                status: TaskStatuses.Completed,
                todoListId: 'todolistId2',
                description: '',
                startDate: '',
                deadline: '',
                addedDate: '',
                order: 0,
                priority: TaskPriorities.Low,
                entityStatus: 'idle',
            },
            {
                id: '3',
                title: 'tea',
                status: TaskStatuses.New,
                todoListId: 'todolistId2',
                description: '',
                startDate: '',
                deadline: '',
                addedDate: '',
                order: 0,
                priority: TaskPriorities.Low,
                entityStatus: 'idle',
            },
        ],
    };
});

test('correct task should be deleted from correct array', () => {
    const param = {taskId: '2', todolistId: 'todolistId2'};
    const action = removeTask.fulfilled(param, 'requestId', param);

    const endState = tasksReducer(startState, action);

    expect(endState).toEqual({
        'todolistId1': [
            {
                id: '1',
                title: 'CSS',
                status: TaskStatuses.New,
                todoListId: 'todolistId1',
                description: '',
                entityStatus: 'idle',
                startDate: '',
                deadline: '',
                addedDate: '',
                order: 0,
                priority: TaskPriorities.Low,
            },
            {
                id: '2',
                title: 'JS',
                status: TaskStatuses.Completed,
                todoListId: 'todolistId1',
                description: '',
                entityStatus: 'idle',
                startDate: '',
                deadline: '',
                addedDate: '',
                order: 0,
                priority: TaskPriorities.Low,
            },
            {
                id: '3',
                title: 'React',
                status: TaskStatuses.New,
                todoListId: 'todolistId1',
                description: '',
                entityStatus: 'idle',
                startDate: '',
                deadline: '',
                addedDate: '',
                order: 0,
                priority: TaskPriorities.Low,
            },
        ],
        'todolistId2': [
            {
                id: '1',
                title: 'bread',
                status: TaskStatuses.New,
                todoListId: 'todolistId2',
                description: '',
                entityStatus: 'idle',
                startDate: '',
                deadline: '',
                addedDate: '',
                order: 0,
                priority: TaskPriorities.Low,
            },
            {
                id: '3',
                title: 'tea',
                status: TaskStatuses.New,
                todoListId: 'todolistId2',
                description: '',
                entityStatus: 'idle',
                startDate: '',
                deadline: '',
                addedDate: '',
                order: 0,
                priority: TaskPriorities.Low,
            },
        ],
    });
});

test('correct task should be added to correct array', () => {
    const newTask = {
        id: v1(),
        title: 'juice',
        status: TaskStatuses.New,
        todoListId: 'todolistId2',
        description: '',
        startDate: '',
        deadline: '',
        addedDate: '',
        order: 0,
        priority: TaskPriorities.Low,
    };

    const action = addTask.fulfilled(newTask, 'requestId', {todolistId: newTask.todoListId, title: newTask.title});

    const endState = tasksReducer(startState, action);

    expect(endState['todolistId1'].length).toBe(3);
    expect(endState['todolistId2'].length).toBe(4);
    expect(endState['todolistId2'][0].id).toBeDefined();
    expect(endState['todolistId2'][0].title).toBe('juice');
    expect(endState['todolistId2'][0].status).toBe(TaskStatuses.New);
});

test('status of specified task should be changed', () => {
    const task = {todolistId: 'todolistId2', taskId: '2', domainModel: {status: TaskStatuses.New}};
    const action = updateTask.fulfilled(task, 'requestId', task);

    const endState = tasksReducer(startState, action);

    expect(endState['todolistId2'][1].status).toBe(TaskStatuses.New);
    expect(endState['todolistId1'][1].status).toBe(TaskStatuses.Completed);
});

test('title of specified task should be changed', () => {
    const task = {todolistId: 'todolistId2', taskId: '2', domainModel: {title: 'juice'}};
    const action = updateTask.fulfilled(task, 'requestId', task);

    const endState = tasksReducer(startState, action);

    expect(endState['todolistId2'][1].title).toBe('juice');
    expect(endState['todolistId1'][1].title).toBe('JS');
});

test('new array should be added when new todolist is added', () => {
    const newTodolist = {
        id: v1(),
        addedDate: '',
        title: 'new todolist',
        order: 0,
    };

    const action = addTodolist.fulfilled({todolist: newTodolist}, 'requestId',  newTodolist.title);

    const endState = tasksReducer(startState, action);


    const keys = Object.keys(endState);
    const newKey = keys.find(k => k != 'todolistId1' && k != 'todolistId2');
    if (!newKey) {
        throw Error('new key should be added');
    }

    expect(keys.length).toBe(3);
    expect(endState[newKey]).toEqual([]);
});

test('property with todolistId should be deleted', () => {
    const action = removeTodolist.fulfilled({todolistId: 'todolistId2'}, 'requestId', 'todolistId2');

    const endState = tasksReducer(startState, action);


    const keys = Object.keys(endState);

    expect(keys.length).toBe(1);
    expect(endState['todolistId2']).not.toBeDefined();
});


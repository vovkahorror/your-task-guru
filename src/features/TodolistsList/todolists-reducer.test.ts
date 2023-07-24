import {
    changeFilterAC, FilterValuesType, TodolistDomainType,
    todolistsReducer,
} from './todolists-reducer';
import {v1} from 'uuid';
import {addTodolistTC, changeTodolistTitleTC, removeTodolistTC} from './todolists-actions';

let todolistId1: string;
let todolistId2: string;
let startState: TodolistDomainType[];

beforeEach(() => {
    todolistId1 = v1();
    todolistId2 = v1();

    startState = [
        {id: todolistId1, title: 'What to learn', filter: 'all', addedDate: '', order: 0, entityStatus: 'idle'},
        {id: todolistId2, title: 'What to buy', filter: 'all', addedDate: '', order: 0, entityStatus: 'idle'},
    ];
});

test('correct todolist should be removed', () => {
    const endState = todolistsReducer(startState, removeTodolistTC.fulfilled({todolistId: todolistId1}, 'requestId', todolistId1));

    expect(endState.length).toBe(1);
    expect(endState[0].id).toBe(todolistId2);
});

test('correct todolist should be added', () => {
    const newTodolist = {
        id: v1(),
        addedDate: '',
        title: 'New Todolist',
        order: 0,
    };

    let newTodolistTitle = 'New Todolist';

    const endState = todolistsReducer(startState, addTodolistTC.fulfilled({todolist: newTodolist}, 'requestId', newTodolistTitle));

    expect(endState.length).toBe(3);
    expect(endState[0].title).toBe(newTodolistTitle);
});

test('correct todolist should change its name', () => {
    let newTodolistTitle = 'New Todolist';
    const param= {
        todolistId: todolistId2,
        title: newTodolistTitle,
    };

    const endState = todolistsReducer(startState, changeTodolistTitleTC.fulfilled(param, 'requestId', param));

    expect(endState[0].title).toBe('What to learn');
    expect(endState[1].title).toBe(newTodolistTitle);
});

test('correct filter of todolist should be changed', () => {
    let newFilter: FilterValuesType = 'completed';

    const endState = todolistsReducer(startState, changeFilterAC({value: newFilter, todolistId: todolistId2}));

    expect(endState[0].filter).toBe('all');
    expect(endState[1].filter).toBe(newFilter);
});

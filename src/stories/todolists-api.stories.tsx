import React, {useEffect, useState} from 'react';
import {todolistAPI} from '../api/todolist-api';

export default {
    title: 'API',
};

export const GetTodolists = () => {
    const [state, setState] = useState<any>(null);

    useEffect(() => {
        todolistAPI.getTodolists().then(res => setState(res));
    }, []);

    return <div>{JSON.stringify(state)}</div>;
};
export const CreateTodolist = () => {
    const [state, setState] = useState<any>(null);
    const title = 'new todo';

    useEffect(() => {
        todolistAPI.createTodolist(title).then(res => setState(res));
    }, []);

    return <div>{JSON.stringify(state)}</div>;
};
export const DeleteTodolist = () => {
    const [state, setState] = useState<any>(null);
    const todolistId = 'a603b3e3-ff10-4cd7-92de-4a4e01cb6c0e';

    useEffect(() => {
        todolistAPI.deleteTodolist(todolistId).then(res => setState(res));
    }, []);

    return <div>{JSON.stringify(state)}</div>;
};
export const UpdateTodolistTitle = () => {
    const [state, setState] = useState<any>(null);
    const todolistId = 'a95fcd60-bb38-4966-99c4-5088a6bd7ef4';
    const title = 'updated new todo';

    useEffect(() => {
        todolistAPI.updateTodolist(todolistId, title).then(res => setState(res));
    }, []);

    return <div>{JSON.stringify(state)}</div>;
};

export const GetTasks = () => {
    const [state, setState] = useState<any>(null);
    const todolistId = '2b867055-1ae2-4712-a98a-aa8ba1ee74c0';

    useEffect(() => {
        todolistAPI.getTasks(todolistId).then(res => setState(res));
    }, []);

    return <div>{JSON.stringify(state)}</div>;
};
export const CreateTask = () => {
    const [state, setState] = useState<any>(null);
    const todolistId = '2b867055-1ae2-4712-a98a-aa8ba1ee74c0';
    const title = 'Aria3';

    useEffect(() => {
        todolistAPI.createTask(todolistId, title).then(res => setState(res));
    }, []);

    return <div>{JSON.stringify(state)}</div>;
};
export const DeleteTask = () => {
    const [state, setState] = useState<any>(null);
    const todolistId = '18602624-a501-45d5-afd5-b3eeca15e5a5';
    const taskID = '43650c3e-8b26-477b-8562-bd0e873b6631';

    useEffect(() => {
        todolistAPI.deleteTask(todolistId, taskID).then(res => setState(res));
    }, []);

    return <div>{JSON.stringify(state)}</div>;
};
export const UpdateTask = () => {
    const [state, setState] = useState<any>(null);
    const todolistId = '2b867055-1ae2-4712-a98a-aa8ba1ee74c0';
    const taskID = 'c772aef5-fe4d-40e1-935c-46e006eeea55';

    const title = 'Super Aria';
    const description = 'description 1';
    const status = 0;
    const priority = 0;
    const startDate = '';
    const deadline = '';

    useEffect(() => {
        todolistAPI.updateTask(todolistId, taskID, {
            title,
            description,
            status,
            priority,
            startDate,
            deadline,
        }).then(res => setState(res));
    }, []);

    return <div>{JSON.stringify(state)}</div>;
};


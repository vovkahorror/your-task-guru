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
    const todolistID = 'a603b3e3-ff10-4cd7-92de-4a4e01cb6c0e';

    useEffect(() => {
        todolistAPI.deleteTodolist(todolistID).then(res => setState(res));
    }, []);

    return <div>{JSON.stringify(state)}</div>;
};
export const UpdateTodolistTitle = () => {
    const [state, setState] = useState<any>(null);
    const todolistID = 'a95fcd60-bb38-4966-99c4-5088a6bd7ef4';
    const title = 'updated new todo';

    useEffect(() => {
        todolistAPI.updateTodolist(todolistID, title).then(res => setState(res));
    }, []);

    return <div>{JSON.stringify(state)}</div>;
};


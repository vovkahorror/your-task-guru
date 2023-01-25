import React, {useEffect, useState} from 'react';
import {todolistAPI} from '../api/todolist-api';

export default {
    title: 'API',
};

export const GetTodolists = () => {
    const [state, setState] = useState<any>(null);

    useEffect(() => {
        todolistAPI.getTodolists().then(res => setState(res.data));
    }, []);

    return <div>{JSON.stringify(state)}</div>;
};
export const CreateTodolist = () => {
    const [state, setState] = useState<any>(null);

    useEffect(() => {
        todolistAPI.createTodolist(state).then(res => setState(res.data));
    }, []);

    return <div>{JSON.stringify(state)}</div>;
};
export const DeleteTodolist = () => {
    const [state, setState] = useState<any>(null);
    const todolistID = 'e08d95d9-3ada-4223-9f0c-cbd223d98f39';

    useEffect(() => {
        todolistAPI.deleteTodolist(todolistID).then(res => setState(res.data));
    }, []);

    return <div>{JSON.stringify(state)}</div>;
};
export const UpdateTodolistTitle = () => {
    const [state, setState] = useState<any>(null);
    const todolistID = '6e204e03-8983-4195-957a-9584546f3b31';

    useEffect(() => {
        todolistAPI.updateTodolist(todolistID, state).then(res => setState(res.data));
    }, []);

    return <div>{JSON.stringify(state)}</div>;
};


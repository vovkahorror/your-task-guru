import React, {useCallback, useEffect} from 'react';
import {addTodolistsTC, getTodolistsTC, TodolistDomainType} from './todolists-reducer';
import {useAppSelector} from '../../custom-hooks/useAppSelector';
import {todolistsSelector} from './selectors/todolistsSelector';
import {useAppDispatch} from '../../custom-hooks/useAppDispatch';
import {Grid} from '@mui/material';
import {AddItemForm} from '../../components/AddItemForm/AddItemForm';
import Paper from '@mui/material/Paper';
import {Todolist} from './Todolist/Todolist';

export const TodolistsList = () => {
    useEffect(() => {
        dispatch(getTodolistsTC());
    }, []);

    const todolists = useAppSelector<TodolistDomainType[]>(todolistsSelector);

    const dispatch = useAppDispatch();

    const addTodolist = useCallback((title: string) => {
        dispatch(addTodolistsTC(title));
    }, [dispatch]);

    return (
        <>
            <Grid container style={{padding: '40px 40px 40px 0px'}}>
                <AddItemForm addItem={addTodolist}/>
            </Grid>

            <Grid container spacing={3}>
                {todolists.map(tl => {
                    return (
                        <Grid item key={tl.id}>
                            <Paper style={{padding: '10px'}}>
                                <Todolist
                                    todolist={tl}
                                />
                            </Paper>
                        </Grid>
                    );
                })}
            </Grid>
        </>
    );
};
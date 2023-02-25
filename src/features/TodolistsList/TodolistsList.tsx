import React, {useCallback, useEffect} from 'react';
import {addTodolistTC, getTodolistsTC, TodolistDomainType} from './todolists-reducer';
import {useAppSelector} from '../../utils/custom-hooks/useAppSelector';
import {todolistsSelector} from './selectors/todolistsSelector';
import {useAppDispatch} from '../../utils/custom-hooks/useAppDispatch';
import {Grid} from '@mui/material';
import {AddItemForm} from '../../components/AddItemForm/AddItemForm';
import Paper from '@mui/material/Paper';
import {Todolist} from './Todolist/Todolist';
import {Navigate} from 'react-router-dom';

export const TodolistsList = () => {
    const isLoggedIn = useAppSelector<boolean>(state => state.auth.isLoggedIn);

    useEffect(() => {
        if (!isLoggedIn) {
            return;
        }

        dispatch(getTodolistsTC());
    }, []);

    const todolists = useAppSelector<TodolistDomainType[]>(todolistsSelector);

    const dispatch = useAppDispatch();

    const addTodolist = useCallback((title: string) => {
        dispatch(addTodolistTC(title));
    }, [dispatch]);

    if (!isLoggedIn) {
        return <Navigate to={'/login'}/>;
    }

    return (
        <>
            <Grid container justifyContent={'center'} style={{padding: '40px 40px 40px 0px'}}>
                <AddItemForm addItem={addTodolist}/>
            </Grid>

            <Grid container spacing={5} justifyContent={'center'}>
                {todolists.map(tl => {
                    return (
                        <Grid item key={tl.id}>
                            <Paper elevation={5} style={{padding: '10px'}}>
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
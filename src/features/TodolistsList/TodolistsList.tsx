import React, {useEffect} from 'react';
import {useAppSelector} from '../../utils/custom-hooks/useAppSelector';
import {Grid} from '@mui/material';
import {AddItemForm} from '../../components/AddItemForm/AddItemForm';
import Paper from '@mui/material/Paper';
import {Todolist} from './Todolist/Todolist';
import {Navigate} from 'react-router-dom';
import {authSelectors} from '../Auth';
import {useActions} from '../../utils/custom-hooks/useActions';
import {selectTodolists, todolistsActions} from '.';

export const TodolistsList = () => {
    const isLoggedIn = useAppSelector(authSelectors.selectIsLoggedIn);
    const todolists = useAppSelector(selectTodolists);
    const {fetchTodolists, addTodolist} = useActions(todolistsActions);

    useEffect(() => {
        if (!isLoggedIn) {
            return;
        }

        fetchTodolists();
    }, []);

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
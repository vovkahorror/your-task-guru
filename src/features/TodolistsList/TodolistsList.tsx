import React, {useCallback, useEffect} from 'react';
import {useAppSelector} from '../../utils/custom-hooks/useAppSelector';
import {Grid} from '@mui/material';
import {AddItemForm, AddItemFormSubmitHelpersType} from '../../components/AddItemForm/AddItemForm';
import {Todolist} from './Todolist/Todolist';
import {Navigate} from 'react-router-dom';
import {authSelectors} from '../Auth';
import {useActions} from '../../utils/custom-hooks/useActions';
import {selectTodolists, todolistsActions} from '.';
import {useAppDispatch} from '../../utils/custom-hooks/useAppDispatch';

export const TodolistsList = () => {
    const isLoggedIn = useAppSelector(authSelectors.selectIsLoggedIn);
    const todolists = useAppSelector(selectTodolists);
    const {fetchTodolists} = useActions(todolistsActions);
    const dispatch = useAppDispatch();

    const addTodolistHandler = useCallback(async (title: string, helpers: AddItemFormSubmitHelpersType) => {
        const resultAction = await dispatch(todolistsActions.addTodolist(title));

        if (todolistsActions.addTodolist.rejected.match(resultAction)) {
            const errorMessage = resultAction.payload?.errors[0] || 'Some error occurred';
            helpers.setError(errorMessage);
        } else {
            helpers.setTitle('');
        }
    }, [])

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
            <Grid container justifyContent={'center'} padding={'40px'}>
                <AddItemForm addItem={addTodolistHandler}/>
            </Grid>

            <Grid container spacing={10} justifyContent={'center'}>
                {todolists.map(tl => {
                    return (
                        <Todolist key={tl.id}
                                  todolist={tl}
                        />
                    );
                })}
            </Grid>
        </>
    );
};
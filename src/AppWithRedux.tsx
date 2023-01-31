import React, {useCallback, useEffect} from 'react';
import './App.css';
import {AddItemForm} from './AddItemForm';
import ButtonAppBar from './ButtonAppBar';
import {Container, Grid} from '@mui/material';
import Paper from '@mui/material/Paper';
import {addTodolistAC, getTodolistsTC, setTodolistsAC, TodolistDomainType} from './state/todolists-reducer';
import {useSelector} from 'react-redux';
import {AppRootStateType} from './state/store';
import {TodolistWithRedux} from './TodolistWithRedux';
import {todolistsSelector} from './state/selectors/todolistsSelector';
import {AppDispatch} from './custom-hooks/AppDispatch';

function AppWithRedux() {
    useEffect(() => {
        dispatch(getTodolistsTC());
    }, []);

    const todolists = useSelector<AppRootStateType, TodolistDomainType[]>(todolistsSelector);

    const dispatch = AppDispatch();

    const addTodolist = useCallback((title: string) => {
        dispatch(addTodolistAC(title));
    }, [dispatch]);

    return (
        <div className='App'>
            <ButtonAppBar/>

            <Container fixed>

                <Grid container style={{padding: '40px 40px 40px 0px'}}>
                    <AddItemForm addItem={addTodolist}/>
                </Grid>

                <Grid container spacing={3}>
                    {todolists.map(tl => {
                        return (
                            <Grid item key={tl.id}>
                                <Paper style={{padding: '10px'}}>
                                    <TodolistWithRedux
                                        todolist={tl}
                                    />
                                </Paper>
                            </Grid>
                        );
                    })}
                </Grid>

            </Container>

        </div>
    );
}

export default AppWithRedux;

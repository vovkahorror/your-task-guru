import React, {useCallback} from 'react';
import './App.css';
import {AddItemForm} from './AddItemForm';
import ButtonAppBar from "./ButtonAppBar";
import {Container, Grid} from "@mui/material";
import Paper from '@mui/material/Paper';
import {addTodolistAC} from "./state/todolists-reducer";
import {useDispatch, useSelector} from "react-redux";
import {AppRootStateType} from "./state/store";
import {TaskType, TodolistWithRedux} from "./TodolistWithRedux";
import {todolistsSelector} from "./state/selectors/todolistsSelector";

export type FilterValuesType = "all" | "active" | "completed";
export type TodolistType = {
    id: string
    title: string
    filter: FilterValuesType
}

export type TasksStateType = {
    [key: string]: Array<TaskType>
}


function AppWithRedux() {
    const todolists = useSelector<AppRootStateType, TodolistType[]>(todolistsSelector);

    const dispatch = useDispatch();

    const addTodolist = useCallback((title: string) => {
        dispatch(addTodolistAC(title));
    }, [dispatch]);

    return (
        <div className="App">
            <ButtonAppBar/>

            <Container fixed>

                <Grid container style={{padding: "40px 40px 40px 0px"}}>
                    <AddItemForm addItem={addTodolist}/>
                </Grid>

                <Grid container spacing={3}>
                    {todolists.map(tl => {
                        return (
                            <Grid item key={tl.id}>
                                <Paper style={{padding: "10px"}}>
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

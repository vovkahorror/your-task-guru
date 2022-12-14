import React, {useCallback} from 'react';
import './App.css';
import {AddItemForm} from './AddItemForm';
import ButtonAppBar from "./ButtonAppBar";
import {Container, Grid} from "@mui/material";
import Paper from '@mui/material/Paper';
import {
    addTaskAC,
    changeTaskStatusAC,
    changeTaskTitleAC,
    removeTaskAC,
} from "./state/tasks-reducer";
import {
    addTodolistAC,
    changeFilterAC,
    changeTodolistTitleAC,
    removeTodolistAC,
} from "./state/todolists-reducer";
import {useDispatch, useSelector} from "react-redux";
import {AppRootStateType} from "./state/store";
import {TaskType, TodolistWithRedux} from "./TodolistWithRedux";

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
    const todolists = useSelector<AppRootStateType, TodolistType[]>(state => state.todolists);

    const dispatch = useDispatch();

    /*    function removeTask(id: string, todolistId: string) {
            dispatch(removeTaskAC(id, todolistId));
        }

        function addTask(title: string, todolistId: string) {
            dispatch(addTaskAC(title, todolistId));
        }

        function changeFilter(value: FilterValuesType, todolistId: string) {
            dispatch(changeFilterAC(value, todolistId));
        }

        function changeStatus(id: string, isDone: boolean, todolistId: string) {
            dispatch(changeTaskStatusAC(id, isDone, todolistId));
        }

        function changeTaskTitle(id: string, newTitle: string, todolistId: string) {
            dispatch(changeTaskTitleAC(id, newTitle, todolistId));
        }

        function removeTodolist(id: string) {
            dispatch(removeTodolistAC(id));
        }

        function changeTodolistTitle(todolistId: string, title: string) {
            dispatch(changeTodolistTitleAC(todolistId, title));
        }*/

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

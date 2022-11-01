import React, {useReducer} from 'react';
import './App.css';
import {TaskType, Todolist} from './Todolist';
import {v1} from 'uuid';
import {AddItemForm} from './AddItemForm';
import ButtonAppBar from "./ButtonAppBar";
import {Container, Grid} from "@mui/material";
import Paper from '@mui/material/Paper';
import {
    addTaskAC, addTodolistTaskAC,
    changeStatusAC,
    changeTaskTitleAC,
    removeTaskAC,
    removeTodolistTasksAC,
    TasksReducer,
} from "./reducers/tasksReducer";
import {
    addTodolistAC,
    changeFilterAC,
    changeTodolistTitleAC,
    removeTodolistAC,
    TodolistsReducer,
} from "./reducers/todolistsReducer";

export type FilterValuesType = "all" | "active" | "completed";
export type TodolistType = {
    id: string
    title: string
    filter: FilterValuesType
}

export type TasksStateType = {
    [key: string]: Array<TaskType>
}


function App() {
    function removeTask(id: string, todolistId: string) {
        tasksDispatch(removeTaskAC(id, todolistId));
    }

    function addTask(title: string, todolistId: string) {
        tasksDispatch(addTaskAC(title, todolistId));
    }

    function changeFilter(value: FilterValuesType, todolistId: string) {
        todolistsDispatch(changeFilterAC(value, todolistId));
    }

    function changeStatus(id: string, isDone: boolean, todolistId: string) {
        tasksDispatch(changeStatusAC(id, isDone, todolistId));
    }

    function changeTaskTitle(id: string, newTitle: string, todolistId: string) {
          tasksDispatch(changeTaskTitleAC(id, newTitle, todolistId));
    }

    function removeTodolist(id: string) {
        todolistsDispatch(removeTodolistAC(id));
        tasksDispatch(removeTodolistTasksAC(id));
    }

    function changeTodolistTitle(todolistId: string, title: string) {
        todolistsDispatch(changeTodolistTitleAC(todolistId, title));
    }

    const todolistId1 = v1();
    const todolistId2 = v1();

    const [todolists, todolistsDispatch] = useReducer(TodolistsReducer, [
        {id: todolistId1, title: "What to learn", filter: "all"},
        {id: todolistId2, title: "What to buy", filter: "all"},
    ]);

    const [tasks, tasksDispatch] = useReducer(TasksReducer, {
        [todolistId1]: [
            {id: v1(), title: "HTML&CSS", isDone: true},
            {id: v1(), title: "JS", isDone: true},
        ],
        [todolistId2]: [
            {id: v1(), title: "Milk", isDone: true},
            {id: v1(), title: "React Book", isDone: true},
        ],
    });

    function addTodolist(title: string) {
        const newTodolistId = v1();
        todolistsDispatch(addTodolistAC(newTodolistId, title));
        tasksDispatch(addTodolistTaskAC(newTodolistId));
    }

    return (
        <div className="App">
            <ButtonAppBar/>

            <Container fixed>

                <Grid container style={{padding: "40px 40px 40px 0px"}}>
                    <AddItemForm addItem={addTodolist}/>
                </Grid>

                <Grid container spacing={3}>
                    {todolists.map(tl => {
                        let allTodolistTasks = tasks[tl.id];
                        let tasksForTodolist = allTodolistTasks;

                        if (tl.filter === "active") {
                            tasksForTodolist = allTodolistTasks.filter(t => !t.isDone);
                        }
                        if (tl.filter === "completed") {
                            tasksForTodolist = allTodolistTasks.filter(t => t.isDone);
                        }

                        return <Grid item>
                            <Paper style={{padding: "10px"}}>
                                <Todolist
                                    key={tl.id}
                                    id={tl.id}
                                    title={tl.title}
                                    tasks={tasksForTodolist}
                                    removeTask={removeTask}
                                    changeFilter={changeFilter}
                                    addTask={addTask}
                                    changeTaskStatus={changeStatus}
                                    filter={tl.filter}
                                    removeTodolist={removeTodolist}
                                    changeTaskTitle={changeTaskTitle}
                                    changeTodolistTitle={changeTodolistTitle}
                                />
                            </Paper>
                        </Grid>;
                    })}
                </Grid>

            </Container>

        </div>
    );
}

export default App;

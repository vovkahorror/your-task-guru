import React, {useReducer} from 'react';
import './App.css';
import {Todolist} from './Todolist';
import {v1} from 'uuid';
import {AddItemForm} from '../components/AddItemForm/AddItemForm';
import ButtonAppBar from '../ButtonAppBar';
import {Container, Grid} from '@mui/material';
import Paper from '@mui/material/Paper';
import {
    addTaskAC,
    updateTaskAC,
    removeTaskAC,
    tasksReducer,
} from '../state/tasks-reducer';
import {
    addTodolistAC,
    changeFilterAC,
    changeTodolistTitleAC, FilterValuesType,
    removeTodolistAC,
    todolistsReducer,
} from '../state/todolists-reducer';
import {TaskPriorities, TaskStatuses} from '../api/todolist-api';

function App() {
    const todolistId1 = v1();
    const todolistId2 = v1();

    const [todolists, dispatchToTodolists] = useReducer(todolistsReducer, [
        {id: todolistId1, title: 'What to learn', filter: 'all', addedDate: '', order: 0},
        {id: todolistId2, title: 'What to buy', filter: 'all', addedDate: '', order: 0},
    ]);

    const [tasks, dispatchToTasks] = useReducer(tasksReducer, {
        [todolistId1]: [
            {
                id: v1(), title: 'HTML&CSS', status: TaskStatuses.Completed, todoListId: todolistId1, description: '',
                startDate: '', deadline: '', addedDate: '', order: 0, priority: TaskPriorities.Low,
            },
            {
                id: v1(), title: 'JS', status: TaskStatuses.Completed, todoListId: todolistId1, description: '',
                startDate: '', deadline: '', addedDate: '', order: 0, priority: TaskPriorities.Low,
            },
        ],
        [todolistId2]: [
            {
                id: v1(), title: 'Milk', status: TaskStatuses.Completed, todoListId: todolistId2, description: '',
                startDate: '', deadline: '', addedDate: '', order: 0, priority: TaskPriorities.Low,
            },
            {
                id: v1(), title: 'React Book', status: TaskStatuses.Completed, todoListId: todolistId2, description: '',
                startDate: '', deadline: '', addedDate: '', order: 0, priority: TaskPriorities.Low,
            },
        ],
    });

    function removeTask(id: string, todolistId: string) {
        dispatchToTasks(removeTaskAC(id, todolistId));
    }

    function addTask(title: string, todolistId: string) {
        const newTask = {
            id: v1(),
            title: title,
            status: TaskStatuses.New,
            todoListId: todolistId,
            description: '',
            startDate: '',
            deadline: '',
            addedDate: '',
            order: 0,
            priority: TaskPriorities.Low,
        };

        dispatchToTasks(addTaskAC(newTask));
    }

    function changeFilter(value: FilterValuesType, todolistId: string) {
        dispatchToTodolists(changeFilterAC(value, todolistId));
    }

    function changeStatus(id: string, status: TaskStatuses, todolistId: string) {
        dispatchToTasks(updateTaskAC(todolistId, id, {status}));
    }

    function changeTaskTitle(id: string, newTitle: string, todolistId: string) {
        dispatchToTasks(updateTaskAC(todolistId, id, {title: newTitle}));
    }

    function removeTodolist(id: string) {
        const action = removeTodolistAC(id);
        dispatchToTodolists(action);
        dispatchToTasks(action);
    }

    function changeTodolistTitle(todolistId: string, title: string) {
        dispatchToTodolists(changeTodolistTitleAC(todolistId, title));
    }

    function addTodolist(title: string) {
        const newTodolist = {
            id: v1(),
            addedDate: '',
            title,
            order: 0
        }

        const action = addTodolistAC(newTodolist);
        dispatchToTodolists(action);
        dispatchToTasks(action);
    }

    return (
        <div className='App'>
            <ButtonAppBar/>

            <Container fixed>

                <Grid container style={{padding: '40px 40px 40px 0px'}}>
                    <AddItemForm addItem={addTodolist}/>
                </Grid>

                <Grid container spacing={3}>
                    {todolists.map(tl => {
                        let allTodolistTasks = tasks[tl.id];
                        let tasksForTodolist = allTodolistTasks;

                        if (tl.filter === 'active') {
                            tasksForTodolist = allTodolistTasks.filter(t => t.status === TaskStatuses.New);
                        }
                        if (tl.filter === 'completed') {
                            tasksForTodolist = allTodolistTasks.filter(t => t.status === TaskStatuses.Completed);
                        }

                        return (
                            <Grid item key={tl.id}>
                                <Paper style={{padding: '10px'}}>
                                    <Todolist
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
                            </Grid>
                        );
                    })}
                </Grid>

            </Container>

        </div>
    );
}

export default App;
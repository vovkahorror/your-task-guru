import React, {useReducer} from 'react';
import './App.scss';
import {Todolist} from './Todolist';
import {v1} from 'uuid';
import {AddItemForm} from '../components/AddItemForm/AddItemForm';
import ButtonAppBar from '../app/ButtonAppBar';
import {Container, Grid} from '@mui/material';
import Paper from '@mui/material/Paper';
import {tasksReducer, todolistsReducer} from '../features/TodolistsList';
import {changeFilter, FilterValuesType} from '../features/TodolistsList/todolists-reducer';
import {addTask, removeTask, updateTask} from '../features/TodolistsList/tasks-actions';
import {addTodolist, changeTodolistTitle, removeTodolist} from '../features/TodolistsList/todolists-actions';
import {TaskPriorities, TaskStatuses} from '../api/types';

function App() {
    const todolistId1 = v1();
    const todolistId2 = v1();

    const [todolists, dispatchToTodolists] = useReducer(todolistsReducer, [
        {id: todolistId1, title: 'What to learn', filter: 'all', addedDate: '', order: 0, entityStatus: 'idle'},
        {id: todolistId2, title: 'What to buy', filter: 'all', addedDate: '', order: 0, entityStatus: 'idle'},
    ]);

    const [tasks, dispatchToTasks] = useReducer(tasksReducer, {
        [todolistId1]: [
            {
                id: v1(),
                title: 'HTML&CSS',
                status: TaskStatuses.Completed,
                todoListId: todolistId1,
                description: '',
                startDate: '',
                deadline: '',
                addedDate: '',
                order: 0,
                priority: TaskPriorities.Low,
                entityStatus: 'idle',
            },
            {
                id: v1(),
                title: 'JS',
                status: TaskStatuses.Completed,
                todoListId: todolistId1,
                description: '',
                startDate: '',
                deadline: '',
                addedDate: '',
                order: 0,
                priority: TaskPriorities.Low,
                entityStatus: 'idle',
            },
        ],
        [todolistId2]: [
            {
                id: v1(),
                title: 'Milk',
                status: TaskStatuses.Completed,
                todoListId: todolistId2,
                description: '',
                startDate: '',
                deadline: '',
                addedDate: '',
                order: 0,
                priority: TaskPriorities.Low,
                entityStatus: 'idle',
            },
            {
                id: v1(),
                title: 'React Book',
                status: TaskStatuses.Completed,
                todoListId: todolistId2,
                description: '',
                startDate: '',
                deadline: '',
                addedDate: '',
                order: 0,
                priority: TaskPriorities.Low,
                entityStatus: 'idle',
            },
        ],
    });

    function removeTaskHandler(taskId: string, todolistId: string) {
        const param = {taskId, todolistId};
        dispatchToTasks(removeTask.fulfilled(param, 'requestId', param));
    }

    function addTaskHandler(title: string, todolistId: string) {
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

        dispatchToTasks(addTask.fulfilled(newTask, 'requestId', {todolistId, title}));
    }

    function changeFilterHandler(value: FilterValuesType, todolistId: string) {
        dispatchToTodolists(changeFilter({value, todolistId}));
    }

    function changeStatus(taskId: string, status: TaskStatuses, todolistId: string) {
        const task = {todolistId, taskId, domainModel: {status}};
        dispatchToTasks(updateTask.fulfilled(task, 'requestId', task));
    }

    function changeTaskTitle(taskId: string, newTitle: string, todolistId: string) {
        const task = {todolistId, taskId, domainModel: {title: newTitle}};
        dispatchToTasks(updateTask.fulfilled(task, 'requestId', task));
    }

    function removeTodolistHandler(id: string) {
        const action = removeTodolist.fulfilled({todolistId: id}, 'requestId', id);
        dispatchToTodolists(action);
        dispatchToTasks(action);
    }

    function changeTodolistTitleHandler(todolistId: string, title: string) {
        dispatchToTodolists(changeTodolistTitle.fulfilled({todolistId, title}, 'requestId', {todolistId, title}));
    }

    async function addTodolistHandler(title: string) {
        const newTodolist = {
            id: v1(),
            addedDate: '',
            title,
            order: 0,
        };

        const action = addTodolist.fulfilled({todolist: newTodolist}, 'requestId', title);
        dispatchToTodolists(action);
        dispatchToTasks(action);
    }

    return (
        <div className="App">
            <ButtonAppBar/>

            <Container fixed>

                <Grid container style={{padding: '40px 40px 40px 0px'}}>
                    <AddItemForm addItem={addTodolistHandler}/>
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
                                        todolistId={tl.id}
                                        title={tl.title}
                                        tasks={tasksForTodolist}
                                        removeTask={removeTaskHandler}
                                        changeFilter={changeFilterHandler}
                                        addTask={addTaskHandler}
                                        changeTaskStatus={changeStatus}
                                        filter={tl.filter}
                                        removeTodolist={removeTodolistHandler}
                                        changeTaskTitle={changeTaskTitle}
                                        changeTodolistTitle={changeTodolistTitleHandler}
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

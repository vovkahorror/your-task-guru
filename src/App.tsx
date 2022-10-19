import React, {useState} from "react";
import "./App.css";
import {TaskType, Todolist} from "./Todolist";
import {v1} from "uuid";
import {Input} from "./components/Input";

export type FilterValuesType = 'all' | 'active' | 'completed';

type TodolistType = {
    id: string;
    title: string;
    filter: FilterValuesType;
}

type TaskStateType = {
    [key: string]: Array<TaskType>;
}

function App() {
    const todoListID1 = v1();
    const todoListID2 = v1();

    const [todolists, setTodolists] = useState<Array<TodolistType>>([
        {id: todoListID1, title: 'What to learn', filter: 'all'},
        {id: todoListID2, title: 'What to buy', filter: 'all'},
    ]);

    const [tasks, setTasks] = useState<TaskStateType>({
        [todoListID1]: [
            {id: v1(), title: "HTML&CSS", isDone: true},
            {id: v1(), title: "JS", isDone: true},
            {id: v1(), title: "ReactJS", isDone: false},
            {id: v1(), title: "Redux", isDone: true},
            {id: v1(), title: "ReduxToolkit", isDone: false},
        ],
        [todoListID2]: [
            {id: v1(), title: "HTML&CSS2", isDone: true},
            {id: v1(), title: "JS2", isDone: true},
            {id: v1(), title: "ReactJS2", isDone: false},
            {id: v1(), title: "Redux2", isDone: true},
            {id: v1(), title: "ReduxToolkit2", isDone: false},
        ],
    });

    const editTask = (todolistId: string, taskId: string, newTitle: string) => {
        setTasks({
            ...tasks,
            [todolistId]: tasks[todolistId].map((el) => el.id === taskId ? {...el, title: newTitle} : el),
        });
    };

    const editTodolist = (todolistId: string, newTitle: string) => {
        setTodolists(todolists.map(el => el.id === todolistId ? {...el, title: newTitle} : el));
    };

    const removeTask = (todoListID: string, taskId: string) => {
        setTasks({
            ...tasks, [todoListID]: tasks[todoListID].filter(el => {
                return el.id !== taskId;
            }),
        });
    };

    const addTask = (todoListID: string, title: string) => {
        const newTask: TaskType = {
            id: v1(),
            title: title,
            isDone: false,
        };
        setTasks({...tasks, [todoListID]: [newTask, ...tasks[todoListID]]});
    };

    const addTodolist = (newTitle: string) => {
        const newTodolistId = v1();
        const newTodolist: TodolistType = {id: newTodolistId, title: newTitle, filter: "all"};
        setTodolists([...todolists, newTodolist]);
        setTasks({...tasks, [newTodolistId]: []});
    };

    const changeTaskStatus = (todoListID: string, taskId: string, newStatus: boolean) => {
        setTasks({
            ...tasks, [todoListID]: tasks[todoListID].map(el => {
                return el.id === taskId ? {...el, isDone: newStatus} : el;
            }),
        });
    };

    const changeFilter = (todoListID: string, value: FilterValuesType) => {
        setTodolists(todolists.map(el => {
            return el.id === todoListID ? {...el, filter: value} : el;
        }));
    };

    const removeTodoList = (todoListID: string) => {
        setTodolists(todolists.filter(el => el.id !== todoListID));
        delete tasks[todoListID];
    };

    return (
        <div className="App">
            <Input callback={addTodolist}/>
            {todolists.map(el => {
                let tasksForTodoList = tasks[el.id];
                if (el.filter === 'active') {
                    tasksForTodoList = tasks[el.id].filter(task => !task.isDone);
                }
                if (el.filter === 'completed') {
                    tasksForTodoList = tasks[el.id].filter(task => task.isDone);
                }

                return (
                    <Todolist
                        key={el.id}
                        todoListID={el.id}
                        title={el.title}
                        tasks={tasksForTodoList}
                        filter={el.filter}
                        removeTask={removeTask}
                        changeFilter={changeFilter}
                        addTask={addTask}
                        changeTaskStatus={changeTaskStatus}
                        removeTodoList={removeTodoList}
                        editTask={editTask}
                        editTodolist={editTodolist}
                    />
                );
            })}
        </div>
    );
}

export default App;

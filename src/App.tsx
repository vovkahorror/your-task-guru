import React, {useState} from "react";
import "./App.css";
import {TaskType, Todolist} from "./Todolist";
import {v1} from "uuid";

export type FilterValuesType = 'all' | 'active' | 'completed';

function App() {
    const todoListTitle: string = "What to learn";
    const [tasks, setTasks] = useState<Array<TaskType>>([
        {id: v1(), title: "HTML&CSS", isDone: true},
        {id: v1(), title: "JS", isDone: true},
        {id: v1(), title: "ReactJS", isDone: false},
        {id: v1(), title: "Redux", isDone: true},
        {id: v1(), title: "ReduxToolkit", isDone: false},
    ]);
    const [filter, setFilter] = useState<FilterValuesType>('all');

    const removeTask = (taskId: string) => {
        setTasks(tasks.filter(task => task.id !== taskId));
    };
    const addTask = (title: string) => {
        const newTask: TaskType = {
            id: v1(),
            title: title,
            isDone: false,
        };
        setTasks([...tasks, newTask]);
    };
    const changeTaskStatus = (taskId: string, newStatus: boolean) => {
        setTasks(tasks.map(t => t.id === taskId ? {...t, isDone: newStatus} : t));
    };

    const changeFilter = (filter: FilterValuesType) => {
        setFilter(filter);
    };

    const getFilteredTasks = (tasks: Array<TaskType>, filter: FilterValuesType) => {
        let tasksForTodoList = tasks;
        if (filter === 'active') {
            tasksForTodoList = tasks.filter(task => !task.isDone);
        }
        if (filter === 'completed') {
            tasksForTodoList = tasks.filter(task => task.isDone);
        }
        return tasksForTodoList;
    };

    return (
        <div className="App">
            <Todolist
                title={todoListTitle}
                tasks={getFilteredTasks(tasks, filter)}
                filter={filter}
                removeTask={removeTask}
                changeFilter={changeFilter}
                addTask={addTask}
                changeTaskStatus={changeTaskStatus}
            />
        </div>
    );
}

export default App;

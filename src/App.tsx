import React, {useState} from "react";
import "./App.css";
import {TaskType, Todolist} from "./Todolist";

export type FilterValuesType = 'all' | 'active' | 'completed';

function App() {
    const todoListTitle: string = "What to learn";
    const [tasks, setTasks] = useState<Array<TaskType>>([
        {id: 1, title: "HTML&CSS", isDone: true},
        {id: 2, title: "JS", isDone: true},
        {id: 3, title: "ReactJS", isDone: false},
        {id: 4, title: "Redux", isDone: true},
        {id: 5, title: "ReduxToolkit", isDone: false},
    ]);
    const [filter, setFilter] = useState<FilterValuesType>('all')

    const removeTask = (taskId: number) => {
        setTasks(tasks.filter(task => task.id !== taskId))
    }
    const changeFilter = (filter: FilterValuesType) => {
        setFilter(filter);
    }

    let tasksForTodoList = tasks;
    if (filter === 'active') {
        tasksForTodoList = tasks.filter(task => task.isDone === false);
    }
    if (filter === 'completed') {
        tasksForTodoList = tasks.filter(task => task.isDone === true);
    }

    return (
        <div className="App">
            <Todolist
                title={todoListTitle}
                tasks={tasksForTodoList}
                removeTask={removeTask}
                changeFilter={changeFilter}/>
        </div>
    );
}

export default App;

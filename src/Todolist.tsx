import React, {useState, KeyboardEvent, ChangeEvent} from "react";
import {FilterValuesType} from "./App";

export type TaskType = {
    id: string;
    title: string;
    isDone: boolean;
};

type TodolistPropsType = {
    title: string;
    tasks: Array<TaskType>;
    filter: FilterValuesType;
    removeTask: (taskId: string) => void;
    changeFilter: (filter: FilterValuesType) => void;
    addTask: (title: string) => void;
    changeTaskStatus: (taskId: string, newStatus: boolean) => void;
};

export function Todolist(props: TodolistPropsType) {
    const [title, setTitle] = useState<string>('');
    const [error, setError] = useState<boolean>(false);

    const getTaskListItem = (task: TaskType) => {
        const removeTask = () => props.removeTask(task.id);
        const changeTaskStatus = (e: ChangeEvent<HTMLInputElement>) => {
            props.changeTaskStatus(task.id, e.currentTarget.checked);
        };

        return (
            <li key={task.id} className={task.isDone ? 'isDone' : 'notIsDone'}>
                <input
                    onChange={changeTaskStatus}
                    type="checkbox"
                    checked={task.isDone}/>{" "}
                <span>{task.title}</span>
                <button onClick={removeTask}>✖</button>
            </li>
        );
    };

    const tasksList = props.tasks.length ?
        <ul>{props.tasks.map(getTaskListItem)}</ul> :
        <span>Your tasklist is empty</span>;

    const addTask = () => {
        const trimmedTitle = title.trim();
        trimmedTitle ? props.addTask(trimmedTitle) : setError(true);
        setTitle('');
    };

    const handlerCreator = (filter: FilterValuesType) => {
        return () => props.changeFilter(filter);
    };

    const onChangeSetLocalTitle = (event: ChangeEvent<HTMLInputElement>) => {
        error && setError(false);
        setTitle(event.currentTarget.value);
    };
    const onEnterDownAddTask = (event: KeyboardEvent<HTMLInputElement>) => event.key === 'Enter' && addTask();
    const errorMessage = error ? <div style={{fontWeight: 'bold', color: 'hotpink'}}>Tittle is required</div> : null;

    return (
        <div>
            <h3>{props.title}</h3>
            <div>
                <input
                    value={title}
                    onChange={onChangeSetLocalTitle}
                    onKeyDown={onEnterDownAddTask}
                    className={error ? 'error' : ''}
                />
                <button onClick={addTask}>+</button>
                {errorMessage}
            </div>
            <div>{tasksList}</div>

            <div>
                <button
                    className={props.filter === 'all' ? 'btn activeBtn' : 'btn'}
                    onClick={handlerCreator('all')}>All
                </button>
                <button
                    className={props.filter === 'active' ? 'btn activeBtn' : 'btn'}
                    onClick={handlerCreator('active')}>Active
                </button>
                <button
                    className={props.filter === 'completed' ? 'btn activeBtn' : 'btn'}
                    onClick={handlerCreator('completed')}>Completed
                </button>
            </div>
        </div>
    );
}

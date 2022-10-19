import React, {ChangeEvent} from "react";
import {FilterValuesType} from "./App";
import {Input} from "./components/Input";
import {EditableSpan} from "./components/EditableSpan";

export type TaskType = {
    id: string;
    title: string;
    isDone: boolean;
};

type TodolistPropsType = {
    todoListID: string;
    title: string;
    tasks: Array<TaskType>;
    filter: FilterValuesType;
    removeTask: (todoListID: string, taskId: string) => void;
    changeFilter: (todoListID: string, filter: FilterValuesType) => void;
    addTask: (todoListID: string, title: string) => void;
    changeTaskStatus: (todoListID: string, taskId: string, newStatus: boolean) => void;
    removeTodoList: (todoListID: string) => void;
    editTask: (todolistId: string, taskId: string, newTitle: string) => void;
    editTodolist: (todolistId: string, newTitle: string) => void;
};

export function Todolist(props: TodolistPropsType) {
    const getTaskListItem = (task: TaskType) => {
        const removeTask = () => props.removeTask(props.todoListID, task.id);
        const changeTaskStatus = (e: ChangeEvent<HTMLInputElement>) => {
            props.changeTaskStatus(props.todoListID, task.id, e.currentTarget.checked);
        };

        return (
            <li key={task.id} className={task.isDone ? 'isDone' : 'notIsDone'}>
                <input
                    onChange={changeTaskStatus}
                    type="checkbox"
                    checked={task.isDone}/>{" "}
                <EditableSpan title={task.title} callback={(newTitle) => editTaskHandler(task.id, newTitle)}/>
                <button onClick={removeTask}>✖</button>
            </li>
        );
    };

    const tasksList = props.tasks.length ?
        <ul>{props.tasks.map(getTaskListItem)}</ul> :
        <span>Your tasklist is empty</span>;

    const AddTaskHandler = (newTitle: string) => {
        props.addTask(props.todoListID, newTitle);
    };

    const handlerCreator = (todoListID: string, filter: FilterValuesType) => {
        return () => props.changeFilter(todoListID, filter);
    };

    const removeTodoListHandler = () => {
        props.removeTodoList(props.todoListID);
    };

    const editTodolistHandler = (newTitle: string) => {
        props.editTodolist(props.todoListID, newTitle);
    };

    const editTaskHandler = (tID: string, newTitle: string) => {
        props.editTask(props.todoListID, tID, newTitle);
    };

    return (
        <div>
            <h3>
                <EditableSpan title={props.title} callback={editTodolistHandler}/>
                <button onClick={removeTodoListHandler}>X</button>
            </h3>
            <Input callback={AddTaskHandler}/>
            <div>{tasksList}</div>

            <div>
                <button
                    className={props.filter === 'all' ? 'btn activeBtn' : 'btn'}
                    onClick={handlerCreator(props.todoListID, 'all')}>All
                </button>
                <button
                    className={props.filter === 'active' ? 'btn activeBtn' : 'btn'}
                    onClick={handlerCreator(props.todoListID, 'active')}>Active
                </button>
                <button
                    className={props.filter === 'completed' ? 'btn activeBtn' : 'btn'}
                    onClick={handlerCreator(props.todoListID, 'completed')}>Completed
                </button>
            </div>
        </div>
    );
}

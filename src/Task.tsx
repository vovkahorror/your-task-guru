import React, {FC} from 'react';
import Checkbox from "@mui/material/Checkbox";
import {EditableSpan} from "./EditableSpan";
import IconButton from "@mui/material/IconButton";
import DeleteIcon from "@mui/icons-material/Delete";
import {TaskType} from './TodolistWithRedux';

export type TaskPropsType = {
    task: TaskType;
    removeTask: (taskId: string, todolistId: string) => void;
    changeTaskStatus: (taskId: string, isDone: boolean, todolistId: string) => void;
    changeTaskTitle: (taskId: string, newTitle: string, todolistId: string) => void;
}

const Task: FC<TaskPropsType> = ({task, removeTask, changeTaskStatus, changeTaskTitle}) => {
    return (
        <li className={t.isDone ? "is-done" : "not-is-done"}>
            <Checkbox color={'primary'} checked={t.isDone} onChange={onChangeHandler}/>
            <EditableSpan value={t.title} onChange={onTitleChangeHandler}/>
            <IconButton aria-label="delete" onClick={onClickHandler}>
                <DeleteIcon/>
            </IconButton>
        </li>
    );
};

export default Task;
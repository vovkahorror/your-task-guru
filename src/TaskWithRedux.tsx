import React, {ChangeEvent, FC, memo} from 'react';
import Checkbox from "@mui/material/Checkbox";
import {EditableSpan} from "./EditableSpan";
import IconButton from "@mui/material/IconButton";
import DeleteIcon from "@mui/icons-material/Delete";
import {TaskType} from './TodolistWithRedux';
import {changeTaskStatusAC, changeTaskTitleAC, removeTaskAC} from "./state/tasks-reducer";
import {useDispatch} from "react-redux";

export type TaskWithReduxPropsType = {
    task: TaskType;
    todolistId: string
}

const TaskWithRedux: FC<TaskWithReduxPropsType> = memo(({task, todolistId}) => {
    const dispatch = useDispatch();

    const onClickHandler = () => dispatch(removeTaskAC(task.id, todolistId));
    const onChangeHandler = (e: ChangeEvent<HTMLInputElement>) => {
        const newIsDoneValue = e.currentTarget.checked;
        dispatch(changeTaskStatusAC(task.id, newIsDoneValue, todolistId));
    };
    const onTitleChangeHandler = (newValue: string) => {
        dispatch(changeTaskTitleAC(task.id, newValue, todolistId));
    };

    return (
        <li className={task.isDone ? "is-done" : "not-is-done"}>
            <Checkbox color={'primary'} checked={task.isDone} onChange={onChangeHandler}/>
            <EditableSpan value={task.title} onChange={onTitleChangeHandler}/>
            <IconButton aria-label="delete" onClick={onClickHandler}>
                <DeleteIcon/>
            </IconButton>
        </li>
    );
});

export default TaskWithRedux;
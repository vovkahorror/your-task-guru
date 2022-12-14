import React, {ChangeEvent, FC, memo, useCallback} from 'react';
import {TodolistType} from "./AppWithRedux";
import {EditableSpan} from "./EditableSpan";
import IconButton from "@mui/material/IconButton";
import DeleteIcon from "@mui/icons-material/Delete";
import {AddItemForm} from "./AddItemForm";
import Checkbox from "@mui/material/Checkbox";
import Button from "@mui/material/Button";
import {useDispatch, useSelector} from "react-redux";
import {AppRootStateType} from "./state/store";
import {addTaskAC, changeTaskStatusAC, changeTaskTitleAC, removeTaskAC} from "./state/tasks-reducer";
import {changeFilterAC, changeTodolistTitleAC, removeTodolistAC} from "./state/todolists-reducer";

export type TaskType = {
    id: string
    title: string
    isDone: boolean
}

export type TodolistWithReduxPropsType = {
    todolist: TodolistType;
}

export const TodolistWithRedux: FC<TodolistWithReduxPropsType> = memo(({todolist}) => {
    console.log('TodolistWithRedux');
    const {id, title, filter} = todolist;

    let tasks = useSelector<AppRootStateType, Array<TaskType>>(state => state.tasks[id]);

    const dispatch = useDispatch();

    const addTask = useCallback((title: string) => {
        dispatch(addTaskAC(title, id));
    }, [dispatch, id]);

    const removeTodolist = useCallback(() => {
        dispatch(removeTodolistAC(id));
    }, [dispatch, id]);

    const changeTodolistTitle = useCallback((title: string) => {
        dispatch(changeTodolistTitleAC(id, title));
    }, [dispatch, id]);

    const onAllClickHandler = useCallback(() => {
        dispatch(changeFilterAC("all", id));
    }, [dispatch, filter, id]);
    const onActiveClickHandler = useCallback(() => {
        dispatch(changeFilterAC("active", id));
    }, [dispatch, filter, id]);
    const onCompletedClickHandler = useCallback(() => {
        dispatch(changeFilterAC("completed", id));
    }, [dispatch, filter, id]);

    if (filter === "active") {
        tasks = tasks.filter(t => !t.isDone);
    }
    if (filter === "completed") {
        tasks = tasks.filter(t => t.isDone);
    }

    return <div>
        <h3><EditableSpan value={title} onChange={changeTodolistTitle}/>
            <IconButton aria-label="delete" onClick={removeTodolist}>
                <DeleteIcon/>
            </IconButton>
        </h3>
        <AddItemForm addItem={addTask}/>
        <ul>
            {
                tasks.map(t => {
                    const onClickHandler = () => dispatch(removeTaskAC(t.id, id));
                    const onChangeHandler = (e: ChangeEvent<HTMLInputElement>) => {
                        const newIsDoneValue = e.currentTarget.checked;
                        dispatch(changeTaskStatusAC(t.id, newIsDoneValue, id));
                    };
                    const onTitleChangeHandler = (newValue: string) => {
                        dispatch(changeTaskTitleAC(t.id, newValue, id));
                    };


                    return <li key={t.id} className={t.isDone ? "is-done" : "not-is-done"}>
                        <Checkbox color={'primary'} checked={t.isDone} onChange={onChangeHandler}/>
                        <EditableSpan value={t.title} onChange={onTitleChangeHandler}/>
                        <IconButton aria-label="delete" onClick={onClickHandler}>
                            <DeleteIcon/>
                        </IconButton>
                    </li>;
                })
            }
        </ul>
        <div>
            <Button variant={filter === 'all' ? "outlined" : "contained"} color="secondary"
                    onClick={onAllClickHandler}>All</Button>
            <Button variant={filter === 'active' ? "outlined" : "contained"} color="success"
                    onClick={onActiveClickHandler}>Active</Button>
            <Button variant={filter === 'completed' ? "outlined" : "contained"} color="error"
                    onClick={onCompletedClickHandler}>Completed</Button>
        </div>
    </div>;
});
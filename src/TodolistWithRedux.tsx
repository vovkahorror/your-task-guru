import React, {ChangeEvent, FC} from 'react';
import {TodolistType} from "./AppWithRedux";
import {EditableSpan} from "./EditableSpan";
import IconButton from "@mui/material/IconButton";
import DeleteIcon from "@mui/icons-material/Delete";
import {AddItemForm} from "./AddItemForm";
import Checkbox from "@mui/material/Checkbox";
import Button from "@mui/material/Button";
import {useDispatch, useSelector} from "react-redux";
import {AppRootStateType} from "./state/store";
import {TaskType} from "./Todolist";

export type TodolistWithReduxPropsType = {
    todolist: TodolistType;
}

export const TodolistWithRedux: FC<TodolistWithReduxPropsType> = ({todolist}) => {
    const {id, title, filter} = todolist;

    const tasks = useSelector<AppRootStateType, Array<TaskType>>(state => state.tasks[id]);

    const dispatch = useDispatch();

    const addTask = (title: string) => {
        props.addTask(title, props.id);
    };

    const removeTodolist = () => {
        props.removeTodolist(props.id);
    };
    const changeTodolistTitle = (title: string) => {
        props.changeTodolistTitle(props.id, title);
    };

    const onAllClickHandler = () => props.changeFilter("all", props.id);
    const onActiveClickHandler = () => props.changeFilter("active", props.id);
    const onCompletedClickHandler = () => props.changeFilter("completed", props.id);

    return <div>
        <h3><EditableSpan value={title} onChange={changeTodolistTitle}/>
            <IconButton aria-label="delete" onClick={removeTodolist}>
                <DeleteIcon/>
            </IconButton>
        </h3>
        <AddItemForm addItem={addTask}/>
        <ul>
            {
                props.tasks.map(t => {
                    const onClickHandler = () => props.removeTask(t.id, props.id);
                    const onChangeHandler = (e: ChangeEvent<HTMLInputElement>) => {
                        let newIsDoneValue = e.currentTarget.checked;
                        props.changeTaskStatus(t.id, newIsDoneValue, props.id);
                    };
                    const onTitleChangeHandler = (newValue: string) => {
                        props.changeTaskTitle(t.id, newValue, props.id);
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
};
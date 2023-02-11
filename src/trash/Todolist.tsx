import React, {ChangeEvent} from 'react';
import {AddItemForm} from '../components/AddItemForm/AddItemForm';
import {EditableSpan} from '../components/EditableSpan/EditableSpan';
import IconButton from '@mui/material/IconButton';
import DeleteIcon from '@mui/icons-material/Delete';
import Button from '@mui/material/Button';
import Checkbox from '@mui/material/Checkbox';
import {TaskStatuses, TaskType} from '../api/todolist-api';
import {FilterValuesType} from '../state/todolists-reducer';

type PropsType = {
    id: string
    title: string
    tasks: Array<TaskType>
    removeTask: (taskId: string, todolistId: string) => void
    changeFilter: (value: FilterValuesType, todolistId: string) => void
    addTask: (title: string, todolistId: string) => void
    changeTaskStatus: (id: string, status: TaskStatuses, todolistId: string) => void
    removeTodolist: (id: string) => void
    changeTodolistTitle: (id: string, newTitle: string) => void
    filter: FilterValuesType
    changeTaskTitle: (taskId: string, newTitle: string, todolistId: string) => void
}

export function Todolist(props: PropsType) {
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
        <h3><EditableSpan value={props.title} onChange={changeTodolistTitle}/>
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
                        let newStatusValue = e.currentTarget.checked ? TaskStatuses.Completed : TaskStatuses.New;
                        props.changeTaskStatus(t.id, newStatusValue, props.id);
                    };
                    const onTitleChangeHandler = (newValue: string) => {
                        props.changeTaskTitle(t.id, newValue, props.id);
                    };


                    return <li key={t.id} className={t.status === TaskStatuses.Completed ? "is-done" : "not-is-done"}>
                        <Checkbox color={'primary'} checked={t.status === TaskStatuses.Completed} onChange={onChangeHandler}/>
                        <EditableSpan value={t.title} onChange={onTitleChangeHandler}/>
                        <IconButton aria-label="delete" onClick={onClickHandler}>
                            <DeleteIcon/>
                        </IconButton>
                    </li>;
                })
            }
        </ul>
        <div>
            <Button variant={props.filter === 'all' ? "outlined" : "contained"} color="secondary"
                    onClick={onAllClickHandler}>All</Button>
            <Button variant={props.filter === 'active' ? "outlined" : "contained"} color="success"
                    onClick={onActiveClickHandler}>Active</Button>
            <Button variant={props.filter === 'completed' ? "outlined" : "contained"} color="error"
                    onClick={onCompletedClickHandler}>Completed</Button>
        </div>
    </div>;
}



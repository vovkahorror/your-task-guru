import React, {FC, memo, useCallback} from 'react';
import {EditableSpan} from '../../../components/EditableSpan/EditableSpan';
import IconButton from '@mui/material/IconButton';
import DeleteIcon from '@mui/icons-material/Delete';
import {AddItemForm, AddItemFormSubmitHelpersType} from '../../../components/AddItemForm/AddItemForm';
import Button from '@mui/material/Button';
import {FilterValuesType, TodolistDomainType} from '../todolists-reducer';
import Task from './Task/Task';
import {useAppSelector} from '../../../utils/custom-hooks/useAppSelector';
import {selectIsShowedTodolistNotification, selectTasks, tasksActions, todolistsActions} from '..';
import {useActions} from '../../../utils/custom-hooks/useActions';
import {appActions} from '../../../app';
import styles from './Todolist.module.scss';
import {Grid, Paper} from '@mui/material';
import {useAppDispatch} from '../../../utils/custom-hooks/useAppDispatch';
import {TaskStatuses} from '../../../api/types';
import tapeImage from '../../../assets/images/tape.png';
import paperTextureImage from '../../../assets/images/paper-texture.jpg';
import Box from '@mui/material/Box';

export type TodolistPropsType = {
    todolist: TodolistDomainType;
}

export const Todolist: FC<TodolistPropsType> = memo(({todolist}) => {
    const {id, title, filter, entityStatus} = todolist;
    let tasks = useAppSelector(selectTasks(id));
    const isShowedTodolistNotification = useAppSelector(selectIsShowedTodolistNotification);
    const {removeTodolist, changeTodolistTitle, changeFilter} = useActions(todolistsActions);
    const {setTodolistNotificationShowing} = useActions(appActions);
    const dispatch = useAppDispatch();

    const addTaskHandler = useCallback(async (title: string, helpers: AddItemFormSubmitHelpersType) => {
        const resultAction = await dispatch(tasksActions.addTask({todolistId: id, title}));

        if (tasksActions.addTask.rejected.match(resultAction)) {
            const errorMessage = resultAction.payload?.errors[0] || 'Some error occurred';
            helpers.setError(errorMessage);
        } else {
            helpers.setTitle('');
        }
    }, [id]);

    const removeTodolistHandler = useCallback(() => {
        removeTodolist(id);
    }, [id]);

    const changeTodolistTitleHandler = useCallback((title: string) => {
        changeTodolistTitle({todolistId: id, title});
    }, [id]);

    const onFilterButtonClickHandler = useCallback((newFilter: FilterValuesType) => {
        if (filter !== newFilter) {
            changeFilter({value: newFilter, todolistId: id});
        }
    }, [filter, id]);

    const setNotificationShowing = useCallback((isShowedTodolistNotification: boolean) => {
        setTodolistNotificationShowing({isShowedTodolistNotification});
    }, []);

    if (filter === 'active') {
        tasks = tasks.filter(t => t.status === TaskStatuses.New);
    }
    if (filter === 'completed') {
        tasks = tasks.filter(t => t.status === TaskStatuses.Completed);
    }

    const renderFilterButton = (buttonFilter: FilterValuesType, text: string) => {
        return (
            <ButtonWithMemo variant={filter === buttonFilter ? 'contained' : 'outlined'} color={'success'}
                            onClick={() => onFilterButtonClickHandler(buttonFilter)} title={text}/>
        );
    };

    return (
        <Grid item className={styles.todolistWrapper}>
            <Paper className={styles.todolist} elevation={5} sx={{backgroundImage: `url(${paperTextureImage})`}}>
                <img className={styles.topTape} src={tapeImage} alt=""/>
                <h3 className={styles.title}>
                    <EditableSpan value={title} onChange={changeTodolistTitleHandler} titleType={'To-Do list'}
                                  disabled={entityStatus === 'loading'}
                                  isShowedNotification={isShowedTodolistNotification}
                                  setNotificationShowing={setNotificationShowing}/>
                    <IconButton className={styles.deleteButton} aria-label="delete"
                                disabled={entityStatus === 'loading'} onClick={removeTodolistHandler}>
                        <DeleteIcon/>
                    </IconButton>
                </h3>
                <Box alignSelf={'center'}>
                    <AddItemForm addItem={addTaskHandler} disabled={entityStatus === 'loading'}/>
                </Box>
                <ul className={styles.list}>
                    {
                        tasks.map(t => {
                            return (
                                <Task
                                    key={t.id}
                                    task={t}
                                    todolistId={id}
                                />
                            );
                        })
                    }
                    {!tasks.length && <div>No tasks</div>}
                </ul>
                <div className={styles.buttons}>
                    {renderFilterButton('all', 'All')}
                    {renderFilterButton('active', 'Active')}
                    {renderFilterButton('completed', 'Completed')}
                </div>
                <img className={styles.bottomTape} src={tapeImage} alt=""/>
            </Paper>
        </Grid>
    );
});

const ButtonWithMemo: FC<ButtonWithMemoPropsType> = memo(({variant, color, onClick, title}) => {
    return <Button className={styles.filterButton} variant={variant} color={color} onClick={onClick}>{title}</Button>;
});

type ColorType = 'error' | 'inherit' | 'primary' | 'secondary' | 'success' | 'info' | 'warning' | undefined;

type ButtonWithMemoPropsType = {
    variant: 'text' | 'outlined' | 'contained';
    color: ColorType;
    onClick: () => void;
    title: string;
}

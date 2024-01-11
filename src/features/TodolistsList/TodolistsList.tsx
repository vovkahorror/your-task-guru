import React, {useCallback, useEffect} from 'react';
import {useAppSelector} from '../../utils/custom-hooks/useAppSelector';
import {Grid} from '@mui/material';
import {AddItemForm, AddItemFormSubmitHelpersType} from '../../components/AddItemForm/AddItemForm';
import {Todolist} from './Todolist/Todolist';
import {Navigate} from 'react-router-dom';
import {authSelectors} from '../Auth';
import {useActions} from '../../utils/custom-hooks/useActions';
import {selectTodolists, todolistsActions} from '.';
import {useAppDispatch} from '../../utils/custom-hooks/useAppDispatch';
import styles from './TodolistsList.module.scss';
import {closestCenter, DndContext, DragEndEvent, KeyboardSensor, useSensor, useSensors} from '@dnd-kit/core';
import {rectSortingStrategy, SortableContext, sortableKeyboardCoordinates} from '@dnd-kit/sortable';
import {SmartMouseSensor} from '../../common/custom-sensors/SmartMouseSensor';
import {SmartTouchSensor} from '../../common/custom-sensors/SmartTouchSensor';

export const TodolistsList = () => {
    const isLoggedIn = useAppSelector(authSelectors.selectIsLoggedIn);
    const todolists = useAppSelector(selectTodolists);
    const {fetchTodolists, reorderTodolist} = useActions(todolistsActions);
    const dispatch = useAppDispatch();

    const sensors = useSensors(
        useSensor(SmartMouseSensor),
        useSensor(SmartTouchSensor),
        useSensor(KeyboardSensor, {
            coordinateGetter: sortableKeyboardCoordinates,
        }),
    );

    const isMobile = () => window.innerWidth <= 768;

    const addTodolistHandler = useCallback(async (title: string, helpers: AddItemFormSubmitHelpersType) => {
        const resultAction = await dispatch(todolistsActions.addTodolist(title));

        if (todolistsActions.addTodolist.rejected.match(resultAction)) {
            const errorMessage = resultAction.payload?.errors[0] || 'Some error occurred';
            helpers.setError(errorMessage);
        } else {
            helpers.setTitle('');
        }
    }, []);

    const handleDragEnd = (event: DragEndEvent) => {
        const {active, over} = event;

        if (active.id !== over?.id) {
            reorderTodolist({todolistId: active.id, overTodolistId: over?.id});
        }
    };

    useEffect(() => {
        if (!isLoggedIn) {
            return;
        }

        fetchTodolists();
    }, []);

    if (!isLoggedIn) {
        return <Navigate to={'/login'}/>;
    }

    return (
        <>
            <Grid className={styles.addTodolist} container justifyContent={'center'} padding={'40px'}
                  marginBottom={'20px'}>
                <AddItemForm addItem={addTodolistHandler}/>
            </Grid>

            <DndContext
                sensors={sensors}
                collisionDetection={closestCenter}
                onDragEnd={handleDragEnd}
                autoScroll={isMobile()}
            >
                <SortableContext
                    items={todolists}
                    strategy={rectSortingStrategy}
                >
                    <Grid container
                          className={styles.gridContainer}
                          gap={10}>
                        {todolists.map(tl => {
                            return (
                                <Todolist key={tl.id}
                                          todolist={tl}
                                />
                            );
                        })}
                    </Grid>
                </SortableContext>
            </DndContext>
        </>
    );
};
import React, {useCallback, useEffect, useState} from 'react';
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
import {
    Active,
    closestCenter,
    DndContext,
    DragEndEvent,
    DragOverlay, DragStartEvent,
    KeyboardSensor,
    useSensor,
    useSensors,
} from '@dnd-kit/core';
import {rectSortingStrategy, SortableContext, sortableKeyboardCoordinates} from '@dnd-kit/sortable';
import {SmartMouseSensor} from '../../common/custom-sensors/SmartMouseSensor';
import {SmartTouchSensor} from '../../common/custom-sensors/SmartTouchSensor';

export const TodolistsList = () => {
    const isLoggedIn = useAppSelector(authSelectors.selectIsLoggedIn);
    const todolists = useAppSelector(selectTodolists);
    const {fetchTodolists, reorderTodolist} = useActions(todolistsActions);
    const dispatch = useAppDispatch();
    const [active, setActive] = useState<Active | null>(null);

    const sensors = useSensors(
        useSensor(SmartMouseSensor),
        useSensor(SmartTouchSensor, {
            activationConstraint: {
                delay: 300,
                tolerance: 8,
            },
        }),
        useSensor(KeyboardSensor, {
            coordinateGetter: sortableKeyboardCoordinates,
        }),
    );

    const addTodolistHandler = useCallback(async (title: string, helpers: AddItemFormSubmitHelpersType) => {
        const resultAction = await dispatch(todolistsActions.addTodolist(title));

        if (todolistsActions.addTodolist.rejected.match(resultAction)) {
            const errorMessage = resultAction.payload?.errors[0] || 'Some error occurred';
            helpers.setError(errorMessage);
        } else {
            helpers.setTitle('');
        }
    }, []);

    const handleDragStart = ({active}: DragStartEvent) => setActive(active)

    const handleDragCancel = () => setActive(null)

    const handleDragEnd = (event: DragEndEvent) => {
        const {active, over} = event;

        if (over && (active.id !== over.id)) {
            reorderTodolist({todolistId: active.id, overTodolistId: over?.id});
        }
    };

    const getActiveTodolist = (todolistId: string) => {
        const activeTodolist = todolists.find(tl => tl.id === todolistId);
        if (activeTodolist) {
            return <Todolist todolist={activeTodolist} isActive/>;
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
                onDragStart={handleDragStart}
                onDragCancel={handleDragCancel}
                onDragEnd={handleDragEnd}
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
                    <DragOverlay>
                        {active && getActiveTodolist(active.id as string)}
                    </DragOverlay>
                </SortableContext>
            </DndContext>
        </>
    );
};
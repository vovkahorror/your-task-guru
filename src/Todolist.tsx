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
  removeTask: (taskId: string) => void;
  changeFilter: (filter: FilterValuesType) => void;
  addTask: (title: string) => void;
};

export function Todolist(props: TodolistPropsType) {
  const [title, setTitle] = useState<string>('')
  const getTaskListItem = (task: TaskType) => {
    const removeTask = () => props.removeTask(task.id);
    return (
      <li key={task.id}>
        <input type="checkbox" checked={task.isDone}/>{" "}
        <span>{task.title}</span>
        <button onClick={removeTask}>✖</button>
      </li>
    )
  };
  const tasksList = props.tasks.map(getTaskListItem);
  const addTask = () => {
    const trimmedTitle = title.trim();
    if (trimmedTitle) {
      props.addTask(trimmedTitle);
    }
    setTitle('');
  }
  const handlerCreator = (filter: FilterValuesType) => {
    return () => props.changeFilter(filter);
  }
  const onChangeSetLocalTitle = (event: ChangeEvent<HTMLInputElement>) => setTitle(event.currentTarget.value);
  const onEnterDownAddTask = (event: KeyboardEvent<HTMLInputElement>) => event.key === 'Enter' && addTask();
  return (
    <div>
      <h3>{props.title}</h3>
      <div>
        <input
          value={title}
          onChange={onChangeSetLocalTitle}
          onKeyDown={onEnterDownAddTask}
        />
        <button onClick={addTask}>+</button>
      </div>
      <ul>{tasksList}</ul>

      <div>
        <button onClick={handlerCreator('all')}>All</button>
        <button onClick={handlerCreator('active')}>Active</button>
        <button onClick={handlerCreator('completed')}>Completed</button>
      </div>
    </div>
  );
}

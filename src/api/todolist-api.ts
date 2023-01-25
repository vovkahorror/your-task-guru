import axios from 'axios';
import {CreateTodolist, DeleteTodolist, GetTodolists} from '../stories/todolists-api.stories';

const settings = {
    withCredentials: true,
    headers: {
        'api-key': 'd09df4a6-624c-4f2c-a2ad-d9a381941271',
    },
};

export const todolistAPI = {
    createTodolist(title: string) {
        return axios.post('https://social-network.samuraijs.com/api/1.1/todo-lists', {title}, settings);
    },
    getTodolists() {
        return axios.get('https://social-network.samuraijs.com/api/1.1/todo-lists', settings);
    },
    updateTodolist(todolistID: string, title: string) {
        return axios.put(
            `https://social-network.samuraijs.com/api/1.1/todo-lists/${todolistID}`,
            {title},
            settings,
        );
    },
    deleteTodolist(todolistID: string) {
        return axios.delete(`https://social-network.samuraijs.com/api/1.1/todo-lists/${todolistID}`, settings);
    },
};
import axios from 'axios'

const settings = {
    withCredentials: true,
    headers: {
        'api-key': 'd09df4a6-624c-4f2c-a2ad-d9a381941271',
    },
};

export const todolistAPI = {
    updateTodolist(todolistId: string, title: string) {
        const promise = axios.put(
            `https://social-network.samuraijs.com/api/1.1/todo-lists/${todolistId}`,
            { title: title },
            settings
        )
        return promise
    },
}
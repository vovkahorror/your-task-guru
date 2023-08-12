import axios from 'axios';
import {RegisterResponseType} from './types';

const instance = axios.create({
    baseURL: 'https://social-network.samuraijs.com/',
    withCredentials: true,
});

export const registerApi = {
    register(login: string, email: string, password: string, acceptOffer: boolean) {
        return instance.post<RegisterResponseType>('Auth/Auth/TryRegister', {
            'JoinModel.Name': login,
            'JoinModel.Email': email,
            'JoinModel.Password': password,
            'JoinModel.AcceptOffer': acceptOffer,
        }).then(res => res.data);
    },
};


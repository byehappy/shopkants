import $api from '../http/api';
import {AxiosResponse} from "axios";
import {AuthResponse} from "../interfaces/AuthInterface";

interface userDetail {
    user_id:string
    full_name:string
    address:string
    phone:string
}

const AuthService = () =>{
    const login = async (username:string,password:string): Promise<AxiosResponse<AuthResponse>> =>{
        const payload = {
            grant_type: '',
            username: username,
            password: password,
            scope: '',
            client_id: '',
            client_secret: ''
        };
        return $api.post<AuthResponse>('/login',payload)
    }
    const registration = async (username:string,password:string,email:string): Promise<AxiosResponse<AuthResponse>> =>{
        return $api.post<AuthResponse>('/registration',{username,password,email})
    }
    const logout = async (): Promise<void> => {
        return $api.post('/logout')
    }
    // Создание пользовательских данных
    const createUserDetail = async (userDetail: { full_name: string; address: string; user_id: string | undefined; phone: string }) => {
        try {
            const response = await $api.post('/userdetails', userDetail);
            return response.data;
        } catch (error) {
            console.error('Ошибка при создании пользовательских данных:', error);
            throw error;
        }
    };

// Получение пользовательских данных по идентификатору пользователя
    const getUserDetail = async (userId: string | undefined) => {
        try {
            const response = await $api.get(`/userdetails/${userId}`);
            return response.data;
        } catch (error) {
            console.error('Ошибка при получении пользовательских данных:', error);
            throw error;
        }
    };

// Обновление пользовательских данных по идентификатору пользователя
    const updateUserDetail = async (userId: string | undefined, userDetail: { full_name: string; address: string; user_id: string | undefined; phone: string }) => {
        try {
            const response = await $api.put(`/userdetails/${userId}`, userDetail);
            return response.data;
        } catch (error) {
            console.error('Ошибка при обновлении пользовательских данных:', error);
            throw error;
        }
    };

// Удаление пользовательских данных по идентификатору пользователя
    const deleteUserDetail = async (userId:string) => {
        try {
            await $api.delete(`/userdetails/${userId}`);
            return;
        } catch (error) {
            console.error('Ошибка при удалении пользовательских данных:', error);
            throw error;
        }
    };


    return {login,registration,logout,getUserDetail,updateUserDetail,createUserDetail}
}
export default AuthService;
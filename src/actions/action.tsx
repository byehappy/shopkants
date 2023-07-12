import {IUser} from "../interfaces/AuthInterface";
import {API_URL} from "../http/api";
import axios from "axios";

export const setAuth = (bool: boolean) => {
    return {
        type: 'SET_AUTH',
        payload: bool
    }
}
export const loginUser = (user: IUser) => {
    return {
        type: 'USER_FETCHED',
        payload: user
    }
}

interface AuthResponse {
    username:string;
    admin: boolean;
    email: string;
    id:string;
    created_at:Date;
    rights:string;
    activation:boolean;
}

export const checkAuth = async () => {
    try {
        return await axios.get<AuthResponse>(`${API_URL}refresh`, {withCredentials: true})
    } catch (e:any) {
        console.log(e.response?.data?.message)
    }
}

export const addToFavoritesState = (productId:number) => {
    return { type: 'ADD_TO_FAVORITES', payload: productId };
};

export const removeFromFavorites = (productId:number) => {
    return { type: 'REMOVE_FROM_FAVORITES', payload: productId };
};
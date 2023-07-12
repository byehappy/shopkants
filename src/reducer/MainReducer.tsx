import {states} from "../interfaces/redux";
import {IUser} from "../interfaces/AuthInterface";

const initialState: states = {
    status: 'idle',
    curUser: {} as IUser,
    isAuth: false,
    favorites: [],
}

function mainReducer(state = initialState, action: any) {
    switch (action.type) {

        case 'SET_AUTH':
            return {
                ...state,
                loadingStatus: 'idle',
                isAuth: action.payload
            }
        case 'USER_FETCHED':
            return {
                ...state,
                loadingStatus: 'idle',
                curUser: action.payload
            }
        case 'ADD_TO_FAVORITES':
            // Проверяем, есть ли уже идентификатор товара в массиве favorites
            if (state.favorites.includes(action.payload)) {
                return state; // Если уже есть, возвращаем текущее состояние
            }
            return {
                ...state,
                favorites: [...state.favorites, action.payload] // Добавляем новый идентификатор товара в массив favorites
            };
        case 'REMOVE_FROM_FAVORITES':
            return {
                ...state,
                favorites: state.favorites.filter(id => id !== action.payload) // Удаляем идентификатор товара из массива favorites
            };
        default:
            return state
    }

}

export default mainReducer;
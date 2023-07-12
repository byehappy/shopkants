import $api from "../http/api";
import axios from "axios";
import {API_URL} from "./ProductService";

export const getWishlistByUserId = async (userId: string) => {
    const response = await $api.get(`/wishlist/${userId}`);
    return response.data;
};

export const removeFromWishlist = async (user_id:string, product_id:number) => {
    await $api.delete(`/wishlist/${user_id}/${product_id}`);
};

export const checkIfProductInFavorites = async (user_id: string, product_id: number): Promise<boolean> => {
    try {
        const response = await axios.get(`${API_URL}/wishlist/${user_id}`);
        const favoriteItems = response.data;

        // Проверяем, есть ли товар с указанным product_id в списке избранных
        const productInFavorites = favoriteItems.some((item: any) => item.product_id === product_id);
        return productInFavorites;
    } catch (error) {
        console.error('Ошибка при проверке наличия товара в избранном', error);
        return false;
    }
};

export const addToFavorites = async (user_id: string, product_id: number): Promise<void> => {
    try {
        // Проверяем, есть ли товар уже в списке избранных
        const isProductInFavorites = await checkIfProductInFavorites(user_id, product_id);

        if (!isProductInFavorites) {
            // Если товара нет в списке избранных, выполняем запрос на добавление
            await axios.post(`${API_URL}/wishlist`, {
                user_id: user_id,
                product_id: product_id
            });
        }
    } catch (error) {
        console.error('Ошибка при добавлении товара в избранное', error);
    }
};
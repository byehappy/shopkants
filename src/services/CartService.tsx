import $api from "../http/api";
import axios from "axios";
import {API_URL} from "./ProductService";

export const getCartByUserId = async (userId:string) => {
    try {
        const response = await $api.get(`/cart/${userId}`);
        return response.data;
    } catch (error) {
        console.error("Ошибка при получении корзины пользователя:", error);
        throw error;
    }
};
export const checkIfProductInCart = async (user_id: string, product_id: number): Promise<boolean> => {
    try {
        const response = await axios.get(`${API_URL}/cart/${user_id}`);
        const cartItems = response.data;

        // Проверяем, есть ли товар с указанным product_id в корзине
        return cartItems.some((item: any) => item.product_id === product_id);
    } catch (error) {
        console.error('Ошибка при проверке наличия товара в корзине', error);
        return false;
    }
};

export const addToCart = async (user_id: string, product_id: number): Promise<void> => {
    const productInCart = await checkIfProductInCart(user_id, product_id);
    if (productInCart) {
        console.log('Товар уже присутствует в корзине');
        return; // Завершаем функцию, если товар уже в корзине
    }
    const payload = {
        user_id: user_id,
        items: {
            [product_id.toString()]: 1,
        },
    };

    await axios.post(`${API_URL}/cart`, payload);
    console.log('Товар успешно добавлен в корзину');
};
export const deleteCartItems = async (userId: string) => {
    try {
        await $api.delete(`/cart/${userId}`);
        console.log("Корзина успешно очищена");
    } catch (error) {
        console.error("Ошибка при удалении товаров из корзины:", error);
        throw error;
    }
};
export const updateProductQuantity = async (productId: number, quantity: number,userId:string): Promise<void> => {
    try {
        const payload = {
            items: {
                [productId.toString()]: quantity,
            },
            quantity:quantity,
            user_id: userId,
            product_id: productId,
        };

        await axios.put(`${API_URL}/cart/${userId}`, payload);
        console.log('Количество товара успешно обновлено');
    } catch (error) {
        console.error('Ошибка при обновлении количества товара:', error);
        throw error;
    }
};

export const getCartItemQuantity = async (userId: string, productId: number): Promise<number> => {
    try {
        const response = await axios.get(`${API_URL}/cart/${userId}`);
        const cartItems = response.data;

        const cartItem = cartItems.find((item: any) => item.product_id === productId);
        if (cartItem) {
            return cartItem.quantity;
        } else {
            return 0;
        }
    } catch (error) {
        console.error('Ошибка при получении количества товара в корзине:', error);
        throw error;
    }
};
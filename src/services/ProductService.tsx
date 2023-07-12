import axios from "axios";
import $api from "../http/api";

export const API_URL = 'http://localhost:8000';

export interface Product {
    id: number;
    name: string;
    description: string;
    image_url: string;
    price: number;
}

// Запрос на получение списка всех товаров
export const getAllProducts = async (): Promise<Product[]> => {
    const response = await axios.get(`${API_URL}/products`);
    return response.data;
};
export const getProductCategory = async (category_name: string | undefined): Promise<Product[]>=>{
    const response = await $api.get(`/products/category/${category_name}`)
    return response.data.products
}
// Запрос на получение информации о товаре по его ID
export const getProductById = async (productId: number | string): Promise<Product> => {
    const response = await axios.get(`${API_URL}/products/${productId}`);
    return response.data;
};






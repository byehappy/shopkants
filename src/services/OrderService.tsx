import $api from "../http/api";

export const createOrder = async (orderData: any) => {
    try {
        const response = await $api.post(`/orders`, orderData);
        return response.data;
    } catch (error) {
        console.error("Ошибка при создании заказа:", error);
        throw error;
    }
};

export const OrderItems = async (orderItems: any[], order_id: string,user_id:string,calcAmout:number) => {
    try {
        const formattedOrderItems = orderItems.map((item) => ({
            quantity: item.quantity,
            price: item.price,
            order_id: order_id,
            product_id: item.product_id,
        }));

        const response = await $api.post(`/orders/${order_id}/details`, {
            user_id: user_id,
            order_date: new Date().toISOString(),
            total_amount: calcAmout,
            order_items: formattedOrderItems,
        });

        return response.data;
    } catch (error) {
        console.error("Ошибка при создании заказа:", error);
        throw error;
    }
};

export const getUserOrders = async (userId: string | undefined) => {
    try {
        const response = await $api.get(`/orders/user/${userId}`);
        return response.data;
    } catch (error) {
        console.error("Ошибка при получении заказов пользователя:", error);
        throw error;
    }
};

export const getOrderDetailsByOrderId = async (orderId: string) => {
    try {
        const response = await $api.get(`/orders/${orderId}/details`);
        return response.data;
    } catch (error) {
        console.error("Ошибка при получении деталей заказа:", error);
        throw error;
    }
};
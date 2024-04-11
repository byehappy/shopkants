import React, { useState, useEffect } from 'react';
import axios from 'axios';
import styled from 'styled-components';

interface OrderStatus {
    status: string;
    order_id: number;
    status_date: string; // Дата статуса заказа
    id: number;
}

interface OrderItem {
    quantity: number;
    price: number;
    id: number;
    order_id: number;
    product_id: number;
}

interface Order {
    user_id: number;
    order_date: string;
    total_amount: number;
    id: number;
    order_status?: OrderStatus[];
    order_items?: OrderItem[];
}

const OrderListContainer = styled.div`
    max-width: 800px;
    margin: 0 auto;
    padding: 20px;
`;

const OrderItemContainer = styled.li`
    margin-bottom: 20px;
    padding: 20px;
    border: 1px solid #ccc;
`;

const OrderDetail = styled.div`
    margin-bottom: 10px;
`;

const ButtonGroup = styled.div`
    margin-top: 10px;
`;

const Button = styled.button`
    margin-right: 10px;
    padding: 5px 10px;
    cursor: pointer;
`;

const OrderList = () => {
    const [orders, setOrders] = useState<Order[]>([]);
    const [filteredOrders, setFilteredOrders] = useState<Order[]>([]);
    const [statusFilter, setStatusFilter] = useState<'all' | 'new' | 'confirmed' | 'cancelled'>('all');

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const response = await axios.get<Order[]>('http://localhost:8000/orders/get/all');
            const ordersWithDetails = await Promise.all(
                response.data.map(async order => {
                    const detailResponse = await axios.get(`http://localhost:8000/orders/${order.id}/details`);
                    const statusResponse = await axios.get(`http://localhost:8000/orders/${order.id}/status`);
                    return {
                        ...order,
                        order_items: detailResponse.data.order_items,
                        order_status: statusResponse.data
                    };
                })
            );
            setOrders(ordersWithDetails);
            setFilteredOrders(ordersWithDetails);
        } catch (error) {
            console.error('Ошибка при загрузке заказов:', error);
        }
    };


    const handleFilterChange = (status: 'all' | 'new' | 'confirmed' | 'cancelled') => {
        setStatusFilter(status);
        filterOrders(status);
    };

    const filterOrders = (status: 'all' | 'new' | 'confirmed' | 'cancelled') => {
        if (status === 'all') {
            setFilteredOrders(orders);
        } else {
            const filtered = orders.filter(order => order.order_status?.[0]?.status === status);
            setFilteredOrders(filtered);
        }
    };

    const handleCancelOrder = async (orderId: number) => {
        try {
            await axios.put(`http://localhost:8000/orders/${orderId}/status`, { status: 'cancelled',order_id: orderId  });
            fetchData();
        } catch (error) {
            console.error('Ошибка при отмене заказа:', error);
        }
    };

    const handleConfirmOrder = async (orderId: number) => {
        try {
            await axios.put(`http://localhost:8000/orders/${orderId}/status`, { status: 'confirmed',order_id: orderId });
            fetchData();
        } catch (error) {
            console.error('Ошибка при подтверждении заказа:', error);
        }
    };

    return (
        <OrderListContainer>
            <h2>Список заказов</h2>
            <div>
                <ButtonGroup>
                    <Button onClick={() => handleFilterChange('all')}>Все</Button>
                    <Button onClick={() => handleFilterChange('new')}>Новые</Button>
                    <Button onClick={() => handleFilterChange('confirmed')}>Подтвержденные</Button>
                    <Button onClick={() => handleFilterChange('cancelled')}>Отмененные</Button>
                </ButtonGroup>
            </div>
            <ul>
                {filteredOrders.map(order => (
                    <OrderItemContainer key={order.id}>
                        <OrderDetail>Таймстамп заказа: {order.order_date}</OrderDetail>
                        <OrderDetail>Количество заказанных товаров: {order.order_items?.length || 0}</OrderDetail>
                        {order.order_status?.[0] && (
                            <OrderDetail>Статус заказа: {order.order_status[0].status}</OrderDetail>
                        )}
                        {order.order_status?.[0]?.status === 'new' && (
                            <ButtonGroup>
                                <Button onClick={() => handleCancelOrder(order.id)}>Отменить</Button>
                                <Button onClick={() => handleConfirmOrder(order.id)}>Подтвердить</Button>
                            </ButtonGroup>
                        )}
                    </OrderItemContainer>
                ))}
            </ul>
        </OrderListContainer>
    );
};

export default OrderList;

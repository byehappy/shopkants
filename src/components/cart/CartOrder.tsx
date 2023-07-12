import React, { useState, useEffect } from 'react';
import { useNavigate } from "react-router-dom";
import { deleteCartItems, getCartByUserId } from "../../services/CartService";
import {
    TextField,
    Button,
    Typography,
    Container,
    Grid,
} from '@mui/material';
import { createOrder, OrderItems } from "../../services/OrderService";
import { useSelector } from "react-redux";
import { IUser } from "../../interfaces/AuthInterface";
import { getProductById } from "../../services/ProductService";

interface CartItem {
    product_id: string;
    name: string;
    price: number;
    quantity: number;
}

type CurrentUser = {
    curUser: IUser;
}

const CartOrder: React.FC = () => {
    const { id } = useSelector((state: CurrentUser) => state.curUser);
    const [userData, setUserData] = useState({
        name: '',
        email: '',
        address: '',
    });
    const [cartItems, setCartItems] = useState<CartItem[]>([]);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchCartItems = async () => {
            try {
                const cartData = await getCartByUserId(id);
                const itemsWithProductData = await Promise.all(cartData.map(async (item: any) => {
                    const product = await getProductById(item.product_id);
                    return {
                        ...item,
                        name: product.name,
                        price: product.price,
                    };
                }));
                setCartItems(itemsWithProductData);
            } catch (error) {
                console.error('Ошибка при получении данных корзины:', error);
            }
        };

        if (id) {
            fetchCartItems();
        }
    }, [id]);

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
    ) => {
        setUserData({
            ...userData,
            [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        try {
            const orderData = {
                user_id: id,
                order_date: new Date().toISOString(),
                total_amount: calculateTotalAmount(),
            };

            const newOrder = await createOrder(orderData);

            const orderItems = cartItems.map((item) => ({
                order_id: newOrder.id,
                product_id: item.product_id,
                quantity: item.quantity,
                price: item.price,
            }));

            await OrderItems(orderItems, newOrder.id, id, calculateTotalAmount());
            await deleteCartItems(id);

            navigate(`/`);
        } catch (error) {
            console.error('Ошибка при создании заказа:', error);
        }
    };

    const calculateTotalAmount = () => {
        if (!cartItems) {
            return 0;
        }

        let total = 0;

        cartItems.forEach((item) => {
            total += item.price * item.quantity;
        });

        return Number(total.toFixed(2));
    };

    return (
        <Container maxWidth="sm" sx={{ marginTop: '5vw' }}>
            <Typography variant="h4">Оформление заказа</Typography>
            <form onSubmit={handleSubmit}>
                <Grid container spacing={2}>
                    <Grid item xs={12}>
                        <TextField
                            label="Имя"
                            name="name"
                            value={userData.name}
                            onChange={handleChange}
                            fullWidth
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <TextField
                            label="Email"
                            name="email"
                            value={userData.email}
                            onChange={handleChange}
                            fullWidth
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <TextField
                            label="Адрес"
                            name="address"
                            value={userData.address}
                            onChange={handleChange}
                            fullWidth
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <Typography variant="h6">Товары в корзине:</Typography>
                        {cartItems && cartItems.map((item) => (
                            <div key={item.product_id}>
                                <Typography>{item.name}</Typography>
                                <Typography>Количество: {item.quantity}</Typography>
                            </div>
                        ))}
                    </Grid>
                    <Grid item xs={12}>
                        <Typography>
                            Общая стоимость заказа: {calculateTotalAmount()} руб.
                        </Typography>
                    </Grid>
                    <Grid item xs={12}>
                        <Button type="submit" variant="contained" color="primary">
                            Оформить заказ
                        </Button>
                    </Grid>
                </Grid>
            </form>
        </Container>
    );
};

export default CartOrder;

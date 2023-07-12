import React, {useState, useEffect} from "react";
import styled from "styled-components";
import {useSelector} from "react-redux";
import {IUser} from "../../interfaces/AuthInterface";
import {Stack, TextField, Button, Typography, Card, CardContent} from "@mui/material";
import AuthService from "../../services/AuthService";
import {MuiTelInput} from "mui-tel-input";
import {getUserOrders, getOrderDetailsByOrderId} from "../../services/OrderService";
import {useParams} from "react-router-dom";
import {getProductById} from "../../services/ProductService";

const ProfileContainer = styled.div`
  border-radius: 1vw;
  border: 0.1vw solid #e5e8ff;
  margin: 5vw;
  width: 35vw;
  background: #f7f6ff;
  padding: 2vw;
  height: fit-content;
`;

interface CurrentUser {
    curUser: IUser;
}

interface Order {
    id: string;
    order_date: string;
    order_status: any[]; // Update the type accordingly
    order_items: any[]; // Update the type accordingly
}

const Profile = () => {
    const {createUserDetail, getUserDetail, updateUserDetail} = AuthService();
    const {username} = useSelector((state: CurrentUser) => state.curUser);
    const {id} = useParams();
    const [fullName, setFullName] = useState("");
    const [address, setAddress] = useState("");
    const [phone, setPhone] = useState("");
    const [userOrders, setUserOrders] = useState<Order[]>([]);

    const handleChange = (phone: string) => {
        setPhone(phone);
    };

    useEffect(() => {
        const loadUserData = async () => {
            try {
                const userData = await getUserDetail(id);
                if (userData) {
                    setFullName(userData.full_name);
                    setAddress(userData.address);
                    setPhone(userData.phone);
                }
            } catch (error) {
                console.error("Ошибка при получении пользовательских данных:", error);
            }
        };
        loadUserData();

        const loadUserOrders = async () => {
            try {
                const orders = await getUserOrders(id);
                const ordersWithDetails = await Promise.all(
                    orders.map(async (order: Order) => {
                        const details = await getOrderDetailsByOrderId(order.id);
                        if (details) {
                            const {order_items: orderItems, order_status: orderStatuses} = details;
                            const orderItemsWithProductNames = await Promise.all(
                                orderItems.map(async (item: any) => {
                                    const product = await getProductById(item.product_id);
                                    if (product) {
                                        return {
                                            ...item,
                                            product_name: product.name,
                                        };
                                    }
                                    return item;
                                })
                            );
                            return {
                                ...order,
                                order_items: orderItemsWithProductNames,
                                order_status: orderStatuses,
                            };
                        }
                        return order;
                    })
                );
                setUserOrders(ordersWithDetails);
            } catch (error) {
                console.error("Ошибка при получении заказов пользователя:", error);
            }
        };
        loadUserOrders();
    }, [id]);

    const handleSave = async () => {
        const userDetail = {
            user_id: id,
            full_name: fullName,
            address: address,
            phone: phone,
        };
        try {
            const userData = await getUserDetail(id);
            if (userData) {
                await updateUserDetail(id, userDetail);
            } else {
                await createUserDetail(userDetail);
            }
            alert("Данные успешно сохранены!");
        } catch (error) {
            console.error("Ошибка при сохранении пользовательских данных:", error);
        }
    };

    return (
        <div style={{display: "flex"}}>
            <ProfileContainer>
                Привет! {username}
                <h3>Редактирование личных данных</h3>
                <Stack spacing={2}>
                    <TextField
                        id="full-name"
                        label="Ваше ФИО"
                        variant="standard"
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                    />
                    <TextField
                        id="address"
                        label="Ваш адрес"
                        variant="standard"
                        value={address}
                        onChange={(e) => setAddress(e.target.value)}
                    />
                    <MuiTelInput
                        id="phone"
                        label="Ваш номер телефона"
                        variant="standard"
                        value={phone}
                        onChange={handleChange}
                    />
                    <Button variant="contained" onClick={handleSave}>
                        Сохранить
                    </Button>
                </Stack>
            </ProfileContainer>
            <ProfileContainer>
                <Stack>
                    <Typography variant="h5" component="h5">
                        Ваши заказы:
                    </Typography>
                    {userOrders.length > 0 ? (
                        userOrders.map((order) => (
                            <Card key={order.id} style={{marginBottom: "1rem",border:'.1vw solid gray',borderRadius:'1vw'}}>
                                <CardContent>
                                        <Typography>Номер заказа: {order.id}</Typography>
                                        <Typography>Дата заказа: {order.order_date}</Typography>
                                    <Typography variant="h5" component="h5">
                                        Статусы заказа:
                                    </Typography>
                                    {order.order_status.map((status) => (
                                        <div key={status.id} style={{borderRadius: '.5vw', border: '.1vw solid grey',}}>
                                            <Typography>Статус: {status.status}</Typography>
                                            <Typography>Дата статуса: {status.status_date}</Typography>
                                        </div>
                                    ))}

                                    <Typography variant="h5" component="h5">
                                        Товары заказа:
                                    </Typography>
                                    {order.order_items.map((item) => (
                                        <div key={item.id}
                                             style={{borderRadius: '1vw', border: '.1vw solid grey', marginTop: '1vw'}}>
                                            <Typography>Количество: {item.quantity}</Typography>
                                            <Typography>Цена: {item.price}</Typography>
                                            <Typography>Товар: {item.product_name}</Typography> {/* Display product name */}
                                        </div>
                                    ))}
                                </CardContent>
                            </Card>
                        ))
                    ) : (
                        <Typography>У вас нет заказов.</Typography>
                    )}
                </Stack>
            </ProfileContainer>
        </div>
    );
};

export default Profile;

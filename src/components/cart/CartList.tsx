import React, {useState, useEffect} from 'react';
import {getCartByUserId} from '../../services/CartService';
import CircularProgress from '@mui/material/CircularProgress';
import {useSelector} from 'react-redux';
import {IUser} from '../../interfaces/AuthInterface';
import {getProductById, Product} from '../../services/ProductService';
import {CartItem} from './CartItem';
import {Link} from "react-router-dom";
import {createSelector} from "reselect";

interface CartListProps {
    name: string;
}

type CurrentUser = {
    curUser: IUser;
    isAuth: boolean;
}
const getCurrentUser = (state: CurrentUser) => state.curUser;
const getIsAuth = (state: CurrentUser) => state.isAuth;
export const selectUserInfo: (state: CurrentUser) => { id: string; isAuth: boolean } = createSelector(
    getCurrentUser,
    getIsAuth,
    (curUser: IUser, isAuth: boolean) => ({
        id: curUser.id,
        isAuth,
    })
);

export const CartList: React.FC<CartListProps> = ({name}) => {
    const [cartItems, setCartItems] = useState<Product[]>([]);
    const {id, isAuth} = useSelector(selectUserInfo)

    useEffect(() => {
        const fetchCartItems = async () => {
            try {
                if (!id) {
                    // Если отсутствует id пользователя, прекратить выполнение запросов
                    return;
                }

                const cart = await getCartByUserId(id); // Выполняем запрос на получение корзины пользователя
                const itemPromises = cart.map((item: any) =>
                    getProductById(item.product_id)
                ); // Получаем промисы для получения информации о товарах
                const items = await Promise.all(itemPromises); // Ожидаем выполнение всех промисов
                setCartItems(items);
            } catch (error) {
                console.error('Ошибка при получении корзины:', error);
            }
        };

        fetchCartItems();
    }, [id]);

    if (!cartItems.length && isAuth) {
        return <CircularProgress/>;
    }

    return (
        <div>
            <h1>{name}</h1>
            {isAuth ? <div>
                    {cartItems.map((item, index) => (
                        <CartItem key={index} item={item} id={id}/>
                    ))}
                </div>
                :
                <div>
                    Необходимо <Link to={'/auth'}>войти</Link> в аккаунт
                </div>
            }
        </div>
    );
};

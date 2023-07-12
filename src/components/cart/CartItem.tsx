import React, {useState, useEffect} from 'react';
import {Product} from '../../services/ProductService';
import {updateProductQuantity, getCartItemQuantity} from '../../services/CartService';
import {Card, CardContent, Badge, Button, Typography, Box} from "@mui/material";
import CardMedia from '@mui/material/CardMedia';

interface CartItemProps {
    item: Product;
    id: string;
}

export const CartItem: React.FC<CartItemProps> = ({item, id}) => {
    const [quantity, setQuantity] = useState(1);

    useEffect(() => {
        const fetchQuantity = async () => {
            const cartItemQuantity = await getCartItemQuantity(id, item.id);
            setQuantity(cartItemQuantity);
        };

        fetchQuantity();
    }, [id, item.id]);

    const decreaseQuantity = () => {
        if (quantity > 1) {
            const newQuantity = quantity - 1;
            setQuantity(newQuantity);
            updateProductQuantity(item.id, newQuantity, id); // Обновление количества товара в базе данных
        }
    };

    const increaseQuantity = () => {
        const newQuantity = quantity + 1;
        setQuantity(newQuantity);
        updateProductQuantity(item.id, newQuantity, id); // Обновление количества товара в базе данных
    };

    return (
        <Card sx={{display: 'flex', justifyContent: 'space-around', marginTop: '2vw',padding:'1vw'}}>
            <Box sx={{display: 'flex', flexDirection: 'column'}}>
                <CardContent sx={{flex: '1 0 auto'}}>
                    <Typography component="div" variant="h5">
                        {item.name}
                    </Typography>
                    <Typography variant="subtitle1" color="text.secondary" component="div">
                        Цена: {item.price} ₽
                    </Typography>
                </CardContent>
                <Box sx={{display: 'flex', alignItems: 'center', pl: 1, pb: 1,justifyContent: 'center'}}>
                    <Button size={"small"} variant={"contained"} onClick={decreaseQuantity}>-</Button>
                    <Button sx={{marginLeft: '1vw'}} size={"small"} variant={"contained"}
                            onClick={increaseQuantity}>+</Button>
                </Box>
            </Box>
            <Badge color="secondary" badgeContent={quantity} anchorOrigin={{vertical: 'top', horizontal: 'right'}}>
                <CardMedia
                    component="img"
                    sx={{width: '8vw'}}
                    image={item.image_url}
                    alt={item.name}
                />
            </Badge>
        </Card>
    );
};

import React, { useState, useEffect } from 'react';
import { getWishlistByUserId } from '../../services/WishlistService';
import CircularProgress from '@mui/material/CircularProgress';
import { useSelector } from 'react-redux';
import { WishlistItem } from '../wishlist/WishlistItem';
import { getProductById, Product } from '../../services/ProductService';
import { Link } from 'react-router-dom';
import {selectUserInfo} from "../cart/CartList";
import {Grid} from "@mui/material";

export const WishlistPage: React.FC = () => {
    const [wishlistItems, setWishlistItems] = useState<Product[]>([]);
    const {id, isAuth} = useSelector(selectUserInfo)

    useEffect(() => {
        const fetchWishlistItems = async () => {
            try {
                if (!id) {
                    // If user is not authenticated, stop fetching wishlist items
                    return;
                }

                const wishlist = await getWishlistByUserId(id);
                const itemPromises = wishlist.map((item: any) =>
                    getProductById(item.product_id)
                );
                const items = await Promise.all(itemPromises);
                setWishlistItems(items);
            } catch (error) {
                console.error('Error fetching wishlist:', error);
            }
        };

        fetchWishlistItems();
    }, [id]);

    const handleRemoveItemClick = async () => {
        // Implement the logic to refresh the wishlist after removal
        try {
            const wishlist = await getWishlistByUserId(id);
            const itemPromises = wishlist.map((item: any) => getProductById(item.product_id));
            const items = await Promise.all(itemPromises);
            setWishlistItems(items);
        } catch (error) {
            console.error('Error fetching wishlist:', error);
        }
    };

    if (!wishlistItems.length && isAuth) {
        return <CircularProgress />;
    }

    return (
        <div style={{marginTop:'3.5vw'}}>
            <h1>Избранное</h1>
            {isAuth ? (
                <Grid style={{'width':'90vw','margin':' 3vw 5vw 6vw 5vw'}} container columnSpacing={5}>
                    {wishlistItems.map((item) => (
                        <WishlistItem key={item.id} item={item} curUser={id} onRemoveClick={handleRemoveItemClick} />
                    ))}
                </Grid>
            ) : (
                <div style={{marginBottom:'25vw'}}>
                    Необходимо <Link to="/auth">войти</Link> в аккаунт
                </div>
            )}
        </div>
    );
};

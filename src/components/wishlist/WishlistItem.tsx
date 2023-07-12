import React from 'react';
import { removeFromWishlist } from '../../services/WishlistService';
import IconButton from '@mui/material/IconButton';
import DeleteIcon from '@mui/icons-material/Delete';
import {Product} from "../../services/ProductService";
import {Grid} from "@mui/material";

interface WishlistItemProps {
    item: Product;
    curUser: string;
    onRemoveClick: () => void; // Add the prop for the remove click event handler
}

export const WishlistItem: React.FC<WishlistItemProps> = ({ item,curUser,onRemoveClick  }) => {
    const handleRemoveClick = async () => {
        try {
            await removeFromWishlist(curUser, item.id);
            onRemoveClick(); // Call the onRemoveClick prop after successful removal
        } catch (error) {
            console.error('Ошибка при удалении из избранного:', error);
        }
    };

    return (
        <Grid item>
            <img style={{maxHeight:'10vw'}} src={item.image_url} alt={item.name}/>
            <h3>{item.name}</h3>
            <h4>{item.price} ₽</h4>
            <IconButton onClick={handleRemoveClick}>
                <DeleteIcon />
            </IconButton>
        </Grid>
    );
};

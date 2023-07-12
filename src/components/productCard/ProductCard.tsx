import React, {useEffect} from 'react';
import {Product} from '../../services/ProductService';
import {
    ProductContainer,
    ProductImage,
    ProductPrice,
    ProductTitle,
    IconWrapper,
    IconsContainer,
    StyledButtonCart,
    InfoCont,
} from './ProductCard.style';
import ShoppingCartOutlinedIcon from '@mui/icons-material/ShoppingCartOutlined';
import FavoriteBorderOutlinedIcon from '@mui/icons-material/FavoriteBorderOutlined';
import FavoriteIcon from '@mui/icons-material/Favorite';
import {addToCart} from "../../services/CartService";
import {
    addToFavorites, checkIfProductInFavorites, removeFromWishlist
} from '../../services/WishlistService'
import {useDispatch, useSelector} from "react-redux";
import {addToFavoritesState, removeFromFavorites} from "../../actions/action";

interface ProductCardProps {
    product: Product;
    CurrentUserId: string;
}
interface stateFavorite{
    favorites:number[];
}

export const ProductCard: React.FC<ProductCardProps> = ({
                                                            product,
                                                            CurrentUserId,
                                                        }) => {
    const dispatch = useDispatch();
    const favorites = useSelector((state:stateFavorite) => state.favorites);

    useEffect(() => {
        const checkFavorite = async () =>{
            try{
                if (!CurrentUserId){
                    return
                }

                const ProductIsFavorite = await checkIfProductInFavorites(CurrentUserId,product.id)
                if(ProductIsFavorite){
                    dispatch(addToFavoritesState(product.id))
                }
            }
            catch (error){
                console.error('Ошибка при проверке избранности товара',error)
            }
        }
        checkFavorite()
    }, []);

    const handleBuyClick = async () => {
        try {
            if (!CurrentUserId) {
                return;
            }

            await addToCart(CurrentUserId, product.id);
        } catch (error) {
            console.error('Error adding product to cart:', error);
        }
    };

    const handleFavoriteClick = async () => {
        try {
            if (!CurrentUserId) {
                return;
            }

            const isInFavorites = favorites.includes(product.id);

            if (isInFavorites) {
                await removeFromWishlist(CurrentUserId, product.id);
                dispatch(removeFromFavorites(product.id));
            } else {
                if (!isInFavorites) {
                    await addToFavorites(CurrentUserId, product.id);
                    dispatch(addToFavoritesState(product.id));
                }
            }
        } catch (error) {
            console.error('Error handling favorite product:', error);
        }
    };

    return (
        <ProductContainer>
            <ProductImage src={product.image_url} alt={product.name}/>
            <InfoCont>
                <ProductTitle>{product.name}</ProductTitle>
                <ProductPrice>Цена: {product.price} ₽</ProductPrice>
                <IconsContainer>
                    <IconWrapper>
                        {favorites.includes(product.id) ? (
                            <FavoriteIcon onClick={handleFavoriteClick} />
                        ) : (
                            <FavoriteBorderOutlinedIcon onClick={handleFavoriteClick} />
                        )}
                        Избранное
                    </IconWrapper>
                    <IconWrapper>
                        <StyledButtonCart onClick={handleBuyClick}>
                            <ShoppingCartOutlinedIcon/>
                            Купить
                        </StyledButtonCart>
                    </IconWrapper>
                </IconsContainer>
            </InfoCont>
        </ProductContainer>
    );
};

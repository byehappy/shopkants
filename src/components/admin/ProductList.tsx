import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import axios from 'axios';
import { Product } from "../../services/ProductService";
import NewProductForm from "./product/NewProductForm";
import EditProductForm from "./product/EditProductForm";

interface AdminProduct extends Product {
    quantity: number
    brand_id: number
    category_id: number
}

export interface EditedProduct {
    id: number;
    name: string;
    description: string;
    image_url: string;
    price: number;
    quantity: number;
    brand_id: number;
    category_id: number;
}

export const ProductItemContainer = styled.div`
  border: 1px solid #ccc;
  border-radius: 5px;
  padding: 10px;
  margin-bottom: 10px;
`;

const ProductItemRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const StyledDiv = styled.div`
  margin: 5vw;
`;

const ProductInfo = styled.div`
  flex: 1;
  text-align: left;
`;

const ProductActions = styled.div`
  margin-left: 20px;
  display: flex;
  gap: 2vw;
`;

export const ButtonAdmin = styled.button`
  padding: 5px 10px;
  background-color: #007bff;
  color: #fff;
  border: none;
  border-radius: 5px;
  cursor: pointer;
`;

export const InputAdmin = styled.input`
  padding: 5px;
  border: 1px solid #ccc;
  border-radius: 3px;
  margin-bottom: 5px;
`;

const ProductsList = () => {
    const [products, setProducts] = useState<AdminProduct[]>([]);
    const [editingProductId, setEditingProductId] = useState<number | null>(null);
    const [editedProduct, setEditedProduct] = useState<EditedProduct>({
        id: 0,
        name: '',
        description: '',
        image_url: '',
        price: 0,
        quantity: 0,
        brand_id: 0,
        category_id: 0,
    });

    // Добавляем состояние для нового товара
    const [newProduct, setNewProduct] = useState<EditedProduct>({
        id: 0,
        name: '',
        description: '',
        image_url: '',
        price: 0,
        quantity: 0,
        brand_id: 0,
        category_id: 0,
    });

    const [showNewForm, setShowNewForm] = useState<boolean>(false); // Состояние для отображения формы создания нового товара

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get<AdminProduct[]>('http://localhost:8000/products');
                setProducts(response.data);
            } catch (error) {
                console.error('Ошибка при загрузке товаров:', error);
            }
        };

        fetchData();
    }, [showNewForm]); // Обновляем список товаров при изменении showNewForm

    const handleEditClick = (product: AdminProduct) => {
        setShowNewForm(false)
        setEditingProductId(product.id);
        setEditedProduct({
            id: product.id,
            name: product.name,
            description: product.description,
            image_url: product.image_url,
            price: product.price,
            quantity: product.quantity,
            brand_id: product.brand_id,
            category_id: product.category_id,
        });
    };

    const handleCancelClick = () => {
        setEditingProductId(null);
        setEditedProduct({
            id: 0,
            name: '',
            description: '',
            image_url: '',
            price: 0,
            quantity: 0,
            brand_id: 0,
            category_id: 0,
        });
    };

    const handleDeleteClick = async (productId: number) => {
        try {
            await axios.delete(`http://localhost:8000/products/${productId}`);
            // Повторно загружаем список товаров после удаления
            const response = await axios.get<AdminProduct[]>('http://localhost:8000/products');
            setProducts(response.data);
        } catch (error) {
            console.error('Ошибка при удалении товара:', error);
        }
    };

    const handleSaveClick = async () => {
        try {
            await axios.put(`http://localhost:8000/products/${editedProduct.id}`, editedProduct);
            setEditingProductId(null);
            // Повторно загружаем список товаров после успешного сохранения
            const response = await axios.get<AdminProduct[]>('http://localhost:8000/products');
            setProducts(response.data);
        } catch (error) {
            console.error('Ошибка при редактировании товара:', error);
        }
    };

    const handleNewClick = () => {
        setShowNewForm(!showNewForm);
        setEditingProductId(null)
        if (!showNewForm) {
            setNewProduct({
                id: 0,
                name: '',
                description: '',
                image_url: '',
                price: 0,
                quantity: 0,
                brand_id: 0,
                category_id: 0,
            });
        }
    };

    const handleCreateNewClick = async () => {
        try {
            await axios.post('http://localhost:8000/products', newProduct);
            setShowNewForm(false);
            // Повторно загружаем список товаров после успешного создания нового товара
            const response = await axios.get<AdminProduct[]>('http://localhost:8000/products');
            setProducts(response.data);
        } catch (error) {
            console.error('Ошибка при создании нового товара:', error);
        }
    };

    return(
        <StyledDiv>
            {!showNewForm && <ButtonAdmin onClick={handleNewClick}>Новое</ButtonAdmin>}
            <NewProductForm
                showNewForm={showNewForm}
                handleNewClick={handleNewClick}
                handleCreateNewClick={handleCreateNewClick}
                newProduct={newProduct}  // Передаем новый товар в форму создания нового товара
                setNewProduct={setNewProduct}  // Передаем функцию установки нового товара в форму создания нового товара
            />
            {products.map((product: AdminProduct) => (
                <ProductItemContainer key={product.id}>
                    <ProductItemRow>
                        <ProductInfo>
                            {editingProductId === product.id ? (
                                <EditProductForm
                                    editedProduct={editedProduct}
                                    setEditedProduct={setEditedProduct}
                                    handleSaveClick={handleSaveClick}
                                    handleCancelClick={handleCancelClick}
                                />
                            ) : (
                                <>
                                    <h3>{product.name}</h3>
                                    <p>Цена: {product.price}</p>
                                    <p>Описание: {product.description}</p>
                                    <p>Ссылка на картинку: {product.image_url}</p>
                                    <p>Количество: {product.quantity}</p>
                                    <p>ID бренда: {product.brand_id}</p>
                                    <p>ID категории: {product.category_id}</p>
                                </>
                            )}
                        </ProductInfo>
                        <ProductActions>
                            {editingProductId === product.id ? (
                                <>
                                    <ButtonAdmin onClick={handleSaveClick}>Принять</ButtonAdmin>
                                    <ButtonAdmin onClick={handleCancelClick}>Отменить</ButtonAdmin>
                                </>
                            ) : (
                                <>
                                    <ButtonAdmin onClick={() => handleEditClick(product)}>Редактировать</ButtonAdmin>
                                    <ButtonAdmin onClick={() => handleDeleteClick(product.id)}>Удалить</ButtonAdmin>
                                </>
                            )}
                        </ProductActions>
                    </ProductItemRow>
                </ProductItemContainer>
            ))}
        </StyledDiv>
    );
};

export default ProductsList;

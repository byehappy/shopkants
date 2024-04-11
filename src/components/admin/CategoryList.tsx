import React, { useState, useEffect } from 'react';
import axios from 'axios';
import styled from 'styled-components';

interface Category {
    name: string;
    description: string;
    image_url: string;
    id: number;
}

const CategoryListContainer = styled.div`
    max-width: 800px;
    margin: 0 auto;
    padding: 20px;
`;

const CategoryItem = styled.li`
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 10px;
    border-bottom: 1px solid #ccc;
`;

const CategoryName = styled.span`
    font-weight: bold;
`;

const CategoryDescription = styled.span`
    color: #666;
`;

const CategoryImage = styled.img`
    width: 100px;
    height: 100px;
    object-fit: cover;
    margin-right: 20px;
`;

const AddCategoryForm = styled.div`
    margin-top: 20px;
`;

const CategoryList = () => {
    const [categories, setCategories] = useState<Category[]>([]);
    const [newCategory, setNewCategory] = useState<string>('');
    const [newCategoryDescription, setNewCategoryDescription] = useState<string>('');
    const [newCategoryImageUrl, setNewCategoryImageUrl] = useState<string>('');

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const response = await axios.get<Category[]>('http://localhost:8000/categories');
            setCategories(response.data);
        } catch (error) {
            console.error('Ошибка при загрузке категорий:', error);
        }
    };

    const handleAddCategory = async () => {
        try {
            await axios.post('http://localhost:8000/categories', {
                name: newCategory,
                description: newCategoryDescription,
                image_url: newCategoryImageUrl
            });
            setNewCategory('');
            setNewCategoryDescription('');
            setNewCategoryImageUrl('');
            fetchData(); // Повторно загружаем список категорий после добавления новой категории
        } catch (error) {
            console.error('Ошибка при добавлении категории:', error);
        }
    };

    const handleDeleteCategory = async (categoryId: number) => {
        try {
            await axios.delete(`http://localhost:8000/categories/${categoryId}`);
            fetchData(); // Повторно загружаем список категорий после удаления категории
        } catch (error) {
            console.error('Ошибка при удалении категории:', error);
        }
    };
    const isFormValid = () => {
        return newCategory.trim() !== '' && newCategoryDescription.trim() !== '' && newCategoryImageUrl.trim() !== '';
    };
    return (
        <CategoryListContainer>
            <h2>Список категорий</h2>
            <ul>
                {categories.map((category: Category) => (
                    <CategoryItem key={category.id}>
                        <CategoryImage src={category.image_url} alt={category.name} />
                        <div style={{display:"flex",gap:"1vw",flexDirection:'column'}}>
                            <CategoryName>{category.name}</CategoryName>
                            <CategoryDescription>{category.description}</CategoryDescription>
                        </div>
                        <button onClick={() => handleDeleteCategory(category.id)}>Удалить</button>
                    </CategoryItem>
                ))}
            </ul>
            <AddCategoryForm>
                <h3>Добавить новую категорию</h3>
                <p><input
                    type="text"
                    placeholder="Название категории"
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value)}
                /></p>
                    <p><input
                    type="text"
                    placeholder="Описание категории"
                    value={newCategoryDescription}
                    onChange={(e) => setNewCategoryDescription(e.target.value)}
                /></p>
                        <p><input
                    type="text"
                    placeholder="URL изображения"
                    value={newCategoryImageUrl}
                    onChange={(e) => setNewCategoryImageUrl(e.target.value)}
                /></p>
                <button onClick={handleAddCategory} disabled={!isFormValid()}>Добавить категорию</button>
            </AddCategoryForm>
        </CategoryListContainer>
    );
};

export default CategoryList;

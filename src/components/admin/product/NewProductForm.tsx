import React from "react";
import {ButtonAdmin, InputAdmin, ProductItemContainer} from "../ProductList";

const NewProductForm = ({showNewForm, handleNewClick, handleCreateNewClick, newProduct, setNewProduct}: any) => {
    return (
        <>
            {showNewForm && (
                <ProductItemContainer>
                    <h3>Новый товар</h3>
                    <p>
                        <label>Название:</label>
                        <InputAdmin
                            type="text"
                            placeholder="Название"
                            onChange={(e: any) => setNewProduct({...newProduct, name: e.target.value})}
                        />
                    </p>
                    <p>
                        <label>Описание:</label>
                        <InputAdmin
                            type="text"
                            placeholder="Описание"
                            onChange={(e: any) => setNewProduct({...newProduct, description: e.target.value})}
                        />
                    </p>
                    <p>
                        <label>Ссылка на картинку:</label>
                        <InputAdmin
                            type="text"
                            placeholder="Ссылка на картинку"
                            onChange={(e: any) => setNewProduct({...newProduct, image_url: e.target.value})}
                        />
                    </p>
                    <p>
                        <label>Цена:</label>
                        <InputAdmin
                            type="number"
                            placeholder="Цена"
                            onChange={(e: any) => setNewProduct({...newProduct, price: parseFloat(e.target.value)})}
                        />
                    </p>
                    <p>
                        <label>Количество:</label>
                        <InputAdmin
                            type="number"
                            placeholder="Количество"
                            onChange={(e: any) => setNewProduct({...newProduct, quantity: parseInt(e.target.value)})}
                        />
                    </p>
                    <p>
                        <label>ID бренда:</label>
                        <InputAdmin
                            type="number"
                            placeholder="ID бренда"
                            onChange={(e: any) => setNewProduct({...newProduct, brand_id: parseInt(e.target.value)})}
                        />
                    </p>
                    <p>
                        <label>ID категории:</label>
                        <InputAdmin
                            type="number"
                            placeholder="ID категории"
                            onChange={(e: any) => setNewProduct({...newProduct, category_id: parseInt(e.target.value)})}
                        />
                    </p>
                    <div style={{display:"flex",gap:"1vw",justifyContent:"center"}}>
                        <ButtonAdmin onClick={handleCreateNewClick}>Создать</ButtonAdmin>
                        <ButtonAdmin onClick={handleNewClick}>Отмена</ButtonAdmin>
                    </div>
                </ProductItemContainer>
            )}
        </>
    );
};

export default NewProductForm;

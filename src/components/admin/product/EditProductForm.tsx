import React from 'react';
import {ButtonAdmin, EditedProduct, InputAdmin} from "../ProductList";

interface EditProductFormProps {
    editedProduct: EditedProduct;
    setEditedProduct: React.Dispatch<React.SetStateAction<EditedProduct>>;
    handleSaveClick: () => void;
    handleCancelClick: () => void;
}

const EditProductForm: React.FC<EditProductFormProps> = ({ editedProduct, setEditedProduct, handleSaveClick, handleCancelClick }) => {
    return (
        <>
            <h3>
                <InputAdmin
                    type="text"
                    value={editedProduct.name}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEditedProduct({ ...editedProduct, name: e.target.value })}
                />
            </h3>
            <p>
                Цена:
                <InputAdmin
                    type="number"
                    value={editedProduct.price}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEditedProduct({ ...editedProduct, price: parseFloat(e.target.value) })}
                />
            </p>
            <p>
                Описание:
                <InputAdmin
                    type="text"
                    value={editedProduct.description}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEditedProduct({ ...editedProduct, description: e.target.value })}
                />
            </p>
            <p>
                Ссылка на картинку:
                <InputAdmin
                    type="text"
                    value={editedProduct.image_url}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEditedProduct({ ...editedProduct, image_url: e.target.value })}
                />
            </p>
            <p>
                Количество:
                <InputAdmin
                    type="number"
                    value={editedProduct.quantity}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEditedProduct({ ...editedProduct, quantity: parseInt(e.target.value) })}
                />
            </p>
            <p>
                ID бренда:
                <InputAdmin
                    type="number"
                    value={editedProduct.brand_id}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEditedProduct({ ...editedProduct, brand_id: parseInt(e.target.value) })}
                />
            </p>
            <p>
                ID категории:
                <InputAdmin
                    type="number"
                    value={editedProduct.category_id}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEditedProduct({ ...editedProduct, category_id: parseInt(e.target.value) })}
                />
            </p>
            <ButtonAdmin onClick={handleSaveClick}>Принять</ButtonAdmin>
            <ButtonAdmin onClick={handleCancelClick}>Отменить</ButtonAdmin>
        </>
    );
};

export default EditProductForm;

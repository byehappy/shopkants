from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from datetime import datetime
from models.product import Product, Stock, Category, Brand, ProductAttribute
import schemas.product
from config.db import SessionLocal
from urllib.parse import unquote

router = APIRouter()


def get_database_session():
    try:
        db = SessionLocal()
        yield db
    finally:
        db.close()


@router.get("/products", response_model=List[schemas.product.Product], tags=["products"])
def get_products(db: Session = Depends(get_database_session)):
    products = db.query(Product).all()
    return products


@router.get("/products/{product_id}", response_model=schemas.product.Product, tags=["products"])
def get_product(product_id: int, db: Session = Depends(get_database_session)):
    product = db.query(Product).get(product_id)
    if not product:
        raise HTTPException(status_code=404, detail="Product not found")
    return product


@router.post("/products", response_model=schemas.product.Product, tags=["products"])
def create_product(product: schemas.product.ProductCreate, db: Session = Depends(get_database_session)):
    new_product = Product(
        category_id=product.category_id,
        name=product.name,
        description=product.description,
        price=product.price,
        quantity=product.quantity,
        image_url=product.image_url,
        brand_id=product.brand_id,
        created_at=datetime.now()
    )
    db.add(new_product)
    db.commit()
    db.refresh(new_product)
    return new_product


@router.put("/products/{product_id}", response_model=schemas.product.Product, tags=["products"])
def update_product(
        product_id: int,
        product: schemas.product.ProductUpdate,
        db: Session = Depends(get_database_session)
):
    existing_product = db.query(Product).get(product_id)
    if not existing_product:
        raise HTTPException(status_code=404, detail="Product not found")

    for attr, value in product.dict(exclude_unset=True).items():
        setattr(existing_product, attr, value)

    db.commit()
    db.refresh(existing_product)
    return existing_product


@router.get("/products/category/{category_name}")
def get_products_by_category(category_name: str, db: Session = Depends(get_database_session)):
    # Декодируем русское название категории из URL
    category_name = unquote(category_name)

    # Находим идентификатор категории по названию
    category = db.query(Category).filter(Category.name == category_name).first()
    if not category:
        # Если категория не найдена, возвращаем ошибку или пустой список товаров
        return {"detail": "Категория не найдена"}

    # Находим все товары с данным идентификатором категории
    products = db.query(Product).filter(Product.category_id == category.id).all()

    # Возвращаем список товаров
    return {"products": products}


@router.delete("/products/{product_id}", tags=["products"])
def delete_product(product_id: int, db: Session = Depends(get_database_session)):
    product = db.query(Product).get(product_id)
    if not product:
        raise HTTPException(status_code=404, detail="Product not found")

    db.delete(product)
    db.commit()
    return {"message": "Product deleted successfully"}


@router.get("/categories", response_model=List[schemas.product.Category], tags=["categories"])
def get_categories(db: Session = Depends(get_database_session)):
    categories = db.query(Category).all()
    return categories


@router.get("/categories/{category_id}", response_model=schemas.product.Category, tags=["categories"])
def get_category(category_id: int, db: Session = Depends(get_database_session)):
    category = db.query(Category).get(category_id)
    if not category:
        raise HTTPException(status_code=404, detail="Category not found")
    return category


@router.post("/categories", response_model=schemas.product.Category, tags=["categories"])
def create_category(category: schemas.product.CategoryCreate, db: Session = Depends(get_database_session)):
    new_category = Category(
        name=category.name,
        description=category.description,
        image_url=category.image_url
    )
    db.add(new_category)
    db.commit()
    db.refresh(new_category)
    return new_category


@router.get("/brands", response_model=List[schemas.product.Brand], tags=["brands"])
def get_brands(db: Session = Depends(get_database_session)):
    brands = db.query(Brand).all()
    return brands


@router.get("/brands/{brand_id}", response_model=schemas.product.Brand, tags=["brands"])
def get_brand(brand_id: int, db: Session = Depends(get_database_session)):
    brand = db.query(Brand).get(brand_id)
    if not brand:
        raise HTTPException(status_code=404, detail="Brand not found")
    return brand


@router.post("/brands", response_model=schemas.product.Brand, tags=["brands"])
def create_brand(brand: schemas.product.BrandCreate, db: Session = Depends(get_database_session)):
    new_brand = Brand(
        name=brand.name,
        description=brand.description
    )
    db.add(new_brand)
    db.commit()
    db.refresh(new_brand)
    return new_brand


@router.get("/product_attributes", response_model=List[schemas.product.ProductAttribute], tags=["product_attributes"])
def get_product_attributes(db: Session = Depends(get_database_session)):
    attributes = db.query(ProductAttribute).all()
    return attributes


@router.get("/product_attributes/{attribute_id}", response_model=schemas.product.ProductAttribute,
            tags=["product_attributes"])
def get_product_attribute(attribute_id: int, db: Session = Depends(get_database_session)):
    attribute = db.query(ProductAttribute).get(attribute_id)
    if not attribute:
        raise HTTPException(status_code=404, detail="Product attribute not found")
    return attribute


@router.post("/product_attributes/product/{product_id}", response_model=schemas.product.ProductAttribute,
             tags=["product_attributes"])
def create_product_attribute_for_product(
        product_id: int,
        attribute: schemas.product.ProductAttributeCreate,
        db: Session = Depends(get_database_session)
):
    # Check if the product_id exists in the database
    product = db.query(Product).get(product_id)
    if not product:
        raise HTTPException(status_code=404, detail="Product not found")

    new_attribute = ProductAttribute(
        product_id=product_id,
        attribute_key=attribute.attribute_key,
        attribute_value=attribute.attribute_value
    )
    db.add(new_attribute)
    db.commit()
    db.refresh(new_attribute)
    return new_attribute


@router.get("/product_attributes/product/{product_id}", response_model=List[schemas.product.ProductAttribute],
            tags=["product_attributes"])
def get_product_attributes_by_product_id(product_id: int, db: Session = Depends(get_database_session)):
    attributes = db.query(ProductAttribute).filter(ProductAttribute.product_id == product_id).all()
    return attributes


@router.put("/product_attributes/product/{product_id}/{attribute_id}", response_model=schemas.product.ProductAttribute,
            tags=["product_attributes"])
def update_product_attribute_for_product(
        product_id: int,
        attribute_id: int,
        attribute: schemas.product.ProductAttributeUpdate,
        db: Session = Depends(get_database_session)
):
    # Check if the product_id exists in the database
    product = db.query(Product).get(product_id)
    if not product:
        raise HTTPException(status_code=404, detail="Product not found")

    # Retrieve the existing attribute by attribute_id and product_id
    existing_attribute = db.query(ProductAttribute).filter(ProductAttribute.product_id == product_id,
                                                           ProductAttribute.id == attribute_id).first()
    if not existing_attribute:
        raise HTTPException(status_code=404, detail="Product attribute not found")

    # Update the attribute values
    existing_attribute.attribute_key = attribute.attribute_key
    existing_attribute.attribute_value = attribute.attribute_value

    db.commit()
    db.refresh(existing_attribute)
    return existing_attribute


@router.get("/stock", response_model=List[schemas.product.Stock], tags=["stock"])
def get_stock(db: Session = Depends(get_database_session)):
    stock = db.query(Stock).all()
    return stock


@router.get("/stock/{stock_id}", response_model=schemas.product.Stock, tags=["stock"])
def get_stock_item(stock_id: int, db: Session = Depends(get_database_session)):
    stock_item = db.query(Stock).get(stock_id)
    if not stock_item:
        raise HTTPException(status_code=404, detail="Stock item not found")
    return stock_item


@router.post("/stock", response_model=schemas.product.Stock, tags=["stock"])
def create_stock_item(stock: schemas.product.StockCreate, db: Session = Depends(get_database_session)):
    new_stock_item = Stock(
        product_id=stock.product_id,
        warehouse_name=stock.warehouse_name,
        quantity=stock.quantity,
        last_updated=datetime.now()
    )
    db.add(new_stock_item)
    db.commit()
    db.refresh(new_stock_item)
    return new_stock_item


@router.delete("/categories/{category_id}", tags=["categories"])
def delete_category(category_id: int, db: Session = Depends(get_database_session)):
    category = db.query(Category).get(category_id)
    if not category:
        raise HTTPException(status_code=404, detail="Category not found")

    db.delete(category)
    db.commit()
    return {"message": "Category deleted successfully"}


@router.delete("/brands/{brand_id}", tags=["brands"])
def delete_brand(brand_id: int, db: Session = Depends(get_database_session)):
    brand = db.query(Brand).get(brand_id)
    if not brand:
        raise HTTPException(status_code=404, detail="Brand not found")

    db.delete(brand)
    db.commit()
    return {"message": "Brand deleted successfully"}


@router.delete("/product_attributes/{attribute_id}", tags=["product_attributes"])
def delete_product_attribute(attribute_id: int, db: Session = Depends(get_database_session)):
    attribute = db.query(ProductAttribute).get(attribute_id)
    if not attribute:
        raise HTTPException(status_code=404, detail="Product attribute not found")

    db.delete(attribute)
    db.commit()
    return {"message": "Product attribute deleted successfully"}


@router.delete("/stock/{stock_id}", tags=["stock"])
def delete_stock_item(stock_id: int, db: Session = Depends(get_database_session)):
    stock_item = db.query(Stock).get(stock_id)
    if not stock_item:
        raise HTTPException(status_code=404, detail="Stock item not found")

    db.delete(stock_item)
    db.commit()
    return {"message": "Stock item deleted successfully"}


@router.put("/categories/{category_id}", tags=["categories"], response_model=schemas.product.Category)
def update_category(category_id: int, category: schemas.product.CategoryCreate,
                    db: Session = Depends(get_database_session)):
    existing_category = db.query(Category).get(category_id)
    if not existing_category:
        raise HTTPException(status_code=404, detail="Category not found")

    for attr, value in category.dict(exclude_unset=True).items():
        setattr(existing_category, attr, value)

    db.commit()
    db.refresh(existing_category)
    return existing_category


@router.put("/brands/{brand_id}", tags=["brands"], response_model=schemas.product.Brand)
def update_brand(brand_id: int, brand: schemas.product.BrandCreate, db: Session = Depends(get_database_session)):
    existing_brand = db.query(Brand).get(brand_id)
    if not existing_brand:
        raise HTTPException(status_code=404, detail="Brand not found")

    for attr, value in brand.dict(exclude_unset=True).items():
        setattr(existing_brand, attr, value)

    db.commit()
    db.refresh(existing_brand)
    return existing_brand


@router.put("/product_attributes/{attribute_id}", tags=["product_attributes"],
            response_model=schemas.product.ProductAttribute)
def update_product_attribute(attribute_id: int, attribute: schemas.product.ProductAttributeCreate,
                             db: Session = Depends(get_database_session)):
    existing_attribute = db.query(ProductAttribute).get(attribute_id)
    if not existing_attribute:
        raise HTTPException(status_code=404, detail="Product attribute not found")

    for attr, value in attribute.dict(exclude_unset=True).items():
        setattr(existing_attribute, attr, value)

    db.commit()
    db.refresh(existing_attribute)
    return existing_attribute


@router.put("/stock/{stock_id}", tags=["stock"], response_model=schemas.product.Stock)
def update_stock_item(stock_id: int, stock: schemas.product.StockCreate, db: Session = Depends(get_database_session)):
    existing_stock_item = db.query(Stock).get(stock_id)
    if not existing_stock_item:
        raise HTTPException(status_code=404, detail="Stock item not found")

    for attr, value in stock.dict(exclude_unset=True).items():
        setattr(existing_stock_item, attr, value)

    db.commit()
    db.refresh(existing_stock_item)
    return existing_stock_item

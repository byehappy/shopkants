import React, {useEffect, useState} from "react";
import CategoriesService, {Categorys} from "../../services/CategoriesService";
import CircularProgress from "@mui/material/CircularProgress";
import CategoryCard from "../categoryCard/CategoryCard";
import {Grid} from "@mui/material";

const Catalog = () => {
    const [category, setCategory] = useState<Categorys[]>();
    const {getAllCategories} = CategoriesService();
    useEffect(() => {
        const fetchCategoryList = async () => {
            try {
                const fetchedCategory = await getAllCategories(); // Выполняем запрос на получение списка категорий
                setCategory(fetchedCategory.data);
            } catch (error) {
                console.error('Error fetching category list:', error);
            }
        };
        fetchCategoryList();
    }, []);

    if (!category || !category.length) {
        return <CircularProgress/>;
    }
    return (
        <Grid style={{'width':'90vw','margin':' 3vw 5vw 5vw 5vw'}} container rowSpacing={4} columnSpacing={{ xs: 1, sm: 2, md: 3 }}>
            {category.map((category) => (
                <Grid xs={4} item key={category.id}>
                    <CategoryCard key={category.id} category={category}/>
                </Grid>
            ))}
        </Grid>
    );
};

export default Catalog;
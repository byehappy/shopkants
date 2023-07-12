import {Card, CardActionArea, CardContent, CardMedia, Typography} from "@mui/material";
import {Link} from "react-router-dom";

const CategoryCard = ({category}:any) => {
    return (
        <Link style={{textDecoration:"none"}} to={`/catalog/${category.name}`}>
            <Card style={{'textDecoration':'none'}}>
                <CardActionArea>
                    <CardMedia style={{height:'20vw'}} component='img' image={category.image_url} alt={category.name}/>
                    <CardContent>
                        <Typography gutterBottom variant="h5" component="div">
                            {category.name}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                            {category.description}
                        </Typography>
                    </CardContent>
                </CardActionArea>
            </Card>
        </Link>
    );
};

export default CategoryCard;
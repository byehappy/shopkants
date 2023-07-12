import $api from '../http/api';
import {AxiosResponse} from "axios";

export interface Categorys {
    name: string
    description:string
    image_url:string
    id:number
}

const CategoriesService = () =>{
    const getAllCategories = async (): Promise<AxiosResponse<Categorys[]>> =>{
        return $api.get('/categories')
    }
    return{getAllCategories}
}
export default CategoriesService;
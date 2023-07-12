import {IUser} from "./AuthInterface";

export interface states {
    status:string;
    curUser: IUser;
    isAuth: boolean;
    favorites: number[];
}
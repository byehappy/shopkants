export interface IUser{
    username:string;
    admin: boolean;
    email: string;
    id:string;
}

export interface AuthResponse {
    accessToken: string;
    refreshToken: string;
    user: IUser;
}
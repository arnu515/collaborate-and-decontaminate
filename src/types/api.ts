export interface User {
    id: 1;
    email: string;
    password: string;
    username: string;
}

export interface Resp<Data = any> {
    message: string;
    success: boolean;
    data?: Data;
}

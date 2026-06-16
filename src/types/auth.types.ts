export interface User {
    id: number;
    username: string;
    email: string;
}

export interface LoginRequest {
    email: string;
    password: string;
}

export interface LoginResponse {
    message: string;
    token: {
        access_token: string;
    };
    user: User;
}

export interface RegisterRequest {
    username: string;
    email: string;
    password: string;
}

export interface RegisterResponse {
    message: string;
    user: User;
}

export interface RefreshResponse {
    token: {
        access_token: string;
    };
}

export interface LogoutResponse {
    message: string;
}

export interface AuthUserResponse {
    id: number;
    username: string;
    email: string;
}

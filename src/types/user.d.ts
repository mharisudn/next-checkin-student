import { UserRole } from "./enums";

interface IUser {
    id: number;
    name: string;
    email: string;
    role: UserRole;
    created_at?: string;
    updated_at?: string;
}

export type {IUser};

import { StudentStatus } from "./enums";

interface IStudent {
    id: number;
    registration_code: string;
    name: string;
    classroom: string;
    gender: string;
    parent: string;
    address: string;
    school_origin: string;
    phone: string;
    status: StudentStatus;
    created_at?: string;
    updated_at?: string;
}

export type {IStudent};

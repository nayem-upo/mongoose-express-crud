export type TOrder = {
    productName: string;
    price: number;
    quantity: number
}

export interface UserInterfaceIUser {
    userId: number;
    username: string;
    password: string;
    fullName: {
        firstName: string;
        lastName: string;
    };
    age: number;
    email: string;
    isActive: boolean;
    hobbies: string[];
    address: {
        street: string;
        city: string; country: string;
    };
    orders: TOrder[];
}
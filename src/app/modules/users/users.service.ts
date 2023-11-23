// users.service.ts
import { UserModel } from "../users.models";
import { TOrder, UserInterfaceIUser } from "./users.interface";

// creating an user
const createUserToDb = async (user: UserInterfaceIUser) => {
    const result = await UserModel.create(user);
    return result;
}
//getting all users from db
const getAllUsersFromDb = async () => {
    const result = await UserModel.find({}, { username: 1, fullName: 1, age: 1, email: 1, address: 1, _id: 0 });
    return result;
}
// getting single user by id
const getUserByUserId = async (userId: number) => {
    const user = await UserModel.findOne({ userId }, { _id: 0, password: 0, orders: 0 });
    if (!user) {
        throw new Error('User not found');
    }
    return user;
}
// updating an user informations
const updateUserInDb = async (userId: number, updatedUserData: UserInterfaceIUser) => {
    const userExists = await UserModel.userExists(userId);
    if (!userExists) {
        throw new Error('User not exist');
    }
    const result = await UserModel.findOneAndUpdate({ userId }, updatedUserData, { new: true, projection: { _id: 0, password: 0, orders: 0 } });
    if (!result) {
        throw new Error('User not exist');
    }
    return result;
}
// deleting an user from db
const deleteUserFromDb = async (userId: number) => {
    try {
        await UserModel.deleteOne({ userId })
    } catch (error) {
        throw new Error('Error deleting user from the database');
    }
}
// creating an order to db 
const createOrderToDb = async (userId: number, newOrder: TOrder) => {
    const user = await UserModel.findOne({ userId });
    if (!user) {
        throw new Error('User not found');
    }
    if (!user.orders) {
        user.orders = [];
    }
    user.orders.push(newOrder);
    await user.save();
    return null;
}
// get all orders for a specific user
const getOrdersByUserId = async (userId: number) => {
    const user = await UserModel.findOne({ userId });

    if (!user) {
        throw new Error('User not found');
    }
    const orders = user.orders || [];

    return orders;
}

// Calculate Total Price of Orders for a Specific User
const calculateTotalPrice = async (userId: number) => {
    const user = await UserModel.findOne({ userId });

    if (!user) {
        throw new Error('User not found');
    }
    const orders = user.orders || [];
    const totalPrice = orders.reduce((total, order) => {
        return total + (order.price * order.quantity);
    }, 0)
    return { totalPrice };
}

export const userServices = {
    createUserToDb,
    getAllUsersFromDb,
    getUserByUserId,
    updateUserInDb,
    deleteUserFromDb,
    createOrderToDb,
    getOrdersByUserId,
    calculateTotalPrice
}
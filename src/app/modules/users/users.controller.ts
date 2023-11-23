// users.controller.ts
import { Request, Response } from "express"
import bcrypt from 'bcrypt';
import { userServices } from "./users.service"
import { UserValidationSchema } from "./users.validation";
import { UserModel } from "../users.models";
import { TOrder } from "./users.interface";

const createUser = async (req: Request, res: Response) => {
    try {
        const newUser = UserValidationSchema.parse(req.body);
        if (!newUser.password) {
            return res.status(400).json({
                success: false,
                message: 'Password is required',
            });
        }
        const hashedPassword = await bcrypt.hash(newUser.password, 12);

        await userServices.createUserToDb({
            ...newUser,
            password: hashedPassword
        });

        const userWithoutPassword = {
            ...newUser,
            password: undefined
        };

        res.status(201).json({
            success: true,
            message: 'User is created successfully!',
            data: userWithoutPassword,
        });
    } catch (err) {
        res.status(500).json({
            success: false,
            message: 'Invalid data format',
            error: err
        });
    }
}

const getAllUsers = async (req: Request, res: Response) => {
    try {
        const result = await userServices.getAllUsersFromDb();
        res.status(200).json({
            success: true,
            message: 'Users retrieved succesfully',
            data: result,
        })
    } catch (err) {
        res.status(500).json({
            success: false,
            message: 'Something went wrong',
            error: err,
        });
    }
}

const getUserUserId = async (req: Request, res: Response) => {
    try {
        const userId = parseInt(req.params.userId);
        const userExists = await UserModel.userExists(userId);
        if (!userExists) {
            return res.status(404).json({
                success: false,
                message: "User not found.",
                error: {
                    code: 404,
                    description: "User not found!"
                },
            });
        }

        const result = await userServices.getUserByUserId(userId);
        res.status(200).json({
            success: true,
            message: 'User fetched successfully!',
            data: result,
        });
    }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    catch (error: any) {
        res.status(404).json({
            success: false,
            message: "Something went wrong",
            error: error.message
        });
    }
}

const updateUser = async (req: Request, res: Response) => {
    try {
        const userId = parseInt(req.params.userId);
        const updatedUserData = UserValidationSchema.parse(req.body);

        if (updatedUserData.password) {
            updatedUserData.password = await bcrypt.hash(updatedUserData.password, 12);
        }

        await userServices.updateUserInDb(userId, updatedUserData);
        const userWithoutPasswordAndOrders = {
            ...updatedUserData,
            password: undefined,
            orders: undefined
        };
        res.status(200).json({
            success: true,
            message: 'User updated successfully!',
            data: userWithoutPasswordAndOrders,
        });

    }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    catch (error: any) {
        res.status(404).json({
            success: false,
            message: "Something went wrong",
            error: error.message
        });
    }
}

const deleteUser = async (req: Request, res: Response) => {
    try {
        const userId = parseInt(req.params.userId);
        const userExists = await UserModel.userExists(userId);
        if (!userExists) {
            return res.status(404).json({
                success: false,
                message: "User not found.",
                error: {
                    code: 404,
                    description: "User not found!"
                },
            });
        }
        await userServices.deleteUserFromDb(userId);

        res.status(200).json({
            success: true,
            message: 'User deleted successfully!',
            data: null,
        });
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
        res.status(500).json({
            success: false,
            message: 'Something went wrong',
            error: error.message,
        });
    }
}

const createOrderToDb = async (req: Request, res: Response) => {
    try {
        const userId = parseInt(req.params.userId);
        const newOrder: TOrder = req.body;
        await userServices.createOrderToDb(userId, newOrder)
        res.status(200).json({
            success: true,
            message: 'Order created successfully!',
            data: null,
        });
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
        res.status(500).json({
            success: false,
            message: 'Error creating order',
            error: error.message
        });
    }
}

const getOrdersByUserId = async (req: Request, res: Response) => {
    try {
        const userId = parseInt(req.params.userId);
        const orders = await userServices.getOrdersByUserId(userId);

        res.status(200).json({
            success: true,
            message: 'Orders fetched successfully!',
            data: {
                orders
            }
        });
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
        res.status(500).json({
            success: false,
            message: 'Error fetching orders',
            error: error.message,
        });
    }
}

const calculateTotalPrice = async (req: Request, res: Response) => {
    try {
        const userId = parseInt(req.params.userId);
        const totalPrice = await userServices.calculateTotalPrice(userId);
        res.status(200).json({
            success: true,
            message: 'Total price calculated successfully!',
            data: {
                totalPrice,
            },
        });
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
        res.status(500).json({
            success: false,
            message: 'Error calculating total price',
            error: error.message,
        });
    }
}

export const UserController = {
    createUser,
    getAllUsers,
    getUserUserId,
    updateUser,
    deleteUser,
    createOrderToDb,
    getOrdersByUserId,
    calculateTotalPrice
}
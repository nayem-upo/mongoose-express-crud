import { Model, Schema, model } from "mongoose";
import { UserInterfaceIUser, TOrder } from "./users/users.interface";

// The order schema
const orderSchema = new Schema<TOrder>({
    productName: { type: String, required: true },
    price: { type: Number, required: true },
    quantity: { type: Number, required: true }
})

// The user schema
const userSchema = new Schema<UserInterfaceIUser>({
    userId: { type: Number, required: true, unique: true },
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    fullName: {
        firstName: { type: String, required: true },
        lastName: { type: String, required: true },
    },
    age: { type: Number, required: true },
    email: { type: String, required: true },
    isActive: { type: Boolean, required: true },
    hobbies: [{ type: String, required: true }],
    address: {
        street: { type: String, required: true },
        city: { type: String, required: true },
        country: { type: String, required: true },
    },
    orders: [orderSchema]
})

export interface IUserModel extends Model<UserInterfaceIUser> {
    // eslint-disable-next-line no-unused-vars
    userExists(userId: number): Promise<boolean>;
}
userSchema.statics.userExists = async function (userId: number): Promise<boolean> {
    const user = await this.findOne({ userId });
    return !!user;
};

export const UserModel = model<UserInterfaceIUser, IUserModel>('User', userSchema);

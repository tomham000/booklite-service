import { Document } from "mongoose";

export interface UserModel extends Document {
    username: string;
    password: string;
    firstName: string;
    lastName: string;
    createdDate: Date;
}
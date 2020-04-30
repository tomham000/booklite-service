import { Injectable, HttpException } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { UserModel } from "./interfaces/user.interface";
import { hashSync, compareSync } from "bcrypt";
import { sign } from "jsonwebtoken";
import e = require("express");

@Injectable()
export class UsersService {

    constructor(@InjectModel('User') private userModel: Model<UserModel>) {}

    public async getAll(): Promise<UserModel[]> {
        return await this.userModel.find();
    }

    public async getById(id: string) {
        return await this.userModel.findById(id);
    }

    public async create(user: UserModel) {
        if (await this.userModel.findOne({username: user.username})) {
            throw new HttpException(`Username ${user.username} is already taken`, 400);
        }
        const newUser = new this.userModel({
            username: user.username,
            password: hashSync(user.password, 10), // Hash password
            firstName: user.firstName,
            lastName: user.lastName,
            createdDate: user.createdDate
        });
        const result = await newUser.save();
        return JSON.stringify(result.id);
    }

    public async update(id: string, userUpdate: UserModel) {
        const oldUser = await this.userModel.findById(id);

        // validate
        if (!oldUser) throw 'User not found - cannot update'
        if (oldUser.username !== userUpdate.username && await this.userModel.findOne({username: userUpdate.username})) {
            throw new HttpException(`Username ${userUpdate.username} is already taken`, 400);
        }

        // Hash password if there is a new password
        if (userUpdate.password) {
            userUpdate.password = hashSync(userUpdate.password, 10);
        }

        Object.assign(oldUser, userUpdate);
        await new this.userModel(userUpdate).save();
    }

    public async validateUser(username: string, password: string): Promise<any> {
        const user = await this.userModel.findOne({username}).exec();
        if (user && compareSync(password, user.password)) {
            const token = sign({ sub: user.id }, process.env.JWT_SECRET);
            console.log(token)
            return {
                ...user.toJSON(),
                token
            };
        } else {
            throw new HttpException('Invalid credentials', 400);
        }
    }

    public async delete(id: string) {
        await this.userModel.findByIdAndRemove(id);
    }

}
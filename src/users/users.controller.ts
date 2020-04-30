import { Controller, Get, Post, Body, UseFilters, UseGuards, Req, Param, Put, Delete} from "@nestjs/common";
import { UsersService } from "./users.service";
import { HttpExceptionFilter } from "../filters/http-exception.filter";
import { AuthGuard } from "src/auth/auth.guard";
import { UserModel } from "./interfaces/user.interface";

@Controller('/api/users')
@UseFilters(new HttpExceptionFilter())
export class UsersController {

    constructor(private usersService: UsersService) {}

    @Get()
    @UseGuards(new AuthGuard())
    public async getAll(): Promise<UserModel[]> {
        return this.usersService.getAll();
    }

    @Post('/register')
    public async register(@Body() user: UserModel) {
        return this.usersService.create(user);
    }

    @Post('/login')
    public async login(@Req() req) {
        return this.usersService.validateUser(req.body.username, req.body.password);
    }

    @Get(':id')
    public async getById(@Param() params) {
        return this.usersService.getById(params.id);
    }

    @Put(':id')
    public async update(@Param() params, @Body() user: UserModel) {
        return this.usersService.update(params.id, user);
    }

    @Delete(':id') 
    public async deleteUser(@Param() params) {
        return this.usersService.delete(params.id);
    }
}
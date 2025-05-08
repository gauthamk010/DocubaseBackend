import { Controller, Get, Post, Body, Param, Delete, Put, UseGuards, Request, ForbiddenException } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDTO, UpdateUserDTO } from './DTO/user.dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { Roles } from "src/auth/decorators/roles.decorator";
import { Role } from "src/auth/enums/role.enum";
import { RolesGuard } from "src/auth/guards/roles.guard";

@Controller('user')
@UseGuards(JwtAuthGuard, RolesGuard)
export class UserController {
    constructor(private readonly userService: UserService) {}
    
    @Post('new')
    @Roles(Role.Admin)
    createUser(@Body() createUserDto: CreateUserDTO) 
    {
        return this.userService.createUser(createUserDto);
    }

    @Get('all')
    @Roles(Role.Admin)
    findAllUsers() {
        return this.userService.findAllUsers();
    }

    @Get('/:id')
    @UseGuards(RolesGuard)
    getUser(@Param('id') id: string, @Request() req) {
        const loggedInUser = req.user;
        if (loggedInUser.roles.includes(Role.Admin)) {
            return this.userService.findOneUser(id);
        }
        if (loggedInUser.id !== id) {
            throw new ForbiddenException('Access denied');
        }
    }

    @Put('update/:id')
    @Roles(Role.Admin, Role.User)
    updateUser(@Param('id') id: string, @Body() updateUserDto: UpdateUserDTO) {
        return this.userService.updateUser(id, updateUserDto);
    }

    @Delete('delete/:id')
    removeUser(@Param('id') id: string) {
        return this.userService.deleteUser(id);
    }

}

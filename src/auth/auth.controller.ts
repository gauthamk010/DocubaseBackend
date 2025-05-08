// auth.controller.ts
import { Controller, Post, Body, HttpCode, HttpStatus, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterDTO, LoginDTO } from './DTO/auth.dto';

@Controller('user')
export class AuthController {
    constructor(private authService: AuthService) { }

    @Post('/register')
    async signup(@Body() registerDTO: RegisterDTO): Promise<{ token: string }> {
        return this.authService.Register(registerDTO);
    }

    @Post('/login')
    @HttpCode(HttpStatus.OK)
    async login(@Body() loginDTO: LoginDTO): Promise<{ token: string }> {
        return this.authService.Login(loginDTO);
    }
}
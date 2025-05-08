// auth.service.ts
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as bcrypt from 'bcryptjs';
import { JwtService } from '@nestjs/jwt';
import { RegisterDTO, LoginDTO } from './DTO/auth.dto';
import { User } from 'src/auth/schemas/user.schema';
import { JwtPayload } from 'jsonwebtoken';

@Injectable()
export class AuthService {
    constructor(
        @InjectModel(User.name) private userModel: Model<User>,
        private jwtService: JwtService,
    ) { }

    async Register(registerDto: RegisterDTO): Promise<{ token: string }> {
        const { password, roles, name, email, phoneNumber, profileImage } = registerDto;

        const hashedPassword = await bcrypt.hash(password, 10);
        const profileimage = `https://api.dicebear.com/9.x/initials/svg?seed=${encodeURIComponent(name)}`; 

        const user = await this.userModel.create({
            ...registerDto,
            phoneNumber,
            password: hashedPassword,
            profileImage: profileimage,
            roles: Array.isArray(roles) ? roles : [roles]
        });

        const payload: JwtPayload = { id: user._id, name: user.name, roles: user.roles };
        const token = this.jwtService.sign(payload);

        return { token };
    }

    async Login(loginDTO: LoginDTO): Promise<{ token: string }> {
        const { email, password } = loginDTO;
        const user = await this.userModel.findOne({ email });

        if (!user) {
            throw new UnauthorizedException('Invalid credentials');
        }

        const isPasswordMatch = await bcrypt.compare(password, user.password);
        if (!isPasswordMatch) {
            throw new UnauthorizedException('Invalid credentials');
        }

        const payload: JwtPayload = { id: user._id, name: user.name, roles: user.roles };
        const token = await this.jwtService.sign(payload);
        return { token };
    }
}
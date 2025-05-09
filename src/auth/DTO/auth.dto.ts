import { IsArray, IsEmail, IsEnum, IsNotEmpty, IsOptional, IsString, MinLength } from "class-validator";
import { Role } from "../enums/role.enum";
import { Transform } from "class-transformer";

export class RegisterDTO
{
    @IsNotEmpty()
    @IsString()
    readonly name: string;

    @IsNotEmpty()
    @IsString()
    @MinLength(10)
    readonly phoneNumber: string;

    @IsNotEmpty()
    @IsEmail({}, { message: 'Please enter correct email' })
    readonly email: string;

    @IsNotEmpty()
    @IsString()
    @MinLength(8)
    readonly password: string;

    @IsString()
    readonly profileImage: string;

    @IsOptional()
    @IsArray()
    @IsEnum(Role, { each: true })
    @Transform(({ value }) => (value?.length ? value : [Role.User]))
    roles?: Role[];    
}

export class LoginDTO
{

    @IsNotEmpty()
    @IsEmail({}, { message: 'Please enter correct email' })
    readonly email: string;

    @IsNotEmpty()
    @IsString()
    readonly password: string;
}
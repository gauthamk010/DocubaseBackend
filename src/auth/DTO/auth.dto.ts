import { IsArray, IsEmail, IsNotEmpty, IsString, MinLength } from "class-validator";

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

    @IsArray()
    @IsString({ each: true })
    roles: string[];
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
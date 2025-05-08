import { IsArray, IsEmail, IsNotEmpty, IsOptional, IsString, MinLength } from "class-validator";

export class CreateUserDTO
{
    @IsNotEmpty()
    @IsString()
    readonly name: string;

    @IsNotEmpty()
    @IsString()
    @MinLength(10)
    readonly phone_number: string;

    @IsNotEmpty()
    @IsEmail({}, { message: 'Please enter correct email' })
    readonly email: string;

    @IsNotEmpty()
    @IsString()
    @MinLength(8)
    readonly password: string;

    @IsArray()
    @IsString({ each: true })
    roles: string[];
}

export class UpdateUserDTO {
    @IsOptional()
    @IsString()
    readonly name?: string;

    @IsOptional()
    @IsString()
    @MinLength(10)
    readonly phone_number?: string;

    @IsOptional()
    @IsEmail({}, { message: 'Please enter correct email' })
    readonly email?: string;

    @IsOptional()
    @IsString()
    @MinLength(8)
    readonly password?: string;

    @IsArray()
    @IsOptional()
    @IsString({ each: true })
    roles?: string[];
}
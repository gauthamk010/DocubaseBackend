import { Transform } from "class-transformer";
import { IsArray, IsEmail, IsEnum, IsNotEmpty, IsOptional, IsString, MinLength } from "class-validator";
import { Role } from "src/auth/enums/role.enum";

export class CreateUserDTO
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
    @IsEnum(Role, { each: true })
    @IsString({ each: true })
    @Transform(({ value }) => value ?? [Role.User])
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
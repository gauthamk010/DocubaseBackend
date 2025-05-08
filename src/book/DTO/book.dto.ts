// src/DTO/book.dto.ts
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateBookDTO {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  author: string;

  @IsNotEmpty()
  @IsString()
  genre: string;

  @IsNotEmpty()
  @IsString()
  description: string;

  @IsNotEmpty()
  @IsString()
  coverImagePath: string;
  
  @IsNotEmpty()
  @IsString()
  textFilePath: string;
}

export class UpdateBookDTO {
  @IsString()
  @IsOptional()
  name?: string;

  @IsString()
  @IsOptional()
  author?: string;

  @IsOptional()
  @IsString()
  genre?: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsString()
  coverImagePath?: string;
  
  @IsOptional()
  @IsString()
  textFilePath?: string;
}
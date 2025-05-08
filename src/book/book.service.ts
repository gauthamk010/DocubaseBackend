// book.service.ts
import { Injectable, HttpException, NotFoundException, Res } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import mongoose from 'mongoose';
import { Book } from './schema/book.schema';
import { CreateBookDTO, UpdateBookDTO } from './DTO/book.dto';
import { AuthService } from 'src/auth/auth.service';
import * as fs from 'fs/promises';
import * as path from 'path';

@Injectable()
export class BookService {
  constructor(
    @InjectModel(Book.name) private bookModel: mongoose.Model<Book>,
    private authService: AuthService,
  ) {}

  async createBook(
    createbookDto: CreateBookDTO,
    files: {
      coverImage?: Express.Multer.File[];
      textFile?: Express.Multer.File[];
    },
  ) 
  {
    const coverImagePath = files.coverImage?.[0]?.path;
    const textFilePath = files.textFile?.[0]?.path;

    if (!coverImagePath || !textFilePath) {
      throw new HttpException('Both files must be uploaded', 400);
    }

    const newBook = new this.bookModel({
      ...createbookDto,
        coverImagePath: coverImagePath.replace(/\\/g, '/'), 
        textFilePath: textFilePath.replace(/\\/g, '/'),
    });

    return {
      message: 'Book uploaded successfully',
      book: await newBook.save(),
    };
  }

    async findAllBooks(): Promise<Book[]> 
    {
        const allBooks = await this.bookModel.find();
        return allBooks;
    }

    async findBookById(id: string): Promise<Book | null>{
        return await this.bookModel.findById(id);
    }
  
    async findBooksByFilters(name?: string, genre?: string): Promise<Book[]> 
    {
        const filter: any = {};
        if (name) {
          filter.name = new RegExp(name, 'i');
        }
        if (genre) {
          filter.genre = new RegExp(genre, 'i');
        }
        return await this.bookModel.find(filter);
    }
  
    
    async updateBook(
      id: string,
      updateBookDto: UpdateBookDTO,
      files?: {
        coverImage?: Express.Multer.File[];
        textFile?: Express.Multer.File[];
      },
    ) {
      const coverImagePath = files?.coverImage?.[0]?.path;
      const textFilePath = files?.textFile?.[0]?.path;
    
      const updatedBook = await this.bookModel.findByIdAndUpdate(
        id,
        {
          ...updateBookDto,
          coverImagePath: coverImagePath?.replace(/\\/g, '/'),
          textFilePath: textFilePath?.replace(/\\/g, '/'),
        },
        { new: true }
      );
    
      if (!updatedBook) {
        throw new HttpException('Book not found', 404);
      }
      return updatedBook;
    }
    
    async deleteBook(id: string) {
      const book = await this.bookModel.findById(id);
      if (!book) {
        throw new NotFoundException('Book not found');
      }
    
      const deleteIfExists = async (filePath: string) => {
        try {
          const resolvedPath = path.resolve(filePath);
          await fs.unlink(resolvedPath);
          console.log(`Deleted: ${resolvedPath}`);
        } catch (err: any) {
          if (err.code !== 'ENOENT') { // Ignore "file not found" errors
            console.warn(`Error deleting ${filePath}:`, err.message);
          }
        }
      };
    
      if (book.coverImagePath) await deleteIfExists(book.coverImagePath);
      if (book.textFilePath) await deleteIfExists(book.textFilePath);
    
      const deletedBook = await this.bookModel.findByIdAndDelete(id);
    
      return {
        message: 'Book and associated files removed successfully',
        deletedBook,
      };
    }
}


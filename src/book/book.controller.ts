import { Controller, Post, Body, UseGuards, Request, UseInterceptors, UploadedFiles, Param, Delete, Put, Get, NotFoundException, Req, Res, Query } from '@nestjs/common';
import { createReadStream, statSync, existsSync } from 'fs';
import { extname } from 'path';
import { Response } from 'express';
import * as mime from 'mime-types'; 
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { multerDiskOptions } from 'src/book/config/multer.config';
import { BookService } from './book.service';
import { CreateBookDTO, UpdateBookDTO } from './DTO/book.dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { Role } from 'src/auth/enums/role.enum';
import { Roles } from 'src/auth/decorators/roles.decorator';

@Controller('book')
@UseGuards(JwtAuthGuard, RolesGuard)
export class BookController {
  constructor(private readonly bookService: BookService) {}

  private async streamFileWithRangeSupport(req: Request, res: Response, filePath: string) 
  {
    const fileSize = statSync(filePath).size;
    const mimeType = mime.lookup(extname(filePath)) || 'application/octet-stream';
  
    const range = (req.headers as unknown as Record<string, string>).range;
    if (range) {
      const [startStr, endStr] = range.replace(/bytes=/, '').split('-');
      const start = parseInt(startStr, 10);
      const end = endStr ? parseInt(endStr, 10) : fileSize - 1;
      const chunkSize = end - start + 1;
  
      const file = createReadStream(filePath, { start, end });
  
      res.writeHead(206, {
        'Content-Range': `bytes ${start}-${end}/${fileSize}`,
        'Accept-Ranges': 'bytes',
        'Content-Length': chunkSize,
        'Content-Type': mimeType,
      });
  
      file.pipe(res);
    } 
    else {
      const file = createReadStream(filePath);
      res.writeHead(200, {
        'Content-Length': fileSize,
        'Content-Type': mimeType,
      });
      file.pipe(res);
    }
  }

  @Post('new')
  @Roles(Role.Admin, Role.Moderator)
  @UseInterceptors(
    FileFieldsInterceptor(
      [
        { name: 'coverImage', maxCount: 1 },
        { name: 'textFile', maxCount: 1 },
      ],
      { storage: multerDiskOptions },
    ),
  )
  uploadBook(
    @UploadedFiles()
    files: {
      coverImage?: Express.Multer.File[];
      textFile?: Express.Multer.File[];
    },
    @Body() bookDto: CreateBookDTO,
    @Request() req,
  ) {
    return this.bookService.createBook(bookDto, files);
  }

  @Put('update/:id')
  @UseInterceptors(
    FileFieldsInterceptor(
      [
        { name: 'coverImage', maxCount: 1 },
        { name: 'textFile', maxCount: 1 },
      ],
      { storage: multerDiskOptions }
    )
  )
  @Roles(Role.Admin, Role.Moderator)
  updateBook(
    @Param('id') id: string,
    @Body() updateBookDTO: UpdateBookDTO,
    @UploadedFiles()
    files: {
      coverImage?: Express.Multer.File[];
      textFile?: Express.Multer.File[];
    },
  ) {
    return this.bookService.updateBook(id, updateBookDTO, files);
  }
  
  @Delete('delete/:id')
  @Roles(Role.Admin, Role.Moderator)
  deleteBook(@Param('id') id: string) {
    return this.bookService.deleteBook(id);
  }

  @Get('all')
  getAllBooks() {
    return this.bookService.findAllBooks();
  }

  @Get()
  getBooksByFilters(
    @Query('name') name?: string,
    @Query('genre') genre?: string,
  ) 
  {
  return this.bookService.findBooksByFilters(name, genre);
  }

  @Get('cover/:id')
  async streamCoverImage(@Param('id') id: string, @Req() req: Request, @Res() res: Response) 
  {
    const book = await this.bookService.findBookById(id);
    const filePath = book?.coverImagePath;
        
    if (!filePath || !existsSync(filePath)) {
      throw new NotFoundException('Cover image not found');
    }    
    await this.streamFileWithRangeSupport(req, res, filePath);
  }
      
  @Get('file/:id')
  async streamTextFile(@Param('id') id: string, @Req() req: Request, @Res() res: Response) {
    const book = await this.bookService.findBookById(id);
    const filePath = book?.textFilePath;
      
    if (!filePath || !existsSync(filePath)) {
      throw new NotFoundException('Text file not found');
    }  
    await this.streamFileWithRangeSupport(req, res, filePath);
  }

}

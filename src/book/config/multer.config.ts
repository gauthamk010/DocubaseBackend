// config/multer.config.ts
import { diskStorage } from 'multer';
import { extname } from 'path';

export const multerDiskOptions = diskStorage({
  destination: './uploads',
  
  filename: (req, file, callback) => {
    const uniqueSuffix = `${Math.round(Math.random() * 1e9)}`;
    const ext = extname(file.originalname);
    callback(null, `${file.fieldname}-${uniqueSuffix}${ext}`);
  },
});

import { Injectable, HttpException, InternalServerErrorException, NotFoundException  } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import mongoose from 'mongoose';
import { Types } from 'mongoose';
import { AuthService } from 'src/auth/auth.service';
import { User } from '../auth/schemas/user.schema';
import { CreateUserDTO, UpdateUserDTO } from './DTO/user.dto';
import * as bcrypt from 'bcrypt';

const generatePassword = async () => {
  const rawPassword = Math.random().toString(30).slice(-10); 
  const hashedPassword = await bcrypt.hash(rawPassword, 15);
  return { rawPassword, hashedPassword };
};

@Injectable()
export class UserService {

     constructor( 
            @InjectModel(User.name) 
            private userModel: mongoose.Model<User>,
            private authService: AuthService
    ) {}
    
    async createUser(createUserDto: CreateUserDTO)
    {
        try{
            const { roles, name, email, phoneNumber, profileImage } = createUserDto;
            const { rawPassword, hashedPassword } = await generatePassword();
            const profileimage = `https://api.dicebear.com/9.x/initials/svg?seed=${encodeURIComponent(name)}`; 

          const newUser = new this.userModel({
              ...createUserDto,  
              phoneNumber,               
              password: hashedPassword,
              profileImage: profileimage,  
          });
  
          await newUser.save();
          return { message: "User created.", email: createUserDto.email, password: rawPassword };
  
        } 
        catch (error) 
        {
          console.error("Error creating user:", error);
          throw new InternalServerErrorException("Failed to create user.");
        }
    }

    async findAllUsers(): Promise<User[]> 
    {
      const allUsers = await this.userModel.find(); /*{ roles: { $nin: ["admin", "moderator"] }}*/
      return allUsers as User[];
    }

    async findOneUser(id: string): Promise<User | null> {
        if (!Types.ObjectId.isValid(id)) {
            throw new NotFoundException('Invalid user ID');
        }
        const user = await this.userModel.findById(new Types.ObjectId(id)).exec();
        if (!user) {
          throw new NotFoundException('User not found');
        }
        return user;
      }
    
    async updateUser(id: string, updateUserDto: UpdateUserDTO) {
        const updatedUser = await this.userModel.findByIdAndUpdate(
            id, updateUserDto, 
            { new: true,  runValidators: true  });
        if (!updatedUser) {
            throw new HttpException('User not found', 404)   
        }
        return updatedUser;
    }

    async deleteUser(id: string) {
        const deletedUser = await this.userModel.findByIdAndDelete(id);
        if (!deletedUser) 
        {
            throw new NotFoundException('User not found');
        }
        return { message: 'USER deleted successfully', deletedUser };
    }
}
import { IsNotEmpty, IsOptional, IsString, MaxLength, MinLength } from "class-validator";



export class UpdatePostDto {
    @IsOptional()
    @IsNotEmpty({message: "Title is required"})
    @IsString({message: "Title must be a string"})
    @MinLength(5, {message: "Title must be at least 5 characters long"})
    @MaxLength(100, {message: "Title must be at most 100 characters long"})
    title: string;
    @IsOptional()
    @IsNotEmpty({message: "Content is required"})
    @IsString({message: "Content must be a string"})
    @MinLength(20, {message: "Content must be at least 20 characters long"})
    content: string;
    @IsOptional()
    @IsNotEmpty({message: "Author name is required"})
    @IsString({message: "Author name must be a string"})
    @MinLength(3, {message: "Author name must be at least 3 characters long"})
    @MaxLength(50, {message: "Author name must be at most 50 characters long"})
    authorName: string;
    

}
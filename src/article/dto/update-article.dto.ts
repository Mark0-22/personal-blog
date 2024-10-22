import {
  IsDate,
  IsNotEmpty,
  IsNumber,
  IsString,
  MinLength,
} from 'class-validator';

export class UpdateArticleDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsDate()
  @IsNotEmpty()
  date: Date;

  @IsString()
  @IsNotEmpty()
  @MinLength(5)
  content: string;

  @IsNumber()
  @IsNotEmpty()
  id: number;
}

import { Transform } from 'class-transformer';
import { IsNotEmpty, IsString, IsBoolean, IsOptional, IsEmpty, IsNumber, IsDate } from 'class-validator';

export class CreateTodoDto {
  @IsEmpty()
  id?: number;

  @IsNotEmpty()
  @IsString()
  title: string;

  @IsString()
  description?: string;

  @Transform(({ value }) => value)
  @IsBoolean()
  isCompleted: boolean = false;

  @Transform(({ value }) => value)
  @IsDate()
  createdAt: Date = new Date();

  @Transform(({ value }) => value)
  @IsDate()
  updatedAt: Date = new Date();

  @Transform(({ value }) => value)
  @IsDate()
  deletedAt: Date = new Date();
}
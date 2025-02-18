import { IsString, IsNotEmpty } from 'class-validator';

export class CreateNewsletterDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsNotEmpty()
  content: string;
}

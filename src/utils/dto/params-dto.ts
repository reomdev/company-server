import { IsNotEmpty } from 'class-validator';
export class ParamsUpdateDto {
  @IsNotEmpty()
  id: string;
}

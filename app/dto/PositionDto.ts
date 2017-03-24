import { IsNotEmpty } from 'class-validator';
import { IPositionDto } from '../../common/index';


export class PositionDto implements IPositionDto {
  id: number;
  @IsNotEmpty()
  title: string;
}


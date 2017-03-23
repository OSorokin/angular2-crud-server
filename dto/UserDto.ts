import {IsNotEmpty} from 'class-validator';
import {Type} from 'class-transformer';
import { IUserDto } from '../common/index';
import { UserGenderDto } from '../common/main/dto/IUserDto';
import { IProjectDto } from '../common/main/dto/IProjectDto';
import { IPositionDto } from '../common/main/dto/IPositionDto';
import { ProjectDto } from './ProjectDto';
import { PositionDto } from './PositionDto';
import { Gender } from '../models/Gender';

export class UserDto implements IUserDto {
  id: number;

  @IsNotEmpty()
  name: string;

  @IsNotEmpty()
  surname: string;

  @IsNotEmpty()
  birth_date?: string;

  @IsNotEmpty()
  gender: Gender;

  @IsNotEmpty()
  email: string;

  project: IProjectDto;

  position: IPositionDto;
}

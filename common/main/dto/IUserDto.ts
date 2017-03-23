import { IProjectDto } from './IProjectDto';
import { IPositionDto } from './IPositionDto';
import { Gender } from '../../../models/Gender';

export enum UserGenderDto {
  MALE = 0,
  FEMALE = 1
}

export interface IUserDto {
  id?: number;
  name?: string;
  surname?: string;
  birth_date?: string;
  gender?: Gender;
  email?: string;
  position?: IPositionDto;
  project?: IProjectDto;
}

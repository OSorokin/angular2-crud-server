import { IUserDto } from '../../common/index';
import { IProjectDto } from '../../common/main/dto/IProjectDto';
import { IPositionDto } from '../../common/main/dto/IPositionDto';

export class UserDto implements IUserDto {
  id?: number;

  name?: string;

  surname?: string;

  birth_date?: string;

  email?: string;

  project?: IProjectDto;

  position?: IPositionDto;
}

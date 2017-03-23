import * as _ from 'lodash';
import { User } from '../models/index';
import { UserDto } from '../dto/UserDto';
import { UserGenderDto } from '../common/index';
import { Gender } from '../models/Gender';

export class UserMapper {

  private static GENDER_MAPPER_TO_DTO = new Map<Gender, Gender>([
    [Gender.MALE, Gender.MALE],
    [Gender.FEMALE, Gender.FEMALE]
  ]);

  private static GENDER_MAPPER_TO_INSTANCE = new Map<Gender, Gender>([
    [Gender.MALE, Gender.MALE],
    [Gender.FEMALE, Gender.FEMALE]
  ]);

  static mapToDto(user: User.Instance): UserDto {
    const dto: UserDto = new UserDto();
    dto.id = user.id;
    dto.name = user.name;
    dto.surname = user.surname;
    dto.birth_date = user.birth_date;
    dto.gender = UserMapper.GENDER_MAPPER_TO_DTO.get(user.gender);
    dto.email = user.email;
    dto.project = user.project;
    dto.position = user.position;
    return dto;
  }


  static mapToInstance(instance: User.Instance, dto: UserDto): User.Instance {
    instance.name = dto.name;
    instance.surname = dto.surname;
    instance.birth_date = dto.birth_date;
    instance.email = dto.email;
    instance.gender = UserMapper.GENDER_MAPPER_TO_INSTANCE.get(dto.gender);
    instance.projectId = dto.project.id;
    instance.positionId = dto.position.id;
    return instance;
  }
}
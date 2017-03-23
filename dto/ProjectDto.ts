import {IsNotEmpty} from 'class-validator';
import {IProjectDto} from '../common/index';


export class ProjectDto implements IProjectDto {
  id: number;
  @IsNotEmpty()
  title: string;
}

import BaseController from './BaseController';
import {JsonController, Get, UseBefore, Req, Post, Body, Put, Param} from 'routing-controllers/index';
import ProjectService from '../services/ProjectService';
import {User, Project} from '../models/index';
import {TTS4T_HTTP} from '../typings';
import { ProjectDto } from '../dto/ProjectDto';
import {Locations} from '../common/index';

@JsonController('/api')
export default class ProjectController extends BaseController {

  constructor() {
    super(__filename);
  }

  @Post(Locations.Project.CREATE)
  async create( @Body() project: ProjectDto): Promise<ProjectDto> {
    return ProjectService.create(project);
  }

}

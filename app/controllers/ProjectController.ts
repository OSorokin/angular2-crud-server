import BaseController from './BaseController';
import { JsonController, Get, Req, Body, Post, Put, Param } from 'routing-controllers/index';
import ProjectService from '../services/ProjectService';
import { TTS4T_HTTP } from '../../typings';
import { ProjectDto } from '../dto/ProjectDto';
import { Locations } from '../../common/index';

@JsonController('/api')
export default class ProjectController extends BaseController {

  constructor() {
    super(__filename);
  }

  @Post(Locations.Project.CREATE)
  async create( @Body() project: ProjectDto): Promise<ProjectDto> {
    return ProjectService.create(project);
  }

  @Get(Locations.Project.GET_ONE)
  getProject(@Param('id') projectId: number): Promise<ProjectDto> {
    return ProjectService.findOne( projectId );
  }

  @Get(Locations.Project.GET_ALL)
  getProjects(@Req() req: TTS4T_HTTP.Request): Promise<ProjectDto[]> {
    return ProjectService.findAll();
  }

  @Put(Locations.Project.UPDATE)
  async updateProject(@Param('id') projectId: number, @Body() project: ProjectDto): Promise<ProjectDto> {
    await this.validate(project);
    return ProjectService.update( projectId, project );
  }

}

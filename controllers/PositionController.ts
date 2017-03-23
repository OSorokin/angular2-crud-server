import BaseController from './BaseController';
import {JsonController, Get, UseBefore, Req, Post, Body, Put, Param} from 'routing-controllers/index';
import PositionService  from '../services/PositionService';
import {TTS4T_HTTP} from '../typings';
import { PositionDto } from '../dto/PositionDto';
import {Locations} from '../common/index';

@JsonController('/api')
export default class PositionController extends BaseController {

  constructor() {
    super(__filename);
  }

  @Post(Locations.Position.CREATE)
  async create( @Body() project: PositionDto): Promise<PositionDto> {
    return PositionService.create(project);
  }

}

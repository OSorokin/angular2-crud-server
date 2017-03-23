import BaseController from './BaseController';
import {JsonController, Get, UseBefore, Req, Post, Body, Put, Param} from 'routing-controllers/index';
import UserService from '../services/UserService';
import {UserDto} from '../dto/UserDto';
import {User} from '../models/index';
import {TTS4T_HTTP} from '../typings';
import {Locations} from '../common/index';
const logger = require('../logger/logger').getLogger(__filename);

@JsonController(Locations.API)
export default class UserController extends BaseController {

  constructor() {
    super(__filename);
  }

  @Post(Locations.User.CREATE)
  async createUser(@Body() user: UserDto): Promise<UserDto> {
    logger.info('body: '+user.name);
    return UserService.create(user);
  }

}

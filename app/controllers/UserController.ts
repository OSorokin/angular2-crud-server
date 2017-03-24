import BaseController from './BaseController';
import { JsonController, Get, Req, Post, Body, Put, Param } from 'routing-controllers/index';
import UserService from '../services/UserService';
import { UserDto } from '../dto/UserDto';
import { TTS4T_HTTP } from '../../typings';
import { Locations } from '../../common/index';
const logger = require('../logger/logger').getLogger(__filename);

@JsonController(Locations.API)
export default class UserController extends BaseController {

  constructor() {
    super(__filename);
  }

  @Post(Locations.User.CREATE)
  async createUser(@Req() req: TTS4T_HTTP.Request, @Body() user: UserDto): Promise<UserDto> {
    console.info('@Req() req ' + req.local);
    return UserService.create(user);
  }

  @Get(Locations.User.GET_ONE)
  getUser(@Param('id') userId: number): Promise<UserDto> {
    return UserService.findOne(userId);
  }

  @Get(Locations.User.GET_ALL)
  getUsers(@Req() req: TTS4T_HTTP.Request): Promise<UserDto[]> {
    return UserService.findAll();
  }

  @Put(Locations.User.UPDATE)
  async updateUser(@Param('id') userId: number, @Body() user: UserDto): Promise<UserDto> {
    await this.validate(user);
    return UserService.update( userId, user,);
  }

}

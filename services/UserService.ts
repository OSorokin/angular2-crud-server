import * as _ from 'lodash';
import * as Sequelize from 'sequelize';
import { UserDto } from '../dto/UserDto';
import {User, Project, Position} from '../models/index';
import {UserMapper} from '../mappers/UserMapper';
import connection from '../db/connection';
import AbstractService from './AbstractService';
import {NotFound, BadRequest} from '../bin/Errors';
const logger = require('../logger/logger').getLogger(__filename);
class UserService extends AbstractService {

  constructor() {
    super(__filename);
  }

  public async create(userDto: UserDto): Promise<UserDto> {
    const user: User.Instance = await connection.transaction(async(t: Sequelize.Transaction) => {
      const user = UserMapper.mapToInstance(User.Model.build(), userDto);
      const newUser = await user.save({transaction: t});
      const project = await this.getValidProject(userDto, t);
      const position = await this.getValidPosition(userDto, t);
      await newUser.setProject(project, {transaction: t});
      await newUser.setPosition(position, {transaction: t});
      newUser.project = project;
      newUser.position = position;
      return newUser;
    });
    let findOneById = User.Model
      .scope(User.Scopes.INCLUDE_POSITION)
      .findOneById(1);
    return UserMapper.mapToDto(user);
  }

  private async getValidProject(dto: UserDto, t: Sequelize.Transaction): Promise<Project.Instance> {
    const id = dto.project.id;
    const project = await Project.Model.findById(id, {transaction: t});

    if (id != project.id) {
      throw new BadRequest('Invalid credentials');
    }

    return project;
  }

  private async getValidPosition(dto: UserDto, t: Sequelize.Transaction): Promise<Position.Instance> {
    const id = dto.position.id;
    const position = await Position.Model.findById(id, {transaction: t});

    if (id != position.id) {
      throw new BadRequest('Invalid credentials');
    }

    return position;
  }

}

export default new UserService();

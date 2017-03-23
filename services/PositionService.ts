import * as _ from 'lodash';
import * as Sequelize from 'sequelize';
import { Position } from '../models/index';
import { PositionMapper} from '../mappers/PositionMapper';
import { PositionDto } from '../dto/PositionDto';
import connection from '../db/connection';
import AbstractService from './AbstractService';

class PositionService extends AbstractService {

  constructor() {
    super(__filename);
  }

  public async create(dto: PositionDto): Promise<PositionDto> {
    return connection.transaction(async(t: Sequelize.Transaction) => {
      const position = PositionMapper.mapToInstance(Position.Model.build(), dto);

      await position.validate();
      await position.save({transaction: t});

      return PositionMapper.mapToDto(position);
    });
  }

}

export default new PositionService();


import * as Sequelize from 'sequelize';
import {TTS4T_ORM} from '../typings';
import {User} from './index';

namespace Position {

  export interface Class extends TTS4T_ORM.Model<Instance, Attributes>, ClassMethods {
    scope(options?: string | Array<string> | Sequelize.ScopeOptions | Sequelize.WhereOptions): this;
  }

  export interface Instance extends Sequelize.Instance<Attributes>, Attributes {
    user?: User.Instance,
  }

  export interface ClassMethods extends TTS4T_ORM.ClassMethods {
    findOneById(id: number): Promise<User.Instance>
  }

  export interface Attributes {
    id?: number;
    title?: string;
  }

  export let Model: Class;

  function getClassMethods(): ClassMethods {
    return {
      associate: function (models) {
        Model.belongsTo(models.User.Model, {
          as: 'user',
          foreignKey: 'user_id'
        });
      },
      findOneById: function (id): Promise<Position.Instance> {
        return this.findOne({
          where: {
            id: id
          }
        });
      },
    };
  }

  export function initialize(connection: Sequelize.Sequelize): Position.Class {
    Model = <Class> connection.define<Instance, Attributes>('position', {
      id: {
        type: Sequelize.BIGINT,
        primaryKey: true,
        autoIncrement: true
      },
      title: {
        type: Sequelize.STRING(250),
        field: 'title',
        unique: true,
        validate: {
          notEmpty: true
        }
      },
    },
      {
      underscored: true,
      freezeTableName: true,
      instanceMethods: {},
    });
    return Model;
  }
}

export = Position;



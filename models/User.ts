import * as Sequelize from 'sequelize';
import { TTS4T_ORM } from '../typings';
import { Position, Project } from './index';
import { Gender } from './Gender';

namespace User {

  export class Scopes {
    public static INCLUDE_POSITION: string = 'INCLUDE_POSITION';
    public static INCLUDE_PROJECT: string = 'INCLUDE_PROJECT';
  }

  export interface Class extends TTS4T_ORM.Model<Instance, Attributes>, ClassMethods {
    scope(options?: string | Array<string> | Sequelize.ScopeOptions | Sequelize.WhereOptions): this;
  }

  export interface Instance extends Sequelize.Instance<Attributes>, Attributes {
    position?: Position.Instance,
    project?: Project.Instance

    getProject: Sequelize.HasOneGetAssociationMixin<Project.Instance>;
    setProject: Sequelize.HasOneSetAssociationMixin<Project.Instance, number>;

    getPosition: Sequelize.HasOneGetAssociationMixin<Position.Instance>;
    setPosition: Sequelize.HasOneSetAssociationMixin<Position.Instance, number>;
  }

  export interface ClassMethods extends TTS4T_ORM.ClassMethods {
    findOneById(id: number): Promise<User.Instance>
  }

  export interface Attributes {
    id?: number;
    name?: string;
    surname?: string;
    birth_date?: string;
    gender?: Gender,
    email?: string;
    positionId?: number;
    projectId?: number;
  }

  export let Model: Class;

  function getClassMethods(): ClassMethods {
    return {
      associate: function (models) {
        Model.belongsTo(models.Position.Model, {
          as: 'position',
          foreignKey: 'position_id'
        });
        Model.belongsTo(models.Project.Model, {
          as: 'project',
          foreignKey: 'project_id'
        });
      },
      addScopes: function (models) {
        Model.addScope(Scopes.INCLUDE_POSITION, function () {
          return {
            include: [
              {
                model: models.Position.Model,
                as: 'position',
              }
            ]
          }
        });
        Model.addScope(Scopes.INCLUDE_PROJECT, function () {
          return {
            include: [
              {
                model: models.Project.Model,
                as: 'project',
              }
            ]
          }
        });
      },
      findOneById: function (id): Promise<User.Instance> {
        return this.findOne({
          where: {
            id: id
          }
        });
      },

    };
  }

  export function initialize(connection: Sequelize.Sequelize): User.Class {
    Model = <Class> connection.define<Instance, Attributes>('user', {
      id: {
        type: Sequelize.BIGINT,
        primaryKey: true,
        autoIncrement: true
      },
      name: {
        type: Sequelize.STRING(250),
        field: 'name',
      },
      surname: {
        type: Sequelize.STRING(250),
        field: 'surname',
      },
      birth_date: {
        type: Sequelize.STRING(250),
        field: 'birth_date',
      },
      gender:{
        type: Sequelize.INTEGER,
        field: 'gender',
      },
      email: {
        type: Sequelize.STRING(50),
        field: 'email',
        unique: true
      },
      positionId: {
        type: Sequelize.BIGINT,
        field: 'position_id'
      },
      projectId: {
        type: Sequelize.BIGINT,
        field: 'project_id'
      },
    }, {
      underscored: true,
      freezeTableName: true,
      instanceMethods: {},
      classMethods: getClassMethods()
    });
    return Model;
  }
}

export = User;
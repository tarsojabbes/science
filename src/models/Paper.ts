import { Model, DataTypes, Association, BelongsToManyGetAssociationsMixin, BelongsToManySetAssociationsMixin, BelongsToManyAddAssociationMixin, BelongsToManyRemoveAssociationMixin } from 'sequelize';
import sequelize from '../config/database';
import { User } from './User';

export class Paper extends Model {
  public id!: number;
  public name!: string;
  public publishedDate!: Date;
  public submissionDate!: Date;
  public url!: string;

  public getResearchers!: BelongsToManyGetAssociationsMixin<User>;
  public setResearchers!: BelongsToManySetAssociationsMixin<User, number>;
  public addResearcher!: BelongsToManyAddAssociationMixin<User, number>;
  public removeResearcher!: BelongsToManyRemoveAssociationMixin<User, number>;

  public researchers?: User[];

  public static associations: {
    researchers: Association<Paper, User>;
  };
}

Paper.init({
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  publishedDate: {
    type: DataTypes.DATE,
    allowNull: true
  },
  submissionDate: {
    type: DataTypes.DATE,
    allowNull: true
  },
  url: {
    type: DataTypes.STRING,
    allowNull: true
  }
}, {
  sequelize,
  tableName: 'papers',
  timestamps: false
});
import { Model, DataTypes, Association } from 'sequelize';
import sequelize from '../config/database';
import { Issue } from './Issue';
import { Paper } from './Paper';
import { User } from './User';

export class Journal extends Model {
  public id!: number;
  public name!: string;
  public issn!: string;

  public issues?: Issue[];
  public papers?: Paper[];
  public editors?: User[];
  public reviewers?: User[];
  
  public static associations: {
    issues: Association<Journal, Issue>;
    papers: Association<Journal, Paper>;
    editors: Association<Journal, User>;
    reviewers: Association<Journal, User>;
  }
}

Journal.init({
  id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  name: { type: DataTypes.STRING, allowNull: false },
  issn: { type: DataTypes.STRING, allowNull: false, unique: true }
}, {
  sequelize,
  tableName: 'journals',
  timestamps: false
});

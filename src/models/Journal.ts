import { Model, DataTypes, Association } from 'sequelize';
import sequelize from '../config/database';
import { Issue } from './Issue';
import { Paper } from './Paper';

export class Journal extends Model {
  public id!: number;
  public name!: string;
  public issn!: string;

  public issues?: Issue[];
  public papers?: Paper[];
  
  public static associations: {
    issues: Association<Journal, Issue>;
    papers: Association<Journal, Paper>;
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

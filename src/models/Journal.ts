import { Model, DataTypes } from 'sequelize';
import sequelize from '../config/database';

export class Journal extends Model {
  public id!: number;
  public name!: string;
  public issn!: string;
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

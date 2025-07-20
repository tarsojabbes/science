import { Model, DataTypes } from 'sequelize';
import sequelize from '../config/database';
import { Paper } from './Paper';

export class Issue extends Model {
  public id!: number;
  public number!: number;
  public volume!: number;
  public publishedDate!: Date;
  public journalId!: number;

  public addPaper!: (paper: Paper) => Promise<void>;
  public setPapers!: (papers: Paper[]) => Promise<void>;
  public getPapers!: () => Promise<Paper[]>;
}

Issue.init({
  id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  number: { type: DataTypes.INTEGER, allowNull: false },
  volume: { type: DataTypes.INTEGER, allowNull: false },
  publishedDate: { type: DataTypes.DATE, allowNull: false },
  journalId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: { model: 'journals', key: 'id' }
  }
}, {
  sequelize,
  tableName: 'issues',
  timestamps: false
});

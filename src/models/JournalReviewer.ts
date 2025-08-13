import { Model, DataTypes } from 'sequelize';
import sequelize from '../config/database';

export class JournalReviewer extends Model {
  public id!: number;
  public journalId!: number;
  public userId!: number;
  public expertise!: string[];
  public assignedAt!: Date;
  public isActive!: boolean;
}

JournalReviewer.init({
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  journalId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'journals',
      key: 'id'
    }
  },
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'users',
      key: 'id'
    }
  },
  expertise: {
    type: DataTypes.ARRAY(DataTypes.STRING),
    allowNull: false,
    defaultValue: []
  },
  assignedAt: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW
  },
  isActive: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: true
  }
}, {
  sequelize,
  tableName: 'journal_reviewers',
  timestamps: false,
  indexes: [
    {
      unique: true,
      fields: ['journalId', 'userId']
    }
  ]
}); 
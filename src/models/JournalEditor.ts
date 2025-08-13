import { Model, DataTypes } from 'sequelize';
import sequelize from '../config/database';

export class JournalEditor extends Model {
  public id!: number;
  public journalId!: number;
  public userId!: number;
  public assignedAt!: Date;
}

JournalEditor.init({
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
  assignedAt: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW
  }
}, {
  sequelize,
  tableName: 'journal_editors',
  timestamps: false,
  indexes: [
    {
      unique: true,
      fields: ['journalId', 'userId']
    }
  ]
}); 
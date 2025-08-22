import { Model, DataTypes } from 'sequelize';
import sequelize from '../config/database';

export class Review extends Model {
  public id!: number;
  public requestDate!: Date;
  public status!: string;
  public paperId!: number;
  public requesterId!: number;
  public firstReviewerId!: number;
  public secondReviewerId!: number;
  public assignedDate!: Date;
  public completedDate!: Date;
  public finalDecision!: string; // 'approved', 'rejected', 'needs_revision'
  public editorNotes!: string;
}

Review.init({
  id: { 
    type: DataTypes.INTEGER, 
    autoIncrement: true, 
    primaryKey: true 
  },
  requestDate: { 
    type: DataTypes.DATE, 
    allowNull: false 
  },
  status: {
    type: DataTypes.STRING,
    allowNull: false,
    defaultValue: 'pending',
    validate: {
      isIn: [['pending', 'in_progress', 'completed', 'cancelled']]
    }
  },
  paperId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: { model: 'papers', key: 'id' }
  },
  requesterId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: { model: 'users', key: 'id' }
  },
  firstReviewerId: {
    type: DataTypes.INTEGER,
    allowNull: true,
    references: { model: 'users', key: 'id' }
  },
  secondReviewerId: {
    type: DataTypes.INTEGER,
    allowNull: true,
    references: { model: 'users', key: 'id' }
  },
  assignedDate: {
    type: DataTypes.DATE,
    allowNull: true
  },
  completedDate: {
    type: DataTypes.DATE,
    allowNull: true
  },
  finalDecision: {
    type: DataTypes.STRING,
    allowNull: true,
    validate: {
      isIn: [['approved', 'rejected', 'needs_revision']]
    }
  },
  editorNotes: {
    type: DataTypes.TEXT,
    allowNull: true
  }
}, {
  sequelize,
  tableName: 'reviews',
  timestamps: false,
});
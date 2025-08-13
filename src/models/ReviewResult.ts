import { Model, DataTypes } from 'sequelize';
import sequelize from '../config/database';

export class ReviewResult extends Model {
  public id!: number;
  public resultDate!: Date;
  public reviewerId!: number;
  public reviewId!: number;
  public recommendation!: string; // 'approve', 'reject', 'major_revision', 'minor_revision', 'not_reviewed'
  public comments!: string;
  public overallScore!: number; // 1-5 scale
  public isSubmitted!: boolean;
}

ReviewResult.init({
  id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  resultDate: { type: DataTypes.DATE, allowNull: false },
  reviewerId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: { model: 'users', key: 'id' }
  },
  reviewId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: { model: 'reviews', key: 'id' }
  },
  recommendation: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      isIn: [['approve', 'reject', 'major_revision', 'minor_revision', 'not_reviewed']]
    }
  },
  comments: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  overallScore: {
    type: DataTypes.INTEGER,
    allowNull: false,
    validate: {
      min: 1,
      max: 5
    }
  },
  isSubmitted: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: false
  }
}, {
  sequelize,
  tableName: 'review_results',
  timestamps: false,
});

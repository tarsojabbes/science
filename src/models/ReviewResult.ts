import { Model, DataTypes } from 'sequelize';
import sequelize from '../config/database';

export class ReviewResult extends Model {
  public id!: number;
  public resultDate!: Date;
  public firstReviewerNote!: string;
  public secondReviewerNote!: string;
  public approval!: boolean;
  public reviewId!: number;
}

ReviewResult.init({
  id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  resultDate: { type: DataTypes.DATE, allowNull: false },
  firstReviewerNote: { type: DataTypes.TEXT, allowNull: false },
  secondReviewerNote: { type: DataTypes.TEXT, allowNull: false },
  approval: { type: DataTypes.BOOLEAN, allowNull: false }
}, {
  sequelize,
  tableName: 'review_results',
  timestamps: false,
});

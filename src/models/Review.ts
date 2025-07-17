import { Model, DataTypes } from 'sequelize';
import sequelize from '../config/database';

export class Review extends Model {
  public id!: number;
  public requestDate!: Date;

  public paperId!: number;
  public requesterId!: number;
  public firstReviewerId!: number;
  public secondReviewerId!: number;
}

Review.init({
  id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  requestDate: { type: DataTypes.DATE, allowNull: false },
}, {
  sequelize,
  tableName: 'reviews',
  timestamps: false,
});

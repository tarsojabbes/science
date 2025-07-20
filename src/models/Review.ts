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
  id: { 
    type: DataTypes.INTEGER, 
    autoIncrement: true, 
    primaryKey: true 
  },
  requestDate: { 
    type: DataTypes.DATE, 
    allowNull: false 
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
  }
}, {
  sequelize,
  tableName: 'reviews',
  timestamps: false,
});
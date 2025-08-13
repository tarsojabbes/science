import { Model, DataTypes, Association, BelongsToManyGetAssociationsMixin, BelongsToManySetAssociationsMixin, BelongsToManyAddAssociationMixin, BelongsToManyRemoveAssociationMixin } from 'sequelize';
import sequelize from '../config/database';
import { User } from './User';

export class Paper extends Model {
  public id!: number;
  public name!: string;
  public publishedDate!: Date;
  public submissionDate!: Date;
  public url!: string;
  public journalId!: number;
  public issueId!: number;
  public status!: string; // 'submitted', 'under_review', 'approved', 'rejected', 'published'

  public getResearchers!: BelongsToManyGetAssociationsMixin<User>;
  public setResearchers!: BelongsToManySetAssociationsMixin<User, number>;
  public addResearcher!: BelongsToManyAddAssociationMixin<User, number>;
  public removeResearcher!: BelongsToManyRemoveAssociationMixin<User, number>;

  public researchers?: User[];

  public static associations: {
    researchers: Association<Paper, User>;
  };
}

Paper.init({
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  publishedDate: {
    type: DataTypes.DATE,
    allowNull: true
  },
  submissionDate: {
    type: DataTypes.DATE,
    allowNull: true
  },
  url: {
    type: DataTypes.STRING,
    allowNull: true
  },
  journalId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: { model: 'journals', key: 'id' }
  },
  issueId: {
    type: DataTypes.INTEGER,
    allowNull: true,
    references: { model: 'issues', key: 'id' }
  },
  status: {
    type: DataTypes.STRING,
    allowNull: false,
    defaultValue: 'submitted',
    validate: {
      isIn: [['submitted', 'under_review', 'approved', 'rejected', 'published']]
    }
  }
}, {
  sequelize,
  tableName: 'papers',
  timestamps: false
});
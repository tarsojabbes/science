import { Model, DataTypes, Optional, Association } from 'sequelize';
import sequelize from '../config/database';
import { Journal } from './Journal';

export class User extends Model {
  public id!: number;
  public name!: string;
  public email!: string;
  public password!: string;
  public institution!: string;
  public orcid!: string;
  public roles!: string[];

  public editorJournals?: Journal[]; // Journals where the user is an Editor
  public reviewerJournals?: Journal[]; // Journals where the user is a Reviewer
  
  public static associations: {
    editorJournals: Association<User, Journal>;
    reviewerJournals: Association<User, Journal>;
  }
}

User.init({
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  name: DataTypes.STRING,
  email: {
    type: DataTypes.STRING,
    unique: true
  },
  password: DataTypes.STRING,
  institution: DataTypes.STRING,
  orcid: DataTypes.STRING,
  roles: {
    type: DataTypes.ARRAY(DataTypes.STRING),
    allowNull: false
  }
}, {
  sequelize,
  tableName: 'users',
  timestamps: false
});
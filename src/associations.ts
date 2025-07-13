import { User } from './models/User';
import { Paper } from './models/Paper';

User.belongsToMany(Paper, {
  through: 'PaperResearchers',
  foreignKey: 'userId',
  otherKey: 'paperId',
  as: 'papers'
});

Paper.belongsToMany(User, {
  through: 'PaperResearchers',
  foreignKey: 'paperId',
  otherKey: 'userId',
  as: 'researchers'
});

export { User, Paper };
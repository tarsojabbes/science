import { User } from './models/User';
import { Paper } from './models/Paper';
import { Journal } from './models/Journal';
import { Issue } from './models/Issue';

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

Paper.belongsTo(Journal, { foreignKey: 'journalId', as: 'journal' });
Journal.hasMany(Paper, { foreignKey: 'journalId', as: 'papers' });

Paper.belongsTo(Issue, { foreignKey: 'issueId', as: 'issue' });
Issue.hasMany(Paper, { foreignKey: 'issueId', as: 'papers' });

Journal.hasMany(Issue, { foreignKey: "journalId", as: "issues" });
Issue.belongsTo(Journal, { foreignKey: "journalId", as: "journal" });

export { User, Paper, Journal, Issue };
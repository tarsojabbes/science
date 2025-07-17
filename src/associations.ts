import { User } from './models/User';
import { Paper } from './models/Paper';
import { Journal } from './models/Journal';
import { Issue } from './models/Issue';
import { Review } from './models/Review';
import { ReviewResult } from './models/ReviewResult';

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

Review.belongsTo(Paper, { foreignKey: 'paperId', as: 'paper' });
Paper.hasMany(Review, { foreignKey: 'paperId', as: 'reviews' });

Review.belongsTo(User, { foreignKey: 'requesterId', as: 'requester' });
Review.belongsTo(User, { foreignKey: 'firstReviewerId', as: 'firstReviewer' });
Review.belongsTo(User, { foreignKey: 'secondReviewerId', as: 'secondReviewer' });

Review.hasMany(ReviewResult, { foreignKey: 'reviewId', as: 'results' });
ReviewResult.belongsTo(Review, { foreignKey: 'reviewId', as: 'review' });

export { User, Paper, Journal, Issue };
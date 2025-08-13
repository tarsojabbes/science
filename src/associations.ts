import { User } from './models/User';
import { Paper } from './models/Paper';
import { Journal } from './models/Journal';
import { Issue } from './models/Issue';
import { Review } from './models/Review';
import { ReviewResult } from './models/ReviewResult';
import { JournalEditor } from './models/JournalEditor';
import { JournalReviewer } from './models/JournalReviewer';

// 1. Associações básicas Paper-User
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

// 2. Associações Paper-Journal-Issue
Paper.belongsTo(Journal, { foreignKey: 'journalId', as: 'journal' });
Journal.hasMany(Paper, { foreignKey: 'journalId', as: 'papers' });

Paper.belongsTo(Issue, { foreignKey: 'issueId', as: 'issue' });
Issue.hasMany(Paper, { foreignKey: 'issueId', as: 'papers' });

Journal.hasMany(Issue, { foreignKey: "journalId", as: "issues" });
Issue.belongsTo(Journal, { foreignKey: "journalId", as: "journal" });

// 3. Associações Review-Paper
Review.belongsTo(Paper, { foreignKey: 'paperId', as: 'paper' });
Paper.hasMany(Review, { foreignKey: 'paperId', as: 'reviews' });

// 4. Associações Review-User
Review.belongsTo(User, { foreignKey: 'requesterId', as: 'requester' });
Review.belongsTo(User, { foreignKey: 'firstReviewerId', as: 'firstReviewer' });
Review.belongsTo(User, { foreignKey: 'secondReviewerId', as: 'secondReviewer' });

User.hasMany(Review, { foreignKey: 'requesterId', as: 'requestedReviews' });
User.hasMany(Review, { foreignKey: 'firstReviewerId', as: 'firstReviews' });
User.hasMany(Review, { foreignKey: 'secondReviewerId', as: 'secondReviews' });

// 5. Associações Review-ReviewResult
Review.hasMany(ReviewResult, { foreignKey: 'reviewId', as: 'results' });
ReviewResult.belongsTo(Review, { foreignKey: 'reviewId', as: 'review' });
ReviewResult.belongsTo(User, { foreignKey: 'reviewerId', as: 'reviewer' });

// 6. Associações diretas para JournalEditor (deve vir antes das many-to-many)
JournalEditor.belongsTo(User, { foreignKey: 'userId', as: 'user' });
JournalEditor.belongsTo(Journal, { foreignKey: 'journalId', as: 'journal' });

User.hasMany(JournalEditor, { foreignKey: 'userId', as: 'editorAssignments' });
Journal.hasMany(JournalEditor, { foreignKey: 'journalId', as: 'editorAssignments' });

// 7. Associações User-Journal através de JournalEditor
User.belongsToMany(Journal, {
  through: JournalEditor,
  foreignKey: 'userId',
  otherKey: 'journalId',
  as: 'editorJournals'
});

Journal.belongsToMany(User, {
  through: JournalEditor,
  foreignKey: 'journalId',
  otherKey: 'userId',
  as: 'editors'
});

// 8. Associações diretas para JournalReviewer (deve vir antes das many-to-many)
JournalReviewer.belongsTo(User, { foreignKey: 'userId', as: 'user' });
JournalReviewer.belongsTo(Journal, { foreignKey: 'journalId', as: 'journal' });

User.hasMany(JournalReviewer, { foreignKey: 'userId', as: 'reviewerAssignments' });
Journal.hasMany(JournalReviewer, { foreignKey: 'journalId', as: 'reviewerAssignments' });

// 9. Associações User-Journal através de JournalReviewer
User.belongsToMany(Journal, {
  through: JournalReviewer,
  foreignKey: 'userId',
  otherKey: 'journalId',
  as: 'reviewerJournals'
});

Journal.belongsToMany(User, {
  through: JournalReviewer,
  foreignKey: 'journalId',
  otherKey: 'userId',
  as: 'reviewers'
});



export { User, Paper, Journal, Issue, Review, ReviewResult, JournalEditor, JournalReviewer };
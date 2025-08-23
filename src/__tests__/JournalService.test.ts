import { Sequelize, DataType } from 'sequelize-typescript';
import { User } from '../models/User';
import { Journal } from '../models/Journal';
import { JournalEditor } from '../models/JournalEditor';
import { JournalReviewer } from '../models/JournalReviewer';
import { JournalService } from '../services/journalService';
import { JournalEditorService } from '../services/journalEditorService';
import { JournalReviewerService } from '../services/journalReviewerService';
import { Issue } from '../models/Issue';
import { Paper } from '../models/Paper';

describe('Journal integration (real services)', () => {
  let sequelize: Sequelize;
  let journalService: JournalService;
  let journalEditorService: JournalEditorService;
  let journalReviewerService: JournalReviewerService;
  let user: User;
  let user2: User;
  let user3: User;
  let journal: Journal;
  let journal2: Journal;

  beforeAll(async () => {
    sequelize = new Sequelize({
      dialect: 'sqlite',
      storage: ':memory:',
      logging: false
    });

    User.init({
      name: { type: DataType.STRING, allowNull: false },
      email: { type: DataType.STRING, allowNull: false, unique: true },
      password: { type: DataType.STRING, allowNull: false },
      institution: { type: DataType.STRING },
      orcid: { type: DataType.STRING, unique: true },
      roles: { type: DataType.JSON }
    }, { sequelize, modelName: 'User' });

    Journal.init({
      name: { type: DataType.STRING, allowNull: false },
      issn: { type: DataType.STRING, allowNull: false, unique: true }
    }, { sequelize, modelName: 'Journal' });

    Paper.init({
      name: { type: DataType.STRING, allowNull: false },
      publishedDate: { type: DataType.DATE, allowNull: true },
      submissionDate: { type: DataType.DATE, allowNull: true },
      url: { type: DataType.STRING, allowNull: true },
      journalId: { type: DataType.INTEGER, allowNull: false },
      issueId: { type: DataType.INTEGER, allowNull: true }
    }, { sequelize, modelName: 'Paper' });

    JournalEditor.init({
      journalId: { type: DataType.INTEGER, allowNull: false },
      userId: { type: DataType.INTEGER, allowNull: false },
      assignedAt: { type: DataType.DATE, allowNull: false, defaultValue: new Date() }
    }, { sequelize, modelName: 'JournalEditor' });

    JournalReviewer.init({
      journalId: { type: DataType.INTEGER, allowNull: false },
      userId: { type: DataType.INTEGER, allowNull: false },
      expertise: { type: DataType.JSON, allowNull: false, defaultValue: [] },
      assignedAt: { type: DataType.DATE, allowNull: false, defaultValue: new Date() },
      isActive: { type: DataType.BOOLEAN, allowNull: false, defaultValue: true }
    }, { sequelize, modelName: 'JournalReviewer' });

    Issue.init({
      number: { type: DataType.INTEGER, allowNull: false },
      volume: { type: DataType.INTEGER, allowNull: false },
      publishedDate: { type: DataType.DATE, allowNull: true },
      journalId: { type: DataType.INTEGER, allowNull: false }
    }, { sequelize, modelName: 'Issue' });

    Journal.hasMany(Issue, { foreignKey: 'journalId', as: 'issues' });
    Issue.belongsTo(Journal, { foreignKey: 'journalId', as: 'journal' });
    Journal.hasMany(Paper, { foreignKey: 'journalId', as: 'papers' });
    Paper.belongsTo(Issue, { foreignKey: 'issueId', as: 'issue' });
    Issue.hasMany(Paper, { foreignKey: 'issueId', as: 'papers' });

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

    Journal.belongsToMany(User, { through: JournalEditor, as: 'editors', foreignKey: 'journalId', otherKey: 'userId' });

    User.belongsToMany(Journal, { through: JournalEditor, as: 'editorJournals', foreignKey: 'userId', otherKey: 'journalId' });

    Journal.belongsToMany(User, { through: JournalReviewer, as: 'reviewers', foreignKey: 'journalId', otherKey: 'userId' });

    User.belongsToMany(Journal, { through: JournalReviewer, as: 'reviewerJournals', foreignKey: 'userId', otherKey: 'journalId' });

    await sequelize.sync({ force: true });

    journalService = new JournalService();

    journalEditorService = new JournalEditorService();

    journalReviewerService = new JournalReviewerService();

    user = await User.create({ name: 'User 1', email: 'user1@example.com', password: 'pass', institution: 'Inst', orcid: '0000-0000-0000-0001', roles: ['EDITOR', 'REVIEWER'] });

    user2 = await User.create({ name: 'User 2', email: 'user2@example.com', password: 'pass', institution: 'Inst', orcid: '0000-0000-0000-0002', roles: ['EDITOR', 'REVIEWER'] });

    user3 = await User.create({ name: 'User 3', email: 'user3@example.com', password: 'pass', institution: 'Inst', orcid: '0000-0000-0000-0003', roles: ['REVIEWER'] });

    journal = await Journal.create({ name: 'Journal 1', issn: '1234-5678' });
    
    journal2 = await Journal.create({ name: 'Journal 2', issn: '8765-4321' });
  });

  beforeEach(async () => {
    await JournalEditor.destroy({ where: {} });
    await JournalReviewer.destroy({ where: {} });
  });

  afterAll(async () => {
    await sequelize.drop();
    await sequelize.close();
  });

  describe('Journal creation', () => {
    it('Case 1: User creates a journal with valid name and ISSN', async () => {
      const result = await journalService.createJournal({ name: 'Valid Journal', issn: '1111-2222' });
      expect(result).toBeInstanceOf(Journal);
      expect(result?.name).toBe('Valid Journal');
    });

    it('Case 2: User creates a journal without a name', async () => {
      await expect(journalService.createJournal({ name: '', issn: '3333-4444' })).rejects.toThrow();
    });

    it('Case 3: User creates a journal without ISSN', async () => {
      await expect(journalService.createJournal({ name: 'No ISSN', issn: '' })).rejects.toThrow();
    });

    it('Case 4: User creates a journal with an already registered ISSN', async () => {
      await expect(journalService.createJournal({ name: 'Duplicate ISSN', issn: '1234-5678' })).rejects.toThrow();
    });
  });

  describe('Editor management', () => {
    it('Case 1: Add existing user as editor to existing journal', async () => {
      await expect(journalEditorService.addEditorToJournal(journal.id, user.id)).resolves.toBeUndefined();
    });

    it('Case 2: Add existing user as editor to non-existent journal', async () => {
      await expect(journalEditorService.addEditorToJournal(9999, user.id)).rejects.toThrow('Journal not found');
    });

    it('Case 3: Add non-existent user as editor to existing journal', async () => {
      await expect(journalEditorService.addEditorToJournal(journal.id, 9999)).rejects.toThrow('User not found');
    });

    it('Case 4: Add user as editor to journal where already editor', async () => {
      await journalEditorService.addEditorToJournal(journal.id, user.id);
      await expect(journalEditorService.addEditorToJournal(journal.id, user.id)).rejects.toThrow('User is already an editor of this journal');
    });

    it('Case 5: Add same user as editor to two different journals', async () => {
      await expect(journalEditorService.addEditorToJournal(journal.id, user2.id)).resolves.toBeUndefined();
      await expect(journalEditorService.addEditorToJournal(journal2.id, user2.id)).resolves.toBeUndefined();
    });

    it('Case 6: Remove existing editor from existing journal', async () => {
      await journalEditorService.addEditorToJournal(journal.id, user3.id);
      await expect(journalEditorService.removeEditorFromJournal(journal.id, user3.id)).resolves.toBeUndefined();
    });

    it('Case 7: Remove non-editor user from existing journal', async () => {
      await expect(journalEditorService.removeEditorFromJournal(journal.id, user3.id)).rejects.toThrow('User is not an editor of this journal');
    });

    it('Case 8: Remove existing editor from non-existent journal', async () => {
      await journalEditorService.addEditorToJournal(journal.id, user.id);
      await expect(journalEditorService.removeEditorFromJournal(9999, user.id)).rejects.toThrow('User is not an editor of this journal');
    });
  });

  describe('Reviewer management', () => {
    it('Case 1: Add existing user as reviewer to existing journal', async () => {
      await expect(journalReviewerService.addReviewerToJournal(journal.id, user.id)).resolves.toBeUndefined();
    });

    it('Case 2: Add existing user as reviewer to non-existent journal', async () => {
      await expect(journalReviewerService.addReviewerToJournal(9999, user.id)).rejects.toThrow('Journal not found');
    });

    it('Case 3: Add non-existent user as reviewer to existing journal', async () => {
      await expect(journalReviewerService.addReviewerToJournal(journal.id, 9999)).rejects.toThrow('User not found');
    });

    it('Case 4: Add user as reviewer to journal where already reviewer', async () => {
      await journalReviewerService.addReviewerToJournal(journal.id, user.id);
      await expect(journalReviewerService.addReviewerToJournal(journal.id, user.id)).rejects.toThrow('User is already a reviewer of this journal');
    });

    it('Case 5: Add same user as reviewer to two different journals', async () => {
      await expect(journalReviewerService.addReviewerToJournal(journal.id, user2.id)).resolves.toBeUndefined();
      await expect(journalReviewerService.addReviewerToJournal(journal2.id, user2.id)).resolves.toBeUndefined();
    });

    it('Case 6: Remove existing reviewer from existing journal', async () => {
      await journalReviewerService.addReviewerToJournal(journal.id, user3.id);
      await expect(journalReviewerService.removeReviewerFromJournal(journal.id, user3.id)).resolves.toBeUndefined();
    });

    it('Case 7: Remove non-reviewer user from existing journal', async () => {
      await expect(journalReviewerService.removeReviewerFromJournal(journal.id, user3.id)).rejects.toThrow('User is not a reviewer of this journal');
    });

    it('Case 8: Remove existing reviewer from non-existent journal', async () => {
      await journalReviewerService.addReviewerToJournal(journal.id, user.id); 
      await expect(journalReviewerService.removeReviewerFromJournal(9999, user.id)).rejects.toThrow('User is not a reviewer of this journal');
    });
  });

  describe('Permission validation', () => {
    it('Case 1: Only an editor can create an issue for the journal', async () => {
      const canCreate = await journalEditorService.canUserCreateIssue(user3.id, journal.id);
      expect(canCreate).toBe(false);
    });
    
    it('Case 2: Only a reviewer can submit a review for a paper in the journal', async () => {
      const isReviewer = await journalReviewerService.isUserReviewerOfJournal(user2.id, journal.id);
      expect(isReviewer).toBe(false);
    });
  });
});

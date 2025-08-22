import { Sequelize, DataType } from 'sequelize-typescript';
import { User } from '../models/User';
import { Paper } from '../models/Paper';
import { Journal } from '../models/Journal';
import { Issue } from '../models/Issue';
import { Review } from '../models/Review';
import { ReviewResult } from '../models/ReviewResult';
import { JournalReviewer } from '../models/JournalReviewer';
import { ReviewService } from '../services/reviewService';


async function createUser(userData: any) {
  return await User.create(userData);
}
async function createJournal(journalData: any) {
  return await Journal.create(journalData);
}
async function createIssue(issueData: any) {
  return await Issue.create(issueData);
}
async function createPaper(paperData: any) {
  return await Paper.create(paperData);
}


const validUserData = {
  name: 'Jane Doe',
  email: 'jane@example.com',
  password: 'plainPassword',
  institution: 'Test University',
  orcid: '0000-0000-0000-0002',
  roles: ['AUTHOR']
};
const validUserData2 = {
  name: 'John Doe',
  email: 'john@example.com',
  password: 'plainPassword',
  institution: 'Test University',
  orcid: '0000-0000-0000-0003',
  roles: ['REVIEWER']
};
const validUserData3 = {
  name: 'Mary Smith',
  email: 'mary@example.com',
  password: 'plainPassword',
  institution: 'Test University',
  orcid: '0000-0000-0000-0004',
  roles: ['REVIEWER']
};
const validJournalData = { name: 'Journal Test', issn: '1234-5678' };
const validIssueData = { number: 1, volume: 1, publishedDate: new Date(), journalId: 1 };


describe('ReviewService (teste de integração)', () => {
  let sequelize: Sequelize;
  let reviewService: ReviewService;
  let author: User;
  let reviewer1: User;
  let reviewer2: User;
  let reviewer3: User;
  let journal: Journal;
  let issue: Issue;
  let paper: Paper;

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
    Issue.init({
      number: { type: DataType.INTEGER, allowNull: false },
      volume: { type: DataType.INTEGER, allowNull: false },
      publishedDate: { type: DataType.DATE, allowNull: false },
      journalId: { type: DataType.INTEGER, allowNull: false }
    }, { sequelize, modelName: 'Issue' });
    Paper.init({
      name: { type: DataType.STRING, allowNull: false },
      publishedDate: { type: DataType.DATE, allowNull: true },
      submissionDate: { type: DataType.DATE, allowNull: true },
      url: { type: DataType.STRING, allowNull: true },
      journalId: { type: DataType.INTEGER, allowNull: false },
      issueId: { type: DataType.INTEGER, allowNull: true },
      status: { type: DataType.STRING, allowNull: false, defaultValue: 'submitted' }
    }, { sequelize, modelName: 'Paper' });
    Review.init({
      requestDate: { type: DataType.DATE, allowNull: false },
      status: { type: DataType.STRING, allowNull: false, defaultValue: 'pending' },
      paperId: { type: DataType.INTEGER, allowNull: false },
      requesterId: { type: DataType.INTEGER, allowNull: false },
      firstReviewerId: { type: DataType.INTEGER, allowNull: true },
      secondReviewerId: { type: DataType.INTEGER, allowNull: true },
      assignedDate: { type: DataType.DATE, allowNull: true },
      completedDate: { type: DataType.DATE, allowNull: true },
      finalDecision: { type: DataType.STRING, allowNull: true },
      editorNotes: { type: DataType.TEXT, allowNull: true }
    }, { sequelize, modelName: 'Review' });
    ReviewResult.init({
      resultDate: { type: DataType.DATE, allowNull: false },
      reviewerId: { type: DataType.INTEGER, allowNull: false },
      reviewId: { type: DataType.INTEGER, allowNull: false },
      recommendation: { type: DataType.STRING, allowNull: false },
      comments: { type: DataType.TEXT, allowNull: false },
      overallScore: { type: DataType.INTEGER, allowNull: false },
      isSubmitted: { type: DataType.BOOLEAN, allowNull: false, defaultValue: false }
    }, { sequelize, modelName: 'ReviewResult' });
    JournalReviewer.init({
      journalId: { type: DataType.INTEGER, allowNull: false },
      userId: { type: DataType.INTEGER, allowNull: false },
      expertise: { type: DataType.JSON, allowNull: false, defaultValue: [] },
      assignedAt: { type: DataType.DATE, allowNull: false, defaultValue: new Date() },
      isActive: { type: DataType.BOOLEAN, allowNull: false, defaultValue: true }
    }, { sequelize, modelName: 'JournalReviewer' });

    User.belongsToMany(Journal, { through: JournalReviewer, as: 'reviewerJournals', foreignKey: 'userId', otherKey: 'journalId' });
    Journal.belongsToMany(User, { through: JournalReviewer, as: 'reviewers', foreignKey: 'journalId', otherKey: 'userId' });
    JournalReviewer.belongsTo(User, { foreignKey: 'userId', as: 'user' });
    JournalReviewer.belongsTo(Journal, { foreignKey: 'journalId', as: 'journal' });
    User.hasMany(JournalReviewer, { foreignKey: 'userId', as: 'journalReviewerLinks' });
    Journal.hasMany(JournalReviewer, { foreignKey: 'journalId', as: 'journalReviewerLinks' });
    Paper.belongsTo(Journal, { foreignKey: 'journalId', as: 'journal' });
    Journal.hasMany(Paper, { foreignKey: 'journalId', as: 'papers' });
    Paper.belongsTo(Issue, { foreignKey: 'issueId', as: 'issue' });
    Issue.hasMany(Paper, { foreignKey: 'issueId', as: 'papers' });
    Paper.belongsToMany(User, { through: 'PaperResearchers', foreignKey: 'paperId', otherKey: 'userId', as: 'researchers' });
    User.belongsToMany(Paper, { through: 'PaperResearchers', foreignKey: 'userId', otherKey: 'paperId', as: 'papers' });
    Review.belongsTo(Paper, { foreignKey: 'paperId', as: 'paper' });
    Review.belongsTo(User, { foreignKey: 'requesterId', as: 'requester' });
    Review.belongsTo(User, { foreignKey: 'firstReviewerId', as: 'firstReviewer' });
    Review.belongsTo(User, { foreignKey: 'secondReviewerId', as: 'secondReviewer' });
    Review.hasMany(ReviewResult, { foreignKey: 'reviewId', as: 'results' });
    ReviewResult.belongsTo(Review, { foreignKey: 'reviewId', as: 'review' });
    ReviewResult.belongsTo(User, { foreignKey: 'reviewerId', as: 'reviewer' });

    await sequelize.sync({ force: true });
    reviewService = new ReviewService();

    author = await createUser(validUserData);
    reviewer1 = await createUser(validUserData2);
    reviewer2 = await createUser(validUserData3);
    reviewer3 = await createUser({ ...validUserData3, email: 'other@example.com', orcid: '0000-0000-0000-0005' });
    journal = await createJournal(validJournalData);
    issue = await createIssue({ ...validIssueData, journalId: journal.id });
    paper = await createPaper({ name: 'Artigo Teste', url: 'http://example.com', journalId: journal.id, issueId: issue.id, status: 'submitted' });

    await paper.setResearchers([author]);

    await JournalReviewer.create({ journalId: journal.id, userId: reviewer1.id, expertise: [], assignedAt: new Date(), isActive: true });
    await JournalReviewer.create({ journalId: journal.id, userId: reviewer2.id, expertise: [], assignedAt: new Date(), isActive: true });
  });

  beforeEach(async () => {
    await Review.destroy({ where: {} });
    await ReviewResult.destroy({ where: {} });
    await JournalReviewer.destroy({ where: {} });

    await JournalReviewer.create({ journalId: journal.id, userId: reviewer1.id, expertise: [], assignedAt: new Date(), isActive: true });
    await JournalReviewer.create({ journalId: journal.id, userId: reviewer2.id, expertise: [], assignedAt: new Date(), isActive: true });
    
    paper = await createPaper({ name: 'Artigo Teste', url: 'http://example.com', journalId: journal.id, issueId: issue.id, status: 'submitted' });
    await paper.setResearchers([author]);
  });

  afterAll(async () => {
    await sequelize.drop();
    await sequelize.close();
  });

  describe('Solicitação de revisão com revisores disponíveis', () => {
    it('Caso 1: Autor solicita a revisão com dados válidos', async () => {
      const review = await reviewService.requestReview(paper.id, author.id);
      expect(review).toBeInstanceOf(Review);
      expect(review.status).toBe('pending');
      const updatedPaper = await Paper.findByPk(paper.id);
      expect(updatedPaper!.status).toBe('under_review');
    });
    it('Caso 2: Autor solicita a revisão informando um artigo com ID inexistente', async () => {
      await expect(reviewService.requestReview(9999, author.id)).rejects.toThrow('Paper not found');
    });
    it('Caso 3: Autor solicita a revisão informando dados válidos mas a revista tem menos que dois revisores associados', async () => {

      await JournalReviewer.destroy({ where: { journalId: journal.id } });
      await JournalReviewer.create({ journalId: journal.id, userId: reviewer1.id, expertise: [], assignedAt: new Date(), isActive: true });
      await expect(reviewService.requestReview(paper.id, author.id)).rejects.toThrow('Not enough reviewers available');
    });
    it('Caso 4: Autor solicita a revisão com um artigo que já está sendo revisado ou já teve a revisão concluída', async () => {

      await paper.update({ status: 'under_review' });
      await expect(reviewService.requestReview(paper.id, author.id)).rejects.toThrow('Paper must be in submitted status to request review');
    });
  });

  describe('Submissão de resultado de revisão', () => {
    let review: Review;
    beforeEach(async () => {

      review = await reviewService.requestReview(paper.id, author.id);
    });
    it('Caso 1: Revisor submete revisão de artigo com dados válidos', async () => {
      const result = await reviewService.submitReviewResult(review.id, review.firstReviewerId, {
        recommendation: 'approve',
        comments: 'Ótimo artigo',
        overallScore: 5
      });
      expect(result).toBeInstanceOf(ReviewResult);
      expect(result.recommendation).toBe('approve');
      expect(result.isSubmitted).toBe(true);
    });
    it('Caso 2: Revisor submete revisão para solicitação de revisão inexistente', async () => {
      await expect(reviewService.submitReviewResult(9999, reviewer1.id, {
        recommendation: 'approve',
        comments: 'Ótimo artigo',
        overallScore: 5
      })).rejects.toThrow('Review not found');
    });
    it('Caso 3: Revisor submete revisão para solicitação de revisão que não está atribuída a ele', async () => {
      await expect(reviewService.submitReviewResult(review.id, reviewer3.id, {
        recommendation: 'approve',
        comments: 'Ótimo artigo',
        overallScore: 5
      })).rejects.toThrow('User is not assigned as a reviewer for this review');
    });
    it('Caso 4: Revisor submete revisão com campo “recommendation” que não é válido', async () => {
      await expect(reviewService.submitReviewResult(review.id, review.firstReviewerId, {
        recommendation: 'invalid_recommendation',
        comments: 'Ótimo artigo',
        overallScore: 5
      })).rejects.toThrow();
    });
    it('Caso 5: Revisor submete revisão com campo “overallScore” com nota que não está no range de 1 a 5.', async () => {
      await expect(reviewService.submitReviewResult(review.id, review.firstReviewerId, {
        recommendation: 'approve',
        comments: 'Ótimo artigo',
        overallScore: 10
      })).rejects.toThrow();
    });
  });

  describe('Conclusão da revisão quando ambos submetem', () => {
    let review: Review;
    beforeEach(async () => {
      review = await reviewService.requestReview(paper.id, author.id);
    });
    it('Caso 1: Dois revisores dão parecer positivo para o artigo', async () => {
      await reviewService.submitReviewResult(review.id, review.firstReviewerId, {
        recommendation: 'approve',
        comments: 'Ótimo artigo',
        overallScore: 5
      });
      await reviewService.submitReviewResult(review.id, review.secondReviewerId, {
        recommendation: 'approve',
        comments: 'Muito bom',
        overallScore: 5
      });
      const updatedPaper = await Paper.findByPk(paper.id);
      expect(updatedPaper!.status).toBe('approved');
    });
    it('Caso 2: Dois revisores dão parecer negativo para o artigo', async () => {
      await reviewService.submitReviewResult(review.id, review.firstReviewerId, {
        recommendation: 'reject',
        comments: 'Ruim',
        overallScore: 1
      });
      await reviewService.submitReviewResult(review.id, review.secondReviewerId, {
        recommendation: 'reject',
        comments: 'Péssimo',
        overallScore: 1
      });
      const updatedPaper = await Paper.findByPk(paper.id);
      expect(updatedPaper!.status).toBe('rejected');
    });
    it('Caso 3: Um revisor dá parecer positivo e um revisor dá parecer negativo', async () => {
      await reviewService.submitReviewResult(review.id, review.firstReviewerId, {
        recommendation: 'approve',
        comments: 'Bom',
        overallScore: 4
      });
      await reviewService.submitReviewResult(review.id, review.secondReviewerId, {
        recommendation: 'reject',
        comments: 'Ruim',
        overallScore: 1
      });
      const updatedPaper = await Paper.findByPk(paper.id);
      expect(updatedPaper!.status).toBe('submitted');
    });
  });
});

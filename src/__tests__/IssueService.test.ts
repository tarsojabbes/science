import { Sequelize, DataType } from 'sequelize-typescript';
import { User } from '../models/User';
import { Paper } from '../models/Paper';
import { Journal } from '../models/Journal';
import { Issue } from '../models/Issue';
import { IssueService } from '../services/issueService';

describe('IssueService (teste de integração)', () => {
  let sequelize: Sequelize;
  let issueService: IssueService;
  let editor: User;
  let journal: Journal;
  let issue: Issue;
  let approvedPaper: Paper;
  let notApprovedPaper: Paper;
  let otherJournal: Journal;
  let paperFromOtherJournal: Paper;

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
      publishedDate: { type: DataType.DATE, allowNull: true },
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

    Paper.belongsTo(Journal, { foreignKey: 'journalId', as: 'journal' });

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

    await sequelize.sync({ force: true });

    issueService = new IssueService();

    editor = await User.create({
      name: 'Editor',
      email: 'editor@example.com',
      password: 'plainPassword',
      institution: 'Test University',
      orcid: '0000-0000-0000-0009',
      roles: ['EDITOR']
    });

    journal = await Journal.create({ name: 'Journal Test', issn: '1234-5678' });

    otherJournal = await Journal.create({ name: 'Other Journal', issn: '9999-8888' });

    approvedPaper = await Paper.create({
      name: 'Artigo Aprovado',
      url: 'http://example.com/a',
      journalId: journal.id,
      status: 'approved'
    });

    notApprovedPaper = await Paper.create({
      name: 'Artigo Não Aprovado',
      url: 'http://example.com/b',
      journalId: journal.id,
      status: 'submitted'
    });

    paperFromOtherJournal = await Paper.create({
      name: 'Artigo Outra Revista',
      url: 'http://example.com/c',
      journalId: otherJournal.id,
      status: 'approved'
    });
    
    issue = await Issue.create({
      number: 1,
      volume: 1,
      publishedDate: new Date(),
      journalId: journal.id
    });
  });

  beforeEach(async () => {
    await Issue.destroy({ where: {} });
    await Paper.update({ issueId: null }, { where: {} });
  });

  afterAll(async () => {
    await sequelize.drop();
    await sequelize.close();
  });

  describe('Criação de edições da revista', () => {
    it('Caso 1: Editor cria uma edição de revista válida', async () => {
      const data = {
        number: 2,
        volume: 1,
        journalId: journal.id,
        paperIds: [approvedPaper.id]
      };
      const result = await issueService.createIssue(data);
      expect(result).toBeInstanceOf(Issue);
      expect(result?.journalId).toBe(journal.id);
    });

    it('Caso 2: Editor cria uma edição de revista com artigos que ainda não foram aprovados', async () => {
      const data = {
        number: 3,
        volume: 1,
        journalId: journal.id,
        paperIds: [notApprovedPaper.id]
      };
      await expect(issueService.createIssue(data)).rejects.toThrow('Paper must be approved to be included in an issue');
    });

    it('Caso 3: Editor cria uma edição de revista com artigos que foram submetidos em outra revista', async () => {
      const data = {
        number: 4,
        volume: 1,
        journalId: journal.id,
        paperIds: [paperFromOtherJournal.id]
      };
      await expect(issueService.createIssue(data)).rejects.toThrow('Paper can only be published in the journal to which it was submitted');
    });

    it('Caso 4: Editor cria uma edição de revista com artigos inexistente', async () => {
      const data = {
        number: 5,
        volume: 1,
        journalId: journal.id,
        paperIds: [9999]
      };
      await expect(issueService.createIssue(data)).rejects.toThrow('Cannot associate non-existent paper to issue');
    });
  });

  describe('Atualização de edições de revista', () => {
    let createdIssue: Issue;
    beforeEach(async () => {
      const issue = await issueService.createIssue({
        number: 10,
        volume: 2,
        journalId: journal.id,
        paperIds: [approvedPaper.id]
      });
      if (!issue) throw new Error('Falha ao criar edição');
      createdIssue = issue;
    });

    it('Caso 1: Editor atualiza uma edição de revista com dados válidos', async () => {
      const data = {
        number: 11,
        volume: 2,
        journalId: journal.id,
        paperIds: [approvedPaper.id]
      };
      const result = await issueService.updateIssue(createdIssue.id, data);
      expect(result).toBeInstanceOf(Issue);
      expect(result?.number).toBe(11);
    });

    it('Caso 2: Editor atualiza uma edição de revista com artigos que não foram aprovados', async () => {
      const data = {
        number: 12,
        volume: 2,
        journalId: journal.id,
        paperIds: [notApprovedPaper.id]
      };
      await expect(issueService.updateIssue(createdIssue.id, data)).rejects.toThrow('Paper must be approved to be included in an issue');
    });

    it('Caso 3: Editor atualiza uma edição de revista com artigos que foram submetidos em outra revista', async () => {
      const data = {
        number: 13,
        volume: 2,
        journalId: journal.id,
        paperIds: [paperFromOtherJournal.id]
      };
      await expect(issueService.updateIssue(createdIssue.id, data)).rejects.toThrow('Paper can only be published in the journal to which it was submitted');
    });

    it('Caso 4: Editor atualiza uma edição de revista com artigos inexistentes', async () => {
      const data = {
        number: 14,
        volume: 2,
        journalId: journal.id,
        paperIds: [9999]
      };
      await expect(issueService.updateIssue(createdIssue.id, data)).rejects.toThrow('Cannot associate non-existent paper to issue');
    });
  });

  describe('Remoção de edições de revista', () => {
    let createdIssue: Issue;
    beforeEach(async () => {
      const issue = await issueService.createIssue({
        number: 20,
        volume: 3,
        journalId: journal.id,
        paperIds: [approvedPaper.id]
      });
      if (!issue) throw new Error('Falha ao criar edição');
      createdIssue = issue;
    });

    it('Caso 1: Editor exclui edição da revista com dados válidos', async () => {
      const result = await issueService.deleteIssue(createdIssue.id);
      expect(result).toBe(true);
      const found = await Issue.findByPk(createdIssue.id);
      expect(found).toBeNull();
    });
    
    it('Caso 2: Editor exclui edição de revista com ID inexistente', async () => {
      await expect(issueService.deleteIssue(9999)).rejects.toThrow('Issue does not exist');
    });
  });
});

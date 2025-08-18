import { Sequelize, DataType } from 'sequelize-typescript';
import { Paper } from '../models/Paper';
import { User } from '../models/User';
import { Journal } from '../models/Journal';
import { Issue } from '../models/Issue';
import { PaperService } from '../services/paperService';
import { UserRepository } from '../repository/userRepository';
import { PaperRepository } from '../repository/paperRepository';

describe('PaperService (teste de integração)', () => {
  let sequelize: Sequelize;
  let paperService: PaperService;
  let userRepository: UserRepository;
  let paperRepository: PaperRepository;
  let journal: Journal;
  let issue: Issue;
  let author: User;
  let author2: User;

  const validJournalData = { name: 'Journal Test', issn: '1234-5678' };
  const validIssueData = { number: 1, volume: 1, publishedDate: new Date(), journalId: 1 };
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
    roles: ['AUTHOR']
  };
  const validPaperData = {
    name: 'Artigo Teste',
    url: 'http://example.com',
    journalId: 1,
    issueId: 1,
    researcherIds: [1]
  };

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

    await sequelize.sync({ force: true });

    userRepository = new UserRepository();
    paperRepository = new PaperRepository();
    paperService = new PaperService();
    journal = await Journal.create(validJournalData);
    issue = await Issue.create({ ...validIssueData, journalId: journal.id });
    author = await User.create(validUserData);
    author2 = await User.create(validUserData2);
  });

  beforeEach(async () => {
    await Paper.destroy({ where: {} });
  });

  afterAll(async () => {
    await sequelize.drop();
    await sequelize.close();
  });

  describe('Submissão de artigo com pesquisadores', () => {
    it('Caso 1: Submissão de artigo com dados válidos', async () => {
      const result = await paperService.createPaper({ ...validPaperData, researcherIds: [author.id], journalId: journal.id, issueId: issue.id });
      expect(result).toBeInstanceOf(Paper);
      expect(result!.name).toBe(validPaperData.name);
    });
    it('Caso 2: Submissão de artigo com dados inválidos', async () => {
      await expect(paperService.createPaper({ name: '', journalId: journal.id, issueId: issue.id, researcherIds: [author.id] })).rejects.toThrow();
    });
    it('Caso 3: Submissão de artigo sem IDs do(s) autor(es)', async () => {
      await expect(paperService.createPaper({ ...validPaperData, researcherIds: [], journalId: journal.id, issueId: issue.id })).rejects.toThrow();
    });
  });

  describe('Validação de status e datas', () => {
    it('Caso 1: Atribuição da data atual como “submissionDate” no artigo', async () => {
      const before = new Date();
      const result = await paperService.createPaper({ ...validPaperData, researcherIds: [author.id], journalId: journal.id, issueId: issue.id });
      expect(result!.submissionDate).toBeDefined();
    });
    it('Caso 2: Atribuição do status “submitted” quando artigo é submetido', async () => {
      const result = await paperService.createPaper({ ...validPaperData, researcherIds: [author.id], journalId: journal.id, issueId: issue.id });
      expect(result!.status).toBe('submitted');
    });
    it('Caso 3: Atribuição do status “under_review” quando um autor solicita a revisão do artigo', async () => {
      const paper = await paperService.createPaper({ ...validPaperData, researcherIds: [author.id], journalId: journal.id, issueId: issue.id });
      const updated = await paperService.updatePaper(paper!.id, {status: 'under_review', researcherIds: [author.id] });
      expect(updated!.status).toBe('under_review');
    });
  });

  describe('Atualização de artigo', () => {
    let paper: Paper | null;
    beforeEach(async () => {
      paper = await paperService.createPaper({ ...validPaperData, researcherIds: [author.id], journalId: journal.id, issueId: issue.id });
    });

    it('Caso 1: Autor atualiza artigo com dados válidos', async () => {
      if (!paper) throw new Error('Paper not created');
      const updated = await paperService.updatePaper(paper.id, { name: 'Novo Nome', researcherIds: [author.id] });
      expect(updated!.name).toBe('Novo Nome');
    });

    it('Caso 2: Autor atualiza artigo com dados inválidos', async () => {
      if (!paper) throw new Error('Paper not created');
      await expect(paperService.updatePaper(paper.id, { name: '', researcherIds: [author.id] })).rejects.toThrow();
    });

    it('Caso 3: Autor atualiza artigo removendo todos os pesquisadores', async () => {
      if (!paper) throw new Error('Paper not created');
      await expect(paperService.updatePaper(paper.id, { researcherIds: [] })).rejects.toThrow();
    });

    it('Caso 4: Autor atualiza o artigo adicionando pesquisadores inexistentes', async () => {
        if (!paper) throw new Error('Paper not created');
        await expect(
          paperService.updatePaper(paper.id, { researcherIds: [9999] })
        ).rejects.toThrow();
      });

    it('Caso 5: Autor atualiza artigo informando ID inexistente', async () => {
      const result = await paperService.updatePaper(9999, { name: 'Qualquer', researcherIds: [author.id] });
      expect(result).toBeNull();
    });
  });

  describe('Remoção de artigo', () => {
    let paper: Paper | null;
    beforeEach(async () => {
      paper = await paperService.createPaper({ ...validPaperData, researcherIds: [author.id], journalId: journal.id, issueId: issue.id });
    });

    it('Caso 1: Autor exclui artigo com ID existente', async () => {
      if (!paper) throw new Error('Paper not created');
      const deleted = await paperService.deletePaper(paper.id);
      expect(deleted).toBeInstanceOf(Paper);
      const found = await Paper.findByPk(paper.id);
      expect(found).toBeNull();
    });

    it('Caso 2: Autor exclui artigo com ID inexistente', async () => {
      const result = await paperService.deletePaper(9999);
      expect(result).toBeNull();
    });
  });
});

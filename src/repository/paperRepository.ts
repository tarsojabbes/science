import { Op } from "sequelize";
import { Paper } from "../models/Paper";
import { User } from "../models/User";
import { PaginationOptions, PaginationResult, PaperFilters } from "../types/pagination.types";

export class PaperRepository {
  async createPaper(data: {
    name: string;
    publishedDate?: Date;
    submissionDate?: Date;
    url?: string;
    researcherIds?: number[];
  }) {
    const { researcherIds, ...paperData } = data;
    
    const paper = await Paper.create(paperData);
    
    if (researcherIds && researcherIds.length > 0) {
      const researchers = await User.findAll({
        where: { id: researcherIds }
      });
      await paper.setResearchers(researchers);
    }
    
    return await Paper.findByPk(paper.id, {
      include: [{
        model: User,
        as: 'researchers',
        attributes: ['id', 'name', 'email', 'institution', 'orcid'],
        through: { attributes: [] }
      }]
    });
  }

  async updatePaper(id: number, data: {
    name?: string;
    publishedDate?: Date;
    submissionDate?: Date;
    url?: string;
    researcherIds?: number[];
    status?: string;
  }): Promise<Paper | null> {
    const { researcherIds, ...paperData } = data;
    
    const [rowsUpdated] = await Paper.update(paperData, {
      where: { id }
    });

    if (rowsUpdated === 0) return null;

    const paper = await Paper.findByPk(id);
    if (!paper) return null;

    if (researcherIds !== undefined) {
      if (researcherIds.length > 0) {
        const researchers = await User.findAll({
          where: { id: researcherIds }
        });
        await paper.setResearchers(researchers);
      } else {
        await paper.setResearchers([]);
      }
    }

    return await Paper.findByPk(id, {
      include: [{
        model: User,
        as: 'researchers',
        attributes: ['id', 'name', 'email', 'institution', 'orcid'],
        through: { attributes: [] }
      }]
    });
  }

  async getAllPapers() {
    return await Paper.findAll({
      include: [{
        model: User,
        as: 'researchers',
        attributes: ['id', 'name', 'email', 'institution', 'orcid'],
        through: { attributes: [] }
      }]
    });
  }

  async findById(id: number) {
    return await Paper.findByPk(id, {
      include: [{
        model: User,
        as: 'researchers',
        attributes: ['id', 'name', 'email', 'institution', 'orcid'],
        through: { attributes: [] }
      }]
    });
  }

  async deletePaper(id: number) {
    const paper = await Paper.findByPk(id, {
      include: [{
        model: User,
        as: 'researchers',
        attributes: ['id', 'name', 'email', 'institution', 'orcid'],
        through: { attributes: [] }
      }]
    });
    
    if (!paper) return null;
    
    await paper.setResearchers([]);
    await paper.destroy();
    
    return paper;
  }

  async addResearcher(paperId: number, userId: number) {
    const paper = await Paper.findByPk(paperId);
    const user = await User.findByPk(userId);
    
    if (!paper || !user) return null;
    
    await paper.addResearcher(user);
    
    return await Paper.findByPk(paperId, {
      include: [{
        model: User,
        as: 'researchers',
        attributes: ['id', 'name', 'email', 'institution', 'orcid'],
        through: { attributes: [] }
      }]
    });
  }

  async removeResearcher(paperId: number, userId: number) {
    const paper = await Paper.findByPk(paperId);
    const user = await User.findByPk(userId);
    
    if (!paper || !user) return null;
    
    await paper.removeResearcher(user);
    
    return await Paper.findByPk(paperId, {
      include: [{
        model: User,
        as: 'researchers',
        attributes: ['id', 'name', 'email', 'institution', 'orcid'],
        through: { attributes: [] }
      }]
    });
  }

  async getPapersByResearcher(userId: number) {
    return await Paper.findAll({
      include: [{
        model: User,
        as: 'researchers',
        where: { id: userId },
        attributes: ['id', 'name', 'email', 'institution', 'orcid'],
        through: { attributes: [] }
      }]
    });
  }

  async getAllPapersWithPagination(
    options: PaginationOptions,
    filters: PaperFilters = {}
  ): Promise<PaginationResult<Paper>> {
    const whereClause: any = {};

    if (filters.name) {
      whereClause.name = {
        [Op.iLike]: `%${filters.name}%`
      };
    }

    if (filters.journalId) {
      whereClause.journalId = filters.journalId;
    }

    if (filters.issueId) {
      whereClause.issueId = filters.issueId;
    }

    if (filters.publishedAfter || filters.publishedBefore) {
      whereClause.publishedDate = {};
      
      if (filters.publishedAfter) {
        whereClause.publishedDate[Op.gte] = filters.publishedAfter;
      }
      
      if (filters.publishedBefore) {
        whereClause.publishedDate[Op.lte] = filters.publishedBefore;
      }
    }

    return await Paper.findAndCountAll({
      where: whereClause,
      limit: options.limit,
      offset: options.offset,
      order: options.order || [['id', 'DESC']],
      include: [
        {
          model: User,
          as: 'researchers',
          attributes: ['id', 'name', 'email', 'institution', 'orcid'],
          through: { attributes: [] }
        }
      ],
      distinct: true
    });
  }

  async getPapersByResearcherWithPagination(
    userId: number, 
    options: PaginationOptions
  ): Promise<PaginationResult<Paper>> {
    return await Paper.findAndCountAll({
      limit: options.limit,
      offset: options.offset,
      order: options.order || [['id', 'DESC']],
      include: [
        {
          model: User,
          as: 'researchers',
          where: { id: userId },
          attributes: ['id', 'name', 'email', 'institution', 'orcid'],
          through: { attributes: [] }
        }
      ],
      distinct: true
    });
  }

  async getPapersByJournalWithPagination(
    journalId: number,
    options: PaginationOptions
  ): Promise<PaginationResult<Paper>> {
    const filters: PaperFilters = { journalId };
    return this.getAllPapersWithPagination(options, filters);
  }
}
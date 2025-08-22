import { Paper } from "../models/Paper";
import { PaperRepository } from "../repository/paperRepository";
import { UserService } from "./userService";
import {User} from "../models/User"
import { UserRepository } from "../repository/userRepository";
import { PaginationOptions, PaginationResponse, PaperFilters } from "../types/pagination.types";

const userRepository = new UserRepository()
const userService = new UserService(userRepository);

export class PaperService {
  private repo = new PaperRepository();

  async createPaper(data: {
    name: string;
    publishedDate?: Date;
    submissionDate?: Date;
    url?: string;
    researcherIds?: number[];
    journalId?: number;
    issueId?: number;
  }) {
    if (!data.name) {
      throw new Error('Name is required');
    }
    if (!data.journalId) {
      throw new Error('Journal ID is required');
    }
    if (!data.researcherIds) {
      throw new Error('Researcher IDs are required');
    }
    if (!data.researcherIds.length) {
      throw new Error('At least one researcher is required');
    }
    return await this.repo.createPaper(data);
  }

  async updatePaper(id: number, data: {
    name?: string;
    publishedDate?: Date;
    submissionDate?: Date;
    url?: string;
    researcherIds?: number[];
    status?: string;
    journalId?: number;
    issueId?: number;
  }) {
    if (data.name !== undefined && data.name.trim() === '') {
      throw new Error('Name is required');
    }

    if (data.researcherIds !== undefined && (!Array.isArray(data.researcherIds) || data.researcherIds.length === 0)) {
      throw new Error('At least one researcher is required');
    }
    return await this.repo.updatePaper(id, data);
  }

  async getAllPapers() {
    return await this.repo.getAllPapers();
  }

  async getPaperById(id: number) {
    return await this.repo.findById(id);
  }

  async deletePaper(id: number) {
    return await this.repo.deletePaper(id);
  }

  async addResearcher(paperId: number, userId: number) {
    return await this.repo.addResearcher(paperId, userId);
  }

  async removeResearcher(paperId: number, userId: number) {
    return await this.repo.removeResearcher(paperId, userId);
  }

  async getPapersByResearcher(userId: number) {
    return await this.repo.getPapersByResearcher(userId);
  }

  async getAllPapersWithPagination(
    options: PaginationOptions,
    filters: PaperFilters = {}
  ): Promise<PaginationResponse<Paper>> {
    const result = await this.repo.getAllPapersWithPagination(options, filters);
    
    const totalPages = Math.ceil(result.count / options.limit);
    
    return {
      success: true,
      data: result.rows,
      pagination: {
        currentPage: options.page,
        totalPages,
        totalItems: result.count,
        hasNextPage: options.page < totalPages,
        hasPrevPage: options.page > 1,
        limit: options.limit,
        prevPage: options.page > 1 ? options.page - 1 : null,
        nextPage: options.page < totalPages ? options.page + 1 : null
      }
    };
  }

  async getPapersByResearcherWithPagination(
    userId: number,
    options: PaginationOptions
  ): Promise<PaginationResponse<Paper>> {
    const result = await this.repo.getPapersByResearcherWithPagination(userId, options);
    
    const totalPages = Math.ceil(result.count / options.limit);
    
    return {
      success: true,
      data: result.rows,
      pagination: {
        currentPage: options.page,
        totalPages,
        totalItems: result.count,
        hasNextPage: options.page < totalPages,
        hasPrevPage: options.page > 1,
        limit: options.limit,
        prevPage: options.page > 1 ? options.page - 1 : null,
        nextPage: options.page < totalPages ? options.page + 1 : null
      }
    };
  }

  async getPapersByJournalWithPagination(
    journalId: number,
    options: PaginationOptions
  ): Promise<PaginationResponse<Paper>> {
    const result = await this.repo.getPapersByJournalWithPagination(journalId, options);
    
    const totalPages = Math.ceil(result.count / options.limit);
    
    return {
      success: true,
      data: result.rows,
      pagination: {
        currentPage: options.page,
        totalPages,
        totalItems: result.count,
        hasNextPage: options.page < totalPages,
        hasPrevPage: options.page > 1,
        limit: options.limit,
        prevPage: options.page > 1 ? options.page - 1 : null,
        nextPage: options.page < totalPages ? options.page + 1 : null
      }
    };
  }

}
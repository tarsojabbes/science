import { Issue } from '../models/Issue';
import { IssueRepository } from '../repository/issueRepository';
import { PaperRepository } from '../repository/paperRepository';
import { IssueFilters, PaginationOptions, PaginationResponse } from '../types/pagination.types';

export class IssueService {
  private repo = new IssueRepository();
  private paperRepo = new PaperRepository();

  async createIssue(data: {
    number: number;
    volume: number;
    journalId: number;
    paperIds: number[];
  }) {
    // Validate that all papers are approved
    if (data.paperIds && data.paperIds.length > 0) {
      for (const paperId of data.paperIds) {
        const paper = await this.paperRepo.findById(paperId);
        if (!paper) {
          throw new Error(`Paper with ID ${paperId} not found`);
        }
        if (paper.status !== 'approved') {
          throw new Error(`Paper with ID ${paperId} is not approved (status: ${paper.status})`);
        }
        if (paper.journalId !== data.journalId) {
          throw new Error(`Paper with ID ${paperId} does not belong to journal ${data.journalId}`);
        }
      }
    }

    return await this.repo.createIssue(data);
  }

  async getAllIssues() {
    return await this.repo.getAllIssues();
  }

  async getIssueById(id: number) {
    return await this.repo.getIssueById(id);
  }

  async updateIssue(id: number, data: {
    number: number;
    volume: number;
    journalId: number;
    paperIds: number[];
  }) {
    // Validate that all papers are approved
    if (data.paperIds && data.paperIds.length > 0) {
      for (const paperId of data.paperIds) {
        const paper = await this.paperRepo.findById(paperId);
        if (!paper) {
          throw new Error(`Paper with ID ${paperId} not found`);
        }
        if (paper.status !== 'approved') {
          throw new Error(`Paper with ID ${paperId} is not approved (status: ${paper.status})`);
        }
        if (paper.journalId !== data.journalId) {
          throw new Error(`Paper with ID ${paperId} does not belong to journal ${data.journalId}`);
        }
      }
    }

    return await this.repo.updateIssue(id, data);
  }

  async deleteIssue(id: number) {
    return await this.repo.deleteIssue(id);
  }

  async getAllIssuesWithPaginationAndFilter(
    options: PaginationOptions,
    filters: IssueFilters = {}
  ): Promise<PaginationResponse<Issue>> {
    const result = await this.repo.getAllIssuesWithPaginationAndFilter(options, filters);
    
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

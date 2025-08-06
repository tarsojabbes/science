import { Issue } from '../models/Issue';
import { IssueRepository } from '../repository/issueRepository';
import { IssueFilters, PaginationOptions, PaginationResponse } from '../types/pagination.types';

export class IssueService {
  private repo = new IssueRepository();

  async createIssue(data: {
    number: number;
    volume: number;
    journalId: number;
    paperIds: number[];
  }) {
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

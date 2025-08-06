import { Journal } from '../models/Journal';
import { JournalRepository } from '../repository/journalRepository';
import { JournalFilters, PaginationOptions, PaginationResponse } from '../types/pagination.types';

export class JournalService {
  constructor(private repo = new JournalRepository()) {}

  async createJournal(data: { name: string; issn: string }) {
    return await this.repo.createJournal(data);
  }

  async getAllJournals() {
    return await this.repo.getAllJournals();
  }

  async getJournalById(id: number) {
    return await this.repo.getJournalById(id);
  }

  async updateJournal(id: number, data: { name?: string; issn?: string }) {
    return await this.repo.updateJournal(id, data);
  }

  async deleteJournal(id: number) {
    return await this.repo.deleteJournal(id);
  }

  async getAllJournalsWithPaginationAndFilter(
    options: PaginationOptions,
    filters: JournalFilters = {}
  ): Promise<PaginationResponse<Journal>> {
    const result = await this.repo.getAllJournalsWithPaginationAndFilters(options, filters);

    const totalPages = Math.ceil(result.count/options.limit);

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

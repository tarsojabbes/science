import { JournalRepository } from '../repository/journalRepository';

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
}

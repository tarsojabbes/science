import { Journal } from '../models/Journal';
import { Issue } from '../models/Issue';

export class JournalRepository {
  async createJournal(data: { name: string; issn: string }) {
    return await Journal.create(data);
  }

  async getAllJournals() {
    return await Journal.findAll({
      include: [{ model: Issue, as: 'issues' }]
    });
  }

  async getJournalById(id: number) {
    return await Journal.findByPk(id, {
      include: [{ model: Issue, as: 'issues' }]
    });
  }

  async updateJournal(id: number, data: { name?: string; issn?: string }) {
    const journal = await Journal.findByPk(id);
    if (!journal) return null;
    return await journal.update(data);
  }

  async deleteJournal(id: number) {
    const journal = await Journal.findByPk(id);
    if (!journal) return null;
    await journal.destroy();
    return journal;
  }
}

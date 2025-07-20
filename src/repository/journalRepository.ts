import { Journal } from '../models/Journal';
import { Issue } from '../models/Issue';
import { Paper } from '../models/Paper';
import { User } from '../models/User';

export class JournalRepository {
  async createJournal(data: {
    name: string;
    issn: string;
  }) {
    const journal = await Journal.create(data);
    
    return await Journal.findByPk(journal.id, {
      include: [
        {
          model: Issue,
          as: 'issues',
          include: [
            {
              model: Paper,
              as: 'papers',
              include: [
                {
                  model: User,
                  as: 'researchers',
                  through: { attributes: [] }
                }
              ]
            }
          ]
        }
      ]
    });
  }

  async getAllJournals() {
    return await Journal.findAll({
      include: [
        {
          model: Issue,
          as: 'issues',
          include: [
            {
              model: Paper,
              as: 'papers',
              include: [
                {
                  model: User,
                  as: 'researchers',
                  through: { attributes: [] }
                }
              ]
            }
          ]
        }
      ]
    });
  }

  async getJournalById(id: number) {
    return await Journal.findByPk(id, {
      include: [
        {
          model: Issue,
          as: 'issues',
          include: [
            {
              model: Paper,
              as: 'papers',
              include: [
                {
                  model: User,
                  as: 'researchers',
                  through: { attributes: [] }
                }
              ]
            }
          ]
        }
      ]
    });
  }

  async updateJournal(id: number, data: Partial<Journal>) {
    const journal = await Journal.findByPk(id);
    if (!journal) return null;
    
    await journal.update(data);
    
    return await Journal.findByPk(id, {
      include: [
        {
          model: Issue,
          as: 'issues',
          include: [
            {
              model: Paper,
              as: 'papers',
              include: [
                {
                  model: User,
                  as: 'researchers',
                  through: { attributes: [] }
                }
              ]
            }
          ]
        }
      ]
    });
  }

  async deleteJournal(id: number) {
    const journal = await Journal.findByPk(id);
    if (!journal) return null;
    await journal.destroy();
    return journal;
  }
}
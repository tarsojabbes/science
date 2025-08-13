import { Journal } from '../models/Journal';
import { Issue } from '../models/Issue';
import { Paper } from '../models/Paper';
import { User } from '../models/User';
import { JournalFilters, PaginationOptions, PaginationResult } from '../types/pagination.types';
import { Op, where } from 'sequelize';

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
        },
        {
          model: User,
          as: 'editors',
          through: { attributes: [] }
        },
        {
          model: User,
          as: 'reviewers',
          through: { attributes: [] }
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

  async getAllJournalsWithPaginationAndFilters(
    options: PaginationOptions,
    filters: JournalFilters = {}
  ): Promise<PaginationResult<Journal>> {
    const whereClause: any = {};

    if (filters.name) {
      whereClause.name = {
        [Op.iLike]: `%${filters.name}%`
      };
    }

    if (filters.issn) {
      whereClause.issn = filters.issn;
    }

    return await Journal.findAndCountAll({
      where: whereClause,
      limit: options.limit,
      offset: options.offset,
      order: options.order || [["id", "DESC"]],
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
        },
        {
          model: User,
          as: 'editors',
          through: { attributes: [] }
        },
        {
          model: User,
          as: 'reviewers',
          through: { attributes: [] }
        }
      ],
      distinct: true
    });
  }
}
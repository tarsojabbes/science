import { Issue } from '../models/Issue';
import { Paper } from '../models/Paper';
import { User } from '../models/User';
import { IssueFilters, PaginationOptions, PaginationResult } from '../types/pagination.types';

export class IssueRepository {
  async createIssue(data: {
    number: number;
    volume: number;
    journalId: number;
    paperIds: number[];
  }) {
    const issue = await Issue.create({
      number: data.number,
      volume: data.volume,
      publishedDate: Date.now(),
      journalId: data.journalId,
      paperIds: data.paperIds
    });

    if (data.paperIds && data.paperIds.length > 0) {
      const papers = await Paper.findAll({
        where: { id: data.paperIds },
        attributes: ['id', 'journalId']
      });

      const invalidPapers = papers.filter(paper => paper.journalId !== data.journalId);
      if (invalidPapers.length > 0) {
        const invalidPaperIds = invalidPapers.map(p => p.id);
        throw new Error(`Papers with IDs ${invalidPaperIds.join(', ')} do not belong to journal ${data.journalId}`);
      }
    }

    if (data.paperIds && data.paperIds.length > 0) {

      await Paper.update(
        { publishedDate: new Date() },
        { where: { id: data.paperIds } }
      );

      const papers: Paper[] = await Paper.findAll({ 
        where: { id: data.paperIds } 
      });
      
      await issue.setPapers(papers);
    }

    return await Issue.findByPk(issue.id, {
      include: [{ 
        model: Paper, 
        as: 'papers',
        include: [{ 
          model: User, 
          as: 'researchers',
          through: { attributes: [] }
        }]
      }]
    });
  }

  async getAllIssues() {
    return await Issue.findAll({
      include: [{ 
        model: Paper, 
        as: 'papers',
        include: [{ 
          model: User, 
          as: 'researchers',
          through: { attributes: [] }
        }]
      }]
    });
  }

  async getIssueById(id: number) {
    return await Issue.findByPk(id, {
      include: [{ 
        model: Paper, 
        as: 'papers',
        include: [{ 
          model: User, 
          as: 'researchers',
          through: { attributes: [] }
        }]
      }]
    });
  }

    async updateIssue(id: number, data: Partial<Issue> & { paperIds?: number[] }) {
    const issue = await Issue.findByPk(id);
    if (!issue) return null;
    
    const updatedIssue = await issue.update({
      number: data.number,
      volume: data.volume,
      publishedDate: data.publishedDate,
      journalId: data.journalId,
      paperIds: data.paperIds
    });

    if (data.paperIds !== undefined) {
      if (data.paperIds.length > 0) {
        await Paper.update(
          { issueId: null },
          { where: { issueId: id } }
        );
        
        await Paper.update(
          { issueId: id },
          { where: { id: data.paperIds } }
        );
      } else {
        await Paper.update(
          { issueId: null },
          { where: { issueId: id } }
        );
      }
    }

    return await Issue.findByPk(id, {
      include: [{ 
        model: Paper, 
        as: 'papers',
        include: [{ 
          model: User, 
          as: 'researchers',
          through: { attributes: [] }
        }]
      }]
    });
  }

  async deleteIssue(id: number) {
    const issue = await Issue.findByPk(id);
    if (!issue) return null;
    
    await Paper.update(
      { issueId: null },
      { where: { issueId: id } }
    );
    
    await issue.destroy();
    return issue;
  }

  async getAllIssuesWithPaginationAndFilter(
    options: PaginationOptions,
    filters: IssueFilters = {}
  ): Promise<PaginationResult<Issue>> {
    const whereClause: any = {};

    if (filters.journalId) {
      whereClause.journalId = filters.journalId;
    }

    if (filters.number) {
      whereClause.number = filters.number;
    }

    if (filters.publishedDate) {
      whereClause.publishedDate = filters.publishedDate;
    }

    if (filters.volume) {
      whereClause.volume = filters.volume;
    }

    return await Issue.findAndCountAll({
      where: whereClause,
      limit: options.limit,
      offset: options.offset,
      order: options.order || [['id', 'DESC']],
      include: [{ 
        model: Paper, 
        as: 'papers',
        include: [{ 
          model: User, 
          as: 'researchers',
          through: { attributes: [] }
        }]
      }],
      distinct: true
    })
  }
}
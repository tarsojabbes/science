import { Issue } from '../models/Issue';
import { Paper } from '../models/Paper';
import { User } from '../models/User';

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
      const papers = await Paper.findAll({ where: { id: data.paperIds } });
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
}
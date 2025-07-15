import { Issue } from '../models/Issue';
import { Paper } from '../models/Paper';

export class IssueRepository {
  async createIssue(data: {
    number: number;
    volume: number;
    publishedDate: Date;
    journalId: number;
  }) {
    return await Issue.create(data);
  }

  async getAllIssues() {
    return await Issue.findAll({
      include: [{ model: Paper, as: 'papers' }]
    });
  }

  async getIssueById(id: number) {
    return await Issue.findByPk(id, {
      include: [{ model: Paper, as: 'papers' }]
    });
  }

  async updateIssue(id: number, data: Partial<Issue>) {
    const issue = await Issue.findByPk(id);
    if (!issue) return null;
    return await issue.update(data);
  }

  async deleteIssue(id: number) {
    const issue = await Issue.findByPk(id);
    if (!issue) return null;
    await issue.destroy();
    return issue;
  }
}

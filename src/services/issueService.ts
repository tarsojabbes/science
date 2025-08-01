import { IssueRepository } from '../repository/issueRepository';

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
}

import { Request, Response } from 'express';
import { IssueService } from '../services/issueService';

const service = new IssueService();

export const IssueController = {
  async create(req: Request, res: Response) {
    try {
      const issue = await service.createIssue(req.body);
      res.status(201).json(issue);
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  },

  async getAll(req: Request, res: Response) {
    try {
      const issues = await service.getAllIssues();
      res.json(issues);
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  },

  async getById(req: Request, res: Response) {
    try {
      const issue = await service.getIssueById(Number(req.params.id));
      if (!issue) {
        res.status(404).json({ message: 'Issue not found' });
        return;
      }
      res.json(issue);
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  },

  async update(req: Request, res: Response) {
    try {
      const issue = await service.updateIssue(Number(req.params.id), req.body);
      if (!issue) {
        res.status(404).json({ message: 'Issue not found' });
        return;
      }
      res.json(issue);
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  },

  async delete(req: Request, res: Response) {
    try {
      const issue = await service.deleteIssue(Number(req.params.id));
      if (!issue) {
        res.status(404).json({ message: 'Issue not found' });
        return;
      }
      res.json(issue);
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  }
}

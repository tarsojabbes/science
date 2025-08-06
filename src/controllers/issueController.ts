import { Request, Response } from 'express';
import { IssueService } from '../services/issueService';
import { IssueFilters, PaginationQueryIssue } from '../types/pagination.types';

const service = new IssueService();

const parsePaginationOptions = (query: PaginationQueryIssue) => {
  const page = Math.max(1, parseInt(query.page || '1', 10));
  const limit = Math.min(100, Math.max(1, parseInt(query.limit || '10', 10)));
  const offset = (page - 1) * limit;
  
  const order: [string, string][] = [];
  if (query.sortBy) {
    const allowedSortFields = ['id', 'publishedDate', 'volume', 'journalId', 'number'];
    if (allowedSortFields.includes(query.sortBy)) {
      const sortOrder = query.sortOrder === 'desc' ? 'DESC' : 'ASC';
      order.push([query.sortBy, sortOrder]);
    }
  } else {
    order.push(['id', 'DESC']);
  }

  return {
    page,
    limit,
    offset,
    order
  };
};

const parseFilters = (query: PaginationQueryIssue): IssueFilters => {
  const filters: IssueFilters = {};


  if (query.journalId) {
    filters.journalId = parseInt(query.journalId, 10);
  }
  if (query.publishedDate) {
    filters.publishedDate = new Date(query.publishedDate);
  }

  if (query.volume) {
    filters.volume = parseInt(query.volume, 10);
  }

  if (query.number) {
    filters.number = parseInt(query.number, 10);
  }

  return filters;
};

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
      res.sendStatus(204);
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  },

  async listWithPaginationAndFilter(req: Request, res: Response) {
    try {
      const paginationOptions = parsePaginationOptions(req.query as PaginationQueryIssue);
      const filters = parseFilters(req.query as PaginationQueryIssue);
                
      const result = await service.getAllIssuesWithPaginationAndFilter(paginationOptions, filters);
      res.json(result);
    } catch (err: any) {
      res.status(500).json({error: err.message});
    }
  }
}

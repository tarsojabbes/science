import { Request, Response } from 'express';
import { JournalService } from '../services/journalService';
import { JournalFilters, PaginationQueryJournal } from '../types/pagination.types';

const service = new JournalService();

const parsePaginationOptions = (query: PaginationQueryJournal) => {
  const page = Math.max(1, parseInt(query.page || '1', 10));
  const limit = Math.min(100, Math.max(1, parseInt(query.limit || '10', 10)));
  const offset = (page - 1) * limit;
  
  const order: [string, string][] = [];
  if (query.sortBy) {
    const allowedSortFields = ['id', 'name', 'issn'];
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

const parseFilters = (query: PaginationQueryJournal): JournalFilters => {
  const filters: JournalFilters = {};

  if (query.name) {
    filters.name = query.name;
  }

  if (query.issn) {
    filters.issn = query.issn;
  }

  return filters;
};

export const JournalController = {
  async create(req: Request, res: Response) {
    try {
      const journal = await service.createJournal(req.body);
      res.status(201).json(journal);
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  },

  async getAll(req: Request, res: Response) {
    try {
      const journals = await service.getAllJournals();
      res.json(journals);
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  },

  async getById(req: Request, res: Response) {
    try {
      const journal = await service.getJournalById(Number(req.params.id));
      if (!journal) {
        res.status(404).json({ message: 'Journal not found' });
        return;
      }
      res.json(journal);
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  },

  async update(req: Request, res: Response) {
    try {
      const journal = await service.updateJournal(Number(req.params.id), req.body);
      if (!journal) {
        res.status(404).json({ message: 'Journal not found' });
        return;
      }
      res.json(journal);
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  },

  async delete(req: Request, res: Response) {
    try {
      const journal = await service.deleteJournal(Number(req.params.id));
      if (!journal) {
        res.status(404).json({ message: 'Journal not found' });
        return;
      }
      res.sendStatus(204);
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  },

  async listWithPaginationAndFilter(req: Request, res: Response): Promise<void> {
    try {
      const paginationOptions = parsePaginationOptions(req.query as PaginationQueryJournal);
      const filters = parseFilters(req.query as PaginationQueryJournal);
                
      const result = await service.getAllJournalsWithPaginationAndFilter(paginationOptions, filters);
      res.json(result);
    } catch (err: any) {
      res.status(500).json({error: err.message});
    }
  }
}

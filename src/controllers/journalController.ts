import { Request, Response } from 'express';
import { JournalService } from '../services/journalService';

const service = new JournalService();

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
  }
}

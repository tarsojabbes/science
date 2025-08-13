import { Request, Response } from 'express';
import { JournalEditorService } from '../services/journalEditorService';

export class JournalEditorController {
  private journalEditorService: JournalEditorService;

  constructor() {
    this.journalEditorService = new JournalEditorService();
  }

  async addEditorToJournal(req: Request, res: Response): Promise<void> {
    try {
      const { journalId, userId} = req.body;

      if (!journalId || !userId) {
        res.status(400).json({ error: 'Journal ID and User ID are required' });
        return;
      }

      await this.journalEditorService.addEditorToJournal(journalId, userId);
      res.status(201).json({ message: 'Editor added to journal successfully' });
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  }

  async removeEditorFromJournal(req: Request, res: Response): Promise<void> {
    try {
      const { journalId, userId } = req.params;

      if (!journalId || !userId) {
        res.status(400).json({ error: 'Journal ID and User ID are required' });
        return;
      }

      await this.journalEditorService.removeEditorFromJournal(Number(journalId), Number(userId));
      res.status(200).json({ message: 'Editor removed from journal successfully' });
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  }

  async getJournalEditors(req: Request, res: Response): Promise<void> {
    try {
      const { journalId } = req.params;

      if (!journalId) {
        res.status(400).json({ error: 'Journal ID is required' });
        return;
      }

      const editors = await this.journalEditorService.getJournalEditors(Number(journalId));
      res.status(200).json(editors);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }

  async getUserJournals(req: Request, res: Response): Promise<void> {
    try {
      const { userId } = req.params;

      if (!userId) {
        res.status(400).json({ error: 'User ID is required' });
        return;
      }

      const journals = await this.journalEditorService.getUserJournals(Number(userId));
      res.status(200).json(journals);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }

  async checkEditorPermission(req: Request, res: Response): Promise<void> {
    try {
      const { journalId, userId } = req.params;

      if (!journalId || !userId) {
        res.status(400).json({ error: 'Journal ID and User ID are required' });
        return;
      }

      const isEditor = await this.journalEditorService.isUserEditorOfJournal(Number(userId), Number(journalId));

      res.status(200).json({
        isEditor,
      });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }
} 
import { Request, Response } from 'express';
import { JournalReviewerService } from '../services/journalReviewerService';

export class JournalReviewerController {
  private journalReviewerService: JournalReviewerService;

  constructor() {
    this.journalReviewerService = new JournalReviewerService();
  }

  async addReviewerToJournal(req: Request, res: Response): Promise<void> {
    try {
      const { journalId, userId, expertise } = req.body;

      if (!journalId || !userId) {
        res.status(400).json({ error: 'Journal ID and User ID are required' });
        return;
      }

      await this.journalReviewerService.addReviewerToJournal(journalId, userId, expertise || []);
      res.status(201).json({ message: 'Reviewer added to journal successfully' });
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  }

  async removeReviewerFromJournal(req: Request, res: Response): Promise<void> {
    try {
      const { journalId, userId } = req.params;

      if (!journalId || !userId) {
        res.status(400).json({ error: 'Journal ID and User ID are required' });
        return;
      }

      await this.journalReviewerService.removeReviewerFromJournal(Number(journalId), Number(userId));
      res.status(200).json({ message: 'Reviewer removed from journal successfully' });
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  }

  async getJournalReviewers(req: Request, res: Response): Promise<void> {
    try {
      const { journalId } = req.params;

      if (!journalId) {
        res.status(400).json({ error: 'Journal ID is required' });
        return;
      }

      const reviewers = await this.journalReviewerService.getJournalReviewers(Number(journalId));
      res.status(200).json(reviewers);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }

  async getUserReviewerJournals(req: Request, res: Response): Promise<void> {
    try {
      const { userId } = req.params;

      if (!userId) {
        res.status(400).json({ error: 'User ID is required' });
        return;
      }

      const journals = await this.journalReviewerService.getUserReviewerJournals(Number(userId));
      res.status(200).json(journals);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }

  async updateReviewerExpertise(req: Request, res: Response): Promise<void> {
    try {
      const { journalId, userId } = req.params;
      const { expertise } = req.body;

      if (!journalId || !userId || !expertise) {
        res.status(400).json({ error: 'Journal ID, User ID, and expertise are required' });
        return;
      }

      await this.journalReviewerService.updateReviewerExpertise(Number(journalId), Number(userId), expertise);
      res.status(200).json({ message: 'Reviewer expertise updated successfully' });
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  }

  async deactivateReviewer(req: Request, res: Response): Promise<void> {
    try {
      const { journalId, userId } = req.params;

      if (!journalId || !userId) {
        res.status(400).json({ error: 'Journal ID and User ID are required' });
        return;
      }

      await this.journalReviewerService.deactivateReviewer(Number(journalId), Number(userId));
      res.status(200).json({ message: 'Reviewer deactivated successfully' });
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  }

  async activateReviewer(req: Request, res: Response): Promise<void> {
    try {
      const { journalId, userId } = req.params;

      if (!journalId || !userId) {
        res.status(400).json({ error: 'Journal ID and User ID are required' });
        return;
      }

      await this.journalReviewerService.activateReviewer(Number(journalId), Number(userId));
      res.status(200).json({ message: 'Reviewer activated successfully' });
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  }

  async checkReviewerPermission(req: Request, res: Response): Promise<void> {
    try {
      const { journalId, userId } = req.params;

      if (!journalId || !userId) {
        res.status(400).json({ error: 'Journal ID and User ID are required' });
        return;
      }

      const isReviewer = await this.journalReviewerService.isUserReviewerOfJournal(Number(userId), Number(journalId));
      const expertise = await this.journalReviewerService.getReviewerExpertise(Number(journalId), Number(userId));

      res.status(200).json({
        isReviewer,
        expertise
      });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }
} 
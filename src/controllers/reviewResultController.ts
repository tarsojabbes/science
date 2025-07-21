import { Request, Response } from 'express';
import { ReviewResultService } from '../services/reviewResultService';

const service = new ReviewResultService();

export const ReviewResultController = {
  async create(req: Request, res: Response): Promise<void> {
    try {
      const { reviewId, firstReviewerNote, secondReviewerNote, approval } = req.body;
      const result = await service.createResult({ reviewId, firstReviewerNote, secondReviewerNote, approval });
      res.status(201).json(result);
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  },

  async getById(req: Request, res: Response): Promise<void> {
    try {
      const result = await service.getResultById(Number(req.params.id));
      if (!result) {
        res.status(404).json({ message: 'Review result not found' });
        return;
      }
      res.json(result);
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  },

  async getByReview(req: Request, res: Response): Promise<void> {
    try {
      const results = await service.getResultsByReview(Number(req.params.reviewId));
      res.json(results);
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  },

  async update(req: Request, res: Response): Promise<void> {
  try {
    const id = Number(req.params.id);
    const { firstReviewerNote, secondReviewerNote, approval } = req.body;
    
    const updatedResult = await service.updateResult(id, {
      firstReviewerNote,
      secondReviewerNote,
      approval
    });
    
    if (!updatedResult) {
      res.status(404).json({ message: 'Review result not found' });
      return;
    }
    
    res.status(200).json(updatedResult);
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  },

  async delete(req: Request, res: Response): Promise<void> {
    try {
      const deleted = await service.deleteResult(Number(req.params.id));
      if (!deleted) {
        res.status(404).json({ message: 'Review result not found' });
        return;
      }
      res.status(204).send();
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  }
};

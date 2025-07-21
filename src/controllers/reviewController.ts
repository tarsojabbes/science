import { Request, Response } from 'express';
import { ReviewService } from '../services/reviewService';

const service = new ReviewService();

export const ReviewController = {
  async create(req: Request, res: Response): Promise<void>  {
    try {
      const { paperId, requesterId, firstReviewerId, secondReviewerId } = req.body;
      const review = await service.createReview({ paperId, requesterId, firstReviewerId, secondReviewerId, approved: false });
      res.status(201).json(review);
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  },

  async getById(req: Request, res: Response): Promise<void> {
    try {
      const review = await service.getReviewById(Number(req.params.id));
      if (!review) {
        res.status(404).json({ message: 'Review not found' });
        return;
      }
      res.json(review);
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  },

  async getByPaper(req: Request, res: Response): Promise<void>  {
    try {
      const reviews = await service.getReviewsByPaper(Number(req.params.paperId));
      res.json(reviews);
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  },

  async getAll(req: Request, res: Response): Promise<void>  {
    try {
      const reviews = await service.getAllReviews();
      res.json(reviews);
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  },

  async update(req: Request, res: Response): Promise<void> {
  try {
    const id = Number(req.params.id);
    const { paperId, approved, firstReviewerId, secondReviewerId } = req.body;
    
    const updatedReview = await service.updateReview(id, {
      paperId,
      approved,
      firstReviewerId,
      secondReviewerId
    });
    
    if (!updatedReview) {
      res.status(404).json({ message: 'Review not found' });
      return;
    }
    res.status(200).json(updatedReview);
    } catch (err: any) {
      res.status(500).json({ error: err.message });
  }
  },

  async delete(req: Request, res: Response): Promise<void>  {
    try {
      const deleted = await service.deleteReview(Number(req.params.id));
      if (!deleted) {
        res.status(404).json({ message: 'Review not found' });
        return;
      }
      res.status(204).send();
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  }
};

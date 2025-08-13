import { Request, Response } from 'express';
import { ReviewService } from '../services/reviewService';
import { AuthRequest } from '../middlewares/authMiddleware';

export class ReviewController {
  private reviewService: ReviewService;

  constructor() {
    this.reviewService = new ReviewService();
  }

  async requestReview(req: AuthRequest, res: Response): Promise<void> {
    try {
      const { paperId } = req.body;
      const requesterId = req.user?.id;

      if (!paperId) {
        res.status(400).json({ error: 'Paper ID is required' });
        return;
      }

      if (!requesterId) {
        res.status(401).json({ error: 'User authentication required' });
        return;
      }

      const review = await this.reviewService.requestReview(paperId, requesterId);
      res.status(201).json({
        message: 'Review requested successfully',
        review: {
          id: review.id,
          status: review.status,
          firstReviewerId: review.firstReviewerId,
          secondReviewerId: review.secondReviewerId,
          assignedDate: review.assignedDate
        }
      });
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  }

  async submitReviewResult(req: AuthRequest, res: Response): Promise<void> {
    try {
      const { reviewId } = req.params;
      const { recommendation, comments, overallScore } = req.body;
      const reviewerId = req.user?.id;

      if (!reviewId) {
        res.status(400).json({ error: 'Review ID is required' });
        return;
      }

      if (!reviewerId) {
        res.status(401).json({ error: 'User authentication required' });
        return;
      }

      if (!recommendation || !comments || !overallScore) {
        res.status(400).json({ error: 'All review fields are required' });
        return;
      }

      const reviewResult = await this.reviewService.submitReviewResult(parseInt(reviewId, 10), reviewerId, {
        recommendation,
        comments,
        overallScore: Number(overallScore)
      });

      res.status(200).json({
        message: 'Review result submitted successfully',
        reviewResult: {
          id: reviewResult.id,
          recommendation: reviewResult.recommendation,
          isSubmitted: reviewResult.isSubmitted
        }
      });
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  }

  async getReviewById(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const review = await this.reviewService.getReviewById(Number(id));

      if (!review) {
        res.status(404).json({ error: 'Review not found' });
        return;
      }

      res.status(200).json(review);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }

  async getReviewsByPaper(req: Request, res: Response): Promise<void> {
    try {
      const { paperId } = req.params;
      const reviews = await this.reviewService.getReviewsByPaper(Number(paperId));
      res.status(200).json(reviews);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }

  async getReviewsByReviewer(req: AuthRequest, res: Response): Promise<void> {
    try {
      const reviewerId = req.user?.id;
      if (!reviewerId) {
        res.status(401).json({ error: 'User authentication required' });
        return;
      }

      const reviews = await this.reviewService.getReviewsByReviewer(reviewerId);
      res.status(200).json(reviews);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }

  async updateReviewStatus(req: AuthRequest, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const { status, editorNotes } = req.body;
      const userId = req.user?.id;

      if (!userId) {
        res.status(401).json({ error: 'User authentication required' });
        return;
      }

      if (!status) {
        res.status(400).json({ error: 'Status is required' });
        return;
      }

      const review = await this.reviewService.updateReviewStatus(Number(id), status, editorNotes);
      res.status(200).json({
        message: 'Review status updated successfully',
        review: {
          id: review.id,
          status: review.status,
          editorNotes: review.editorNotes
        }
      });
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  }

  async getPendingReviews(req: AuthRequest, res: Response): Promise<void> {
    try {
      const reviewerId = req.user?.id;
      if (!reviewerId) {
        res.status(401).json({ error: 'User authentication required' });
        return;
      }

      const reviews = await this.reviewService.getReviewsByReviewer(reviewerId);
      const pendingReviews = reviews.filter((review: any) => 
        review.status === 'pending' || review.status === 'in_progress'
      );

      res.status(200).json(pendingReviews);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }
}

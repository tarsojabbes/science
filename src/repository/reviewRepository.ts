import { Review } from '../models/Review';
import { User } from '../models/User';
import { Paper } from '../models/Paper';
import { ReviewResult } from '../models/ReviewResult';

export class ReviewRepository {
  async createReview(data: {
    paperId: number;
    requesterId: number;
    approved: boolean;
    firstReviewerId: number;
    secondReviewerId: number;
    requestDate?: Date;
  }) {
    const review = await Review.create({
      ...data,
      requestDate: data.requestDate || new Date()
    });
    return review;
  }

  async getReviewById(id: number) {
    return await Review.findByPk(id, {
      include: [
        { model: User, as: 'requester', attributes: ['id', 'name', 'email'] },
        { model: User, as: 'firstReviewer', attributes: ['id', 'name', 'email'] },
        { model: User, as: 'secondReviewer', attributes: ['id', 'name', 'email'] },
        {
          model: ReviewResult,
          as: 'results',
          attributes: ['id', 'firstReviewerNote', 'secondReviewerNote', 'resultDate', 'approval']
        }
      ]
    });
  }

  async getReviewsByPaper(paperId: number) {
    return await Review.findAll({
      where: { paperId },
      include: [
        { model: User, as: 'requester' },
        { model: User, as: 'firstReviewer' },
        { model: User, as: 'secondReviewer' },
        { model: ReviewResult, as: 'results' }
      ]
    });
  }

  async getAllReviews() {
    return await Review.findAll({
      include: ['requester', 'firstReviewer', 'secondReviewer', 'results']
    });
  }

  async updateReview(id: number, data: {
  paperId?: number;
  approved?: boolean;
  firstReviewerId?: number;
  secondReviewerId?: number;
  }) {
    const review = await Review.findByPk(id);
    if (!review) return null;
    
    await review.update(data);
    return await this.getReviewById(id);
  }

  async deleteReview(id: number) {
    const review = await Review.findByPk(id);
    if (!review) return null;
    await review.destroy();
    return review;
  }
}

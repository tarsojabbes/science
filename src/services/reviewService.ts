import { ReviewRepository } from '../repository/reviewRepository';

export class ReviewService {
  private reviewRepo = new ReviewRepository();

  async createReview(data: {
    paperId: number;
    requesterId: number;
    approved: boolean;
    firstReviewerId: number;
    secondReviewerId: number;
  }) {
    return await this.reviewRepo.createReview(data);
  }

  async updateReview(id: number, data: {
  paperId?: number;
  approved?: boolean;
  firstReviewerId?: number;
  secondReviewerId?: number;
  }) {
    return await this.reviewRepo.updateReview(id, data);
  }

  async getReviewById(id: number) {
    return await this.reviewRepo.getReviewById(id);
  }

  async getReviewsByPaper(paperId: number) {
    return await this.reviewRepo.getReviewsByPaper(paperId);
  }

  async getAllReviews() {
    return await this.reviewRepo.getAllReviews();
  }

  async deleteReview(id: number) {
    return await this.reviewRepo.deleteReview(id);
  }
}

import { ReviewResultRepository } from '../repository/reviewResultRepository';

export class ReviewResultService {
  private resultRepo = new ReviewResultRepository();

  async createResult(data: {
    reviewId: number;
    firstReviewerNote: string;
    secondReviewerNote: string;
    approval: boolean;
  }) {
    return await this.resultRepo.createResult(data);
  }

  async getResultsByReview(reviewId: number) {
    return await this.resultRepo.getResultsByReview(reviewId);
  }

  async getResultById(id: number) {
    return await this.resultRepo.getResultById(id);
  }

  async deleteResult(id: number) {
    return await this.resultRepo.deleteResult(id);
  }
}

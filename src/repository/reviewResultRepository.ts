import { ReviewResult } from '../models/ReviewResult';

export class ReviewResultRepository {
  async createResult(data: {
    reviewId: number;
    firstReviewerNote: string;
    secondReviewerNote: string;
    approval: boolean;
    resultDate?: Date;
  }) {
    return await ReviewResult.create({
      ...data,
      resultDate: data.resultDate || new Date()
    });
  }

  async getResultsByReview(reviewId: number) {
    return await ReviewResult.findAll({
      where: { reviewId }
    });
  }

  async getResultById(id: number) {
    return await ReviewResult.findByPk(id);
  }

  async deleteResult(id: number) {
    const result = await ReviewResult.findByPk(id);
    if (!result) return null;
    await result.destroy();
    return result;
  }
}

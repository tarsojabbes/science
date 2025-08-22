import { Review } from '../models/Review';
import { ReviewResult } from '../models/ReviewResult';
import { PaperRepository } from '../repository/paperRepository';
import { JournalReviewerService } from './journalReviewerService';
import { PaperService } from './paperService';

export class ReviewService {
  private paperRepository = new PaperRepository();
  private journalReviewerService = new JournalReviewerService();
  private paperService = new PaperService();

  async requestReview(paperId: number, requesterId: number): Promise<Review> {
    try {
      const paper = await this.paperRepository.findById(paperId);
      if (!paper) {
        throw new Error('Paper not found');
      }

      if (paper.status !== 'submitted') {
        throw new Error('Paper must be in submitted status to request review');
      }

      const reviewers = await this.journalReviewerService.getRandomReviewersForJournal(paper.journalId, 2);
      if (reviewers.length < 2) {
        throw new Error(`Not enough reviewers available for journal ID ${paper.journalId}. Found: ${reviewers.length}, Required: 2`);
      }

      const review = await Review.create({
        requestDate: new Date(),
        status: 'pending',
        paperId,
        requesterId,
        firstReviewerId: parseInt(reviewers[0].id, 10),
        secondReviewerId: parseInt(reviewers[1].id, 10),
        assignedDate: new Date()
      });

      await this.paperService.updatePaper(paperId, { status: 'under_review' });

      await ReviewResult.create({
        reviewId: review.id,
        reviewerId: parseInt(reviewers[0].id, 10),
        resultDate: new Date(),
        recommendation: 'not_reviewed',
        comments: '',
        overallScore: 1,
        isSubmitted: false
      });

      await ReviewResult.create({
        reviewId: review.id,
        reviewerId: parseInt(reviewers[1].id, 10),
        resultDate: new Date(),
        recommendation: 'not_reviewed',
        comments: '',
        overallScore: 1,
        isSubmitted: false
      });

      return review;
    } catch (error) {
      console.error('Error in requestReview:', error);
      throw error;
    }
  }

  async submitReviewResult(reviewId: number, reviewerId: number, reviewData: {
    recommendation: string;
    comments: string;
    overallScore: number;
  }): Promise<ReviewResult> {
    const VALID_RECOMMENDATIONS = ['approve', 'reject', 'major_revision', 'minor_revision', 'not_reviewed'];
    if (!VALID_RECOMMENDATIONS.includes(reviewData.recommendation)) {
      throw new Error('Invalid recommendation value');
    }
    if (typeof reviewData.overallScore !== 'number' || reviewData.overallScore < 1 || reviewData.overallScore > 5) {
      throw new Error('overallScore must be between 1 and 5');
    }
    
    const review = await Review.findByPk(reviewId);
    if (!review) {
      throw new Error('Review not found');
    }

    if (review.firstReviewerId !== reviewerId && review.secondReviewerId !== reviewerId) {
      throw new Error('User is not assigned as a reviewer for this review');
    }

    const reviewResult = await ReviewResult.findOne({
      where: {
        reviewId,
        reviewerId
      }
    });

    if (!reviewResult) {
      console.warn(`Review result not found for review ${reviewId} and reviewer ${reviewerId}, creating one...`);
      
      const newReviewResult = await ReviewResult.create({
        reviewId,
        reviewerId,
        resultDate: new Date(),
        recommendation: reviewData.recommendation,
        comments: reviewData.comments,
        overallScore: reviewData.overallScore,
        isSubmitted: true
      });

      await this.checkAndUpdateReviewStatus(reviewId);
      return newReviewResult;
    }

    if (reviewResult.isSubmitted) {
      throw new Error('Review result has already been submitted');
    }

    await reviewResult.update({
      recommendation: reviewData.recommendation,
      comments: reviewData.comments,
      overallScore: reviewData.overallScore,
      isSubmitted: true
    });

    await this.checkAndUpdateReviewStatus(reviewId);
    return reviewResult;
  }

  private async checkAndUpdateReviewStatus(reviewId: number): Promise<void> {
    const review = await Review.findByPk(reviewId);
    if (!review) return;

    const reviewResults = await ReviewResult.findAll({
      where: { reviewId }
    });

    if (reviewResults.length < 2) return;

    const submittedResults = reviewResults.filter(r => r.isSubmitted);
    if (submittedResults.length < 2) return;

    const recommendations = submittedResults.map(r => r.recommendation);
    let finalDecision = 'needs_revision';
    let newStatus = 'under_review';

    if (recommendations.every(r => r === 'approve')) {
      finalDecision = 'approved';
      newStatus = 'approved';
    } else if (recommendations.every(r => r === 'reject')) {
      finalDecision = 'rejected';
      newStatus = 'rejected';
    } else if (recommendations.some(r => r === 'major_revision')) {
      finalDecision = 'needs_revision';
      newStatus = 'submitted';
    } else if (recommendations.some(r => r === 'minor_revision')) {
      finalDecision = 'needs_revision';
      newStatus = 'submitted';
    } else {
      finalDecision = 'needs_revision';
      newStatus = 'submitted';
    }

    await review.update({
      status: 'completed',
      completedDate: new Date(),
      finalDecision
    });

    if (newStatus === 'approved') {
      await this.paperService.updatePaper(review.paperId, { status: 'approved' });
    } else if (newStatus === 'rejected') {
      await this.paperService.updatePaper(review.paperId, { status: 'rejected' });
    } else if (newStatus === 'submitted') {
      await this.paperService.updatePaper(review.paperId, { status: 'submitted' });
    }
  }

  async getReviewById(id: number): Promise<Review | null> {
    return await Review.findByPk(id);
  }

  async getAllReviews(): Promise<Review[]> {
    return await Review.findAll();
  }

  async getReviewsByPaper(paperId: number): Promise<Review[]> {
    return await Review.findAll({
      where: { paperId }
    });
  }

  async getReviewsByReviewer(reviewerId: number): Promise<Review[]> {
    return await Review.findAll({
      where: {
        [require('sequelize').Op.or]: [
          { firstReviewerId: reviewerId },
          { secondReviewerId: reviewerId }
        ]
      }
    });
  }

  async getPendingReviewsForReviewer(reviewerId: number): Promise<Review[]> {
    return await Review.findAll({
      where: {
        status: 'pending',
        [require('sequelize').Op.or]: [
          { firstReviewerId: reviewerId },
          { secondReviewerId: reviewerId }
        ]
      }
    });
  }

  async updateReviewStatus(id: number, status: string): Promise<Review | null> {
    const review = await Review.findByPk(id);
    if (!review) return null;

    await review.update({ status });
    return review;
  }

  async deleteReview(id: number): Promise<boolean> {
    const review = await Review.findByPk(id);
    if (!review) return false;

    await review.destroy();
    return true;
  }
}

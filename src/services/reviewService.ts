import { Review } from '../models/Review';
import { ReviewResult } from '../models/ReviewResult';
import { Paper } from '../models/Paper';
import { JournalReviewerService } from './journalReviewerService';
import { PaperRepository } from '../repository/paperRepository';
import { UserRepository } from '../repository/userRepository';
import { Op } from 'sequelize';
import { User } from '../models/User';

export class ReviewService {
  private journalReviewerService: JournalReviewerService;
  private paperRepository: PaperRepository;
  private userRepository: UserRepository;

  constructor() {
    this.journalReviewerService = new JournalReviewerService();
    this.paperRepository = new PaperRepository();
    this.userRepository = new UserRepository();
  }

  async requestReview(paperId: number, requesterId: number): Promise<Review> {
    try {
      // Get the paper and its journal
      const paper = await this.paperRepository.findById(paperId);
      if (!paper) {
        throw new Error('Paper not found');
      }

      if (paper.status !== 'submitted') {
        throw new Error('Paper must be in submitted status to request review');
      }

      // Get random reviewers for the journal
      const reviewers = await this.journalReviewerService.getRandomReviewersForJournal(paper.journalId, 2);
      if (reviewers.length < 2) {
        throw new Error(`Not enough reviewers available for journal ID ${paper.journalId}. Found: ${reviewers.length}, Required: 2`);
      }

      // Create the review
      const review = await Review.create({
        requestDate: new Date(),
        status: 'pending',
        paperId,
        requesterId,
        firstReviewerId: parseInt(reviewers[0].id, 10),
        secondReviewerId: parseInt(reviewers[1].id, 10),
        assignedDate: new Date()
      });

      // Update paper status to under_review
      await this.paperRepository.updatePaper(paperId, { status: 'under_review' });

      // Create review result placeholders for both reviewers
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
    // Find the review result for this reviewer
    const reviewResult = await ReviewResult.findOne({
      where: {
        reviewId,
        reviewerId
      }
    });

    if (!reviewResult) {
      throw new Error('Review result not found for this reviewer');
    }

    if (reviewResult.isSubmitted) {
      throw new Error('Review result already submitted');
    }

    // Update the review result
    await reviewResult.update({
      ...reviewData,
      resultDate: new Date(),
      isSubmitted: true
    });

    // Check if both reviewers have submitted their results
    const allResults = await ReviewResult.findAll({
      where: { reviewId }
    });

    if (allResults.every(result => result.isSubmitted)) {
      await this.completeReview(reviewId);
    }

    return reviewResult;
  }

  private async completeReview(reviewId: number): Promise<void> {
    const review = await Review.findByPk(reviewId, {
      include: [{
        model: ReviewResult,
        as: 'results'
      }]
    });

    if (!review) {
      throw new Error('Review not found');
    }

    const results = (review as any).results;
    
    // Calculate final decision based on reviewer recommendations
    const recommendations = results.map((r: any) => r.recommendation);
    const finalDecision = this.calculateFinalDecision(recommendations);

    // Update review status
    await review.update({
      status: 'completed',
      completedDate: new Date(),
      finalDecision
    });

    // Update paper status based on final decision
    const paper = await this.paperRepository.findById(review.paperId);
    if (paper) {
      let newStatus = 'rejected';
      if (finalDecision === 'approved') {
        newStatus = 'approved';
      } else if (finalDecision === 'needs_revision') {
        newStatus = 'submitted'; // Back to submitted for revision
      }

      await this.paperRepository.updatePaper(review.paperId, { status: newStatus });
    }
  }

  private calculateFinalDecision(recommendations: string[]): string {
    const approveCount = recommendations.filter(r => r === 'approve').length;
    const rejectCount = recommendations.filter(r => r === 'reject').length;
    const majorRevisionCount = recommendations.filter(r => r === 'major_revision').length;
    const minorRevisionCount = recommendations.filter(r => r === 'minor_revision').length;

    // If both reviewers approve, approve
    if (approveCount === 2) {
      return 'approved';
    }

    // If both reviewers reject, reject
    if (rejectCount === 2) {
      return 'rejected';
    }

    // If one approves and one rejects, needs revision
    if (approveCount === 1 && rejectCount === 1) {
      return 'needs_revision';
    }

    // If any major revision is requested, needs revision
    if (majorRevisionCount > 0) {
      return 'needs_revision';
    }

    // If both request minor revision, needs revision
    if (minorRevisionCount === 2) {
      return 'needs_revision';
    }

    // Default to needs revision for mixed opinions
    return 'needs_revision';
  }

  async getReviewById(reviewId: number): Promise<any> {
    const review = await Review.findByPk(reviewId, {
      include: [
        {
          model: ReviewResult,
          as: 'results',
          include: [{
            model: User,
            as: 'reviewer'
          }]
        },
        {
          model: User,
          as: 'requester'
        },
        {
          model: User,
          as: 'firstReviewer'
        },
        {
          model: User,
          as: 'secondReviewer'
        }
      ]
    });

    return review;
  }

  async getReviewsByPaper(paperId: number): Promise<Review[]> {
    return await Review.findAll({
      where: { paperId },
      include: [
        {
          model: ReviewResult,
          as: 'results'
        }
      ],
      order: [['requestDate', 'DESC']]
    });
  }

  async getReviewsByReviewer(reviewerId: number): Promise<any[]> {
    const reviews = await Review.findAll({
      where: {
        [Op.or]: [
          { firstReviewerId: reviewerId },
          { secondReviewerId: reviewerId }
        ]
      },
      include: [
        {
          model: ReviewResult,
          as: 'results',
          where: { reviewerId }
        },
        {
          model: Paper,
          as: 'paper'
        }
      ],
      order: [['requestDate', 'DESC']]
    });

    return reviews;
  }

  async updateReviewStatus(reviewId: number, status: string, editorNotes?: string): Promise<Review> {
    const review = await Review.findByPk(reviewId);
    if (!review) {
      throw new Error('Review not found');
    }

    await review.update({
      status,
      editorNotes: editorNotes || review.editorNotes
    });

    return review;
  }
}

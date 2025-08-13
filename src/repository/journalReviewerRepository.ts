import { JournalReviewer } from '../models/JournalReviewer';
import { User } from '../models/User';
import { Journal } from '../models/Journal';
import sequelize from '../config/database';

export class JournalReviewerRepository {
  async addReviewer(journalId: number, userId: number, expertise: string[] = []): Promise<JournalReviewer> {
    return await JournalReviewer.create({
      journalId,
      userId,
      expertise,
      assignedAt: new Date(),
      isActive: true
    });
  }

  async removeReviewer(journalId: number, userId: number): Promise<number> {
    return await JournalReviewer.destroy({
      where: {
        journalId,
        userId
      }
    });
  }

  async getJournalReviewers(journalId: number): Promise<User[]> {
    const journal = await Journal.findByPk(journalId, {
      include: [{
        model: User,
        as: 'reviewers',
        through: { 
          attributes: ['expertise', 'assignedAt', 'isActive'],
          where: { isActive: true }
        }
      }]
    });
    return journal?.reviewers || [];
  }

  async getUserReviewerJournals(userId: number): Promise<Journal[]> {
    const user = await User.findByPk(userId, {
      include: [{
        model: Journal,
        as: 'reviewerJournals',
        through: { 
          attributes: ['expertise', 'assignedAt', 'isActive'],
          where: { isActive: true }
        }
      }]
    });
    return user?.reviewerJournals || [];
  }

  async isUserReviewerOfJournal(userId: number, journalId: number): Promise<boolean> {
    const reviewer = await JournalReviewer.findOne({
      where: {
        userId,
        journalId,
        isActive: true
      }
    });
    return !!reviewer;
  }

  async updateReviewerExpertise(journalId: number, userId: number, expertise: string[]): Promise<[number]> {
    return await JournalReviewer.update(
      { expertise },
      {
        where: {
          journalId,
          userId
        }
      }
    );
  }

  async deactivateReviewer(journalId: number, userId: number): Promise<[number]> {
    return await JournalReviewer.update(
      { isActive: false },
      {
        where: {
          journalId,
          userId
        }
      }
    );
  }

  async activateReviewer(journalId: number, userId: number): Promise<[number]> {
    return await JournalReviewer.update(
      { isActive: true },
      {
        where: {
          journalId,
          userId
        }
      }
    );
  }

  async getRandomReviewers(journalId: number, count: number = 2): Promise<User[]> {
    const reviewers = await JournalReviewer.findAll({
      where: {
        journalId,
        isActive: true
      },
      include: [{
        model: User,
        as: 'user'
      }],
      order: sequelize.random(),
      limit: count
    });
    
    return reviewers.map(reviewer => (reviewer as any).user);
  }

  async getReviewerExpertise(journalId: number, userId: number): Promise<string[]> {
    const reviewer = await JournalReviewer.findOne({
      where: {
        journalId,
        userId
      }
    });
    return reviewer?.expertise || [];
  }
} 
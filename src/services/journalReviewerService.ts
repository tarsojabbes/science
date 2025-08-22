import { JournalReviewerRepository } from '../repository/journalReviewerRepository';
import { UserRepository } from '../repository/userRepository';
import { JournalRepository } from '../repository/journalRepository';

export class JournalReviewerService {
  private journalReviewerRepository: JournalReviewerRepository;
  private userRepository: UserRepository;
  private journalRepository: JournalRepository;

  constructor() {
    this.journalReviewerRepository = new JournalReviewerRepository();
    this.userRepository = new UserRepository();
    this.journalRepository = new JournalRepository();
  }

  async addReviewerToJournal(journalId: number, userId: number, expertise: string[] = []): Promise<void> {

    const journal = await this.journalRepository.getJournalById(journalId);
    if (!journal) {
      throw new Error('Journal not found');
    }

    const user = await this.userRepository.findById(userId);
    if (!user) {
      throw new Error('User not found');
    }


    const isAlreadyReviewer = await this.journalReviewerRepository.isUserReviewerOfJournal(userId, journalId);
    if (isAlreadyReviewer) {
      throw new Error('User is already a reviewer of this journal');
    }

    await this.journalReviewerRepository.addReviewer(journalId, userId, expertise);
  }

  async removeReviewerFromJournal(journalId: number, userId: number): Promise<void> {
    const deletedCount = await this.journalReviewerRepository.removeReviewer(journalId, userId);
    if (deletedCount === 0) {
      throw new Error('User is not a reviewer of this journal');
    }
  }

  async getJournalReviewers(journalId: number): Promise<any[]> {
    const reviewers = await this.journalReviewerRepository.getJournalReviewers(journalId);
    return reviewers.map(reviewer => ({
      id: reviewer.id,
      name: reviewer.name,
      email: reviewer.email,
      institution: reviewer.institution,
      orcid: reviewer.orcid,
      expertise: (reviewer as any).JournalReviewer?.expertise || [],
      assignedAt: (reviewer as any).JournalReviewer?.assignedAt
    }));
  }

  async getUserReviewerJournals(userId: number): Promise<any[]> {
    const journals = await this.journalReviewerRepository.getUserReviewerJournals(userId);
    return journals.map(journal => ({
      id: journal.id,
      name: journal.name,
      issn: journal.issn,
      expertise: (journal as any).JournalReviewer?.expertise || [],
      assignedAt: (journal as any).JournalReviewer?.assignedAt
    }));
  }

  async isUserReviewerOfJournal(userId: number, journalId: number): Promise<boolean> {
    return await this.journalReviewerRepository.isUserReviewerOfJournal(userId, journalId);
  }

  async updateReviewerExpertise(journalId: number, userId: number, expertise: string[]): Promise<void> {
    const updatedCount = await this.journalReviewerRepository.updateReviewerExpertise(journalId, userId, expertise);
    if (updatedCount[0] === 0) {
      throw new Error('User is not a reviewer of this journal');
    }
  }

  async deactivateReviewer(journalId: number, userId: number): Promise<void> {
    const updatedCount = await this.journalReviewerRepository.deactivateReviewer(journalId, userId);
    if (updatedCount[0] === 0) {
      throw new Error('User is not a reviewer of this journal');
    }
  }

  async activateReviewer(journalId: number, userId: number): Promise<void> {
    const updatedCount = await this.journalReviewerRepository.activateReviewer(journalId, userId);
    if (updatedCount[0] === 0) {
      throw new Error('User is not a reviewer of this journal');
    }
  }

  async getRandomReviewersForJournal(journalId: number, count: number = 2): Promise<any[]> {
    const reviewers = await this.journalReviewerRepository.getRandomReviewers(journalId, count);
    return reviewers.map(reviewer => ({
      id: reviewer.id,
      name: reviewer.name,
      email: reviewer.email,
      institution: reviewer.institution,
      orcid: reviewer.orcid
    }));
  }

  async getReviewerExpertise(journalId: number, userId: number): Promise<string[]> {
    return await this.journalReviewerRepository.getReviewerExpertise(journalId, userId);
  }
} 
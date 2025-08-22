import { JournalEditorRepository } from '../repository/journalEditorRepository';
import { UserRepository } from '../repository/userRepository';
import { JournalRepository } from '../repository/journalRepository';

export class JournalEditorService {
  private journalEditorRepository: JournalEditorRepository;
  private userRepository: UserRepository;
  private journalRepository: JournalRepository;

  constructor() {
    this.journalEditorRepository = new JournalEditorRepository();
    this.userRepository = new UserRepository();
    this.journalRepository = new JournalRepository();
  }

  async addEditorToJournal(journalId: number, userId: number): Promise<void> {

    const journal = await this.journalRepository.getJournalById(journalId);
    if (!journal) {
      throw new Error('Journal not found');
    }

    const user = await this.userRepository.findById(userId);
    if (!user) {
      throw new Error('User not found');
    }


    const isAlreadyEditor = await this.journalEditorRepository.isUserEditorOfJournal(userId, journalId);
    if (isAlreadyEditor) {
      throw new Error('User is already an editor of this journal');
    }

    await this.journalEditorRepository.addEditor(journalId, userId);
  }

  async removeEditorFromJournal(journalId: number, userId: number): Promise<void> {
    const deletedCount = await this.journalEditorRepository.removeEditor(journalId, userId);
    if (deletedCount === 0) {
      throw new Error('User is not an editor of this journal');
    }
  }

  async getJournalEditors(journalId: number): Promise<any[]> {
    const editors = await this.journalEditorRepository.getJournalEditors(journalId);
    return editors.map(editor => ({
      id: editor.id,
      name: editor.name,
      email: editor.email,
      institution: editor.institution,
      orcid: editor.orcid,
      assignedAt: (editor as any).JournalEditor?.assignedAt
    }));
  }

  async getUserJournals(userId: number): Promise<any[]> {
    const journals = await this.journalEditorRepository.getUserJournals(userId);
    return journals.map(journal => ({
      id: journal.id,
      name: journal.name,
      issn: journal.issn,
      assignedAt: (journal as any).JournalEditor?.assignedAt
    }));
  }

  async isUserEditorOfJournal(userId: number, journalId: number): Promise<boolean> {
    return await this.journalEditorRepository.isUserEditorOfJournal(userId, journalId);
  }

  async canUserCreateIssue(userId: number, journalId: number): Promise<boolean> {
    return await this.journalEditorRepository.isUserEditorOfJournal(userId, journalId);
  }
} 
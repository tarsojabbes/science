import { JournalEditor } from '../models/JournalEditor';
import { User } from '../models/User';
import { Journal } from '../models/Journal';

export class JournalEditorRepository {
  async addEditor(journalId: number, userId: number): Promise<JournalEditor> {
    return await JournalEditor.create({
      journalId,
      userId,
      assignedAt: new Date()
    });
  }

  async removeEditor(journalId: number, userId: number): Promise<number> {
    return await JournalEditor.destroy({
      where: {
        journalId,
        userId
      }
    });
  }

  async getJournalEditors(journalId: number): Promise<User[]> {
    const journal = await Journal.findByPk(journalId, {
      include: [{
        model: User,
        as: 'editors',
        through: { attributes: ['assignedAt'] }
      }]
    });
    return journal?.editors || [];
  }

  async getUserJournals(userId: number): Promise<Journal[]> {
    const user = await User.findByPk(userId, {
      include: [{
        model: Journal,
        as: 'editorJournals',
        through: { attributes: ['assignedAt'] }
      }]
    });
    return user?.editorJournals || [];
  }

  async isUserEditorOfJournal(userId: number, journalId: number): Promise<boolean> {
    const editor = await JournalEditor.findOne({
      where: {
        userId,
        journalId
      }
    });
    return !!editor;
  }
} 
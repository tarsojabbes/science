import { Request, Response, NextFunction } from 'express';
import { JournalEditorService } from '../services/journalEditorService';

const journalEditorService = new JournalEditorService();

export const requireEditorPermission = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const journalId = req.params.journalId || req.body.journalId;
    const userId = (req as any).user?.id;

    if (!journalId) {
      res.status(400).json({ error: 'Journal ID is required' });
      return 
    }

    if (!userId) {
       res.status(401).json({ error: 'User authentication required' });
       return
    }

    const isEditor = await journalEditorService.isUserEditorOfJournal(userId, Number(journalId));
    if (!isEditor) {
      res.status(403).json({ error: 'Editor permission required for this action' });
      return
    }

    next();
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const optionalEditorPermission = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const journalId = req.params.journalId || req.body.journalId;
    const userId = (req as any).user?.id;

    if (!journalId || !userId) {
      return next();
    }

    const isEditor = await journalEditorService.isUserEditorOfJournal(userId, Number(journalId));
    (req as any).isEditor = isEditor;

    next();
  } catch (error: any) {

    (req as any).isEditor = false;
    next();
  }
}; 